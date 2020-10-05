/**
 * (C) B1 Systems GmbH, 2020+
 * https://www.b1-systems.de
 *
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/.
 *
 * https://www.mozilla.org/en-US/MPL/2.0/
 *
 * @license Mozilla Public License, v. 2.0
 */

import { HttpClientQueryParams, HttpClientRequestArgs, HttpClientRequestData, HttpClientResponse, HttpJsonClient, MapObject } from 'djt-http-client';
import { HordeAjaxClientError } from './horde-ajax-client-error';
import { HordeAjaxClientResponseMessages } from './horde-ajax-client-interfaces';

/**
 * Minimal HTTP client for Horde.
 *
 * @author    Tobias Wolf
 * @copyright B1 Systems GmbH, 2020+
 * @package   horde-ajax-client
 * @since     v1.0.0
 * @license   https://www.mozilla.org/en-US/MPL/2.0/
 *            Mozilla Public License, v. 2.0
 */
export class HordeAjaxClient extends HttpJsonClient {
    /**
     * API base URL
     */
    protected baseUrl: string;
    /**
     * API Horde token
     */
    protected token: string;

    /**
     * Constructor (HordeAjaxClient)
     *
     * @param url URL to be called
     * @param timeout Socket timeout
     *
     * @since v1.0.0
     */
    constructor(baseUrl?: string, token?: string, timeout = 30) {
        if (baseUrl === undefined || token === undefined) {
            if (typeof HordeCore != 'object') {
                throw new Error('Invalid initialization of HordeAjaxClient without HordeCore in namespace');
            }

            if (baseUrl === undefined) {
                baseUrl = HordeCore.conf.URI_AJAX;
            }

            if (token === undefined) {
                token = HordeCore.conf.TOKEN;
            }
        }

        super(baseUrl, timeout);

        this.baseUrl = baseUrl;
        this.token = token;
    }

    /**
     * Configures the HTTP request for later use.
     *
     * @param url URL to be called
     *
     * @since v1.0.0
     */
    protected configure(url: string) {
        if (url.startsWith('./')) {
            url = this.baseUrl + url.slice(this.baseUrl.slice(-1) === '/' ? 2 : 1);
        }

        super.configure(url);
    }

    /**
     * Handles the JSON response received.
     *
     * @param response Structured response data object
     *
     * @since v1.0.0
     */
    protected async handleJsonResponse(response: HttpClientResponse) {
        // Horde constructs JSON in a non-compliant way so we need to convert it manually
        const data = await response.rawResponse.text();
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const responseData = JSON.parse(data.substring(10, data.length - 2));

        delete(response.rawResponse);

        /* eslint-disable @typescript-eslint/no-unsafe-member-access */
        if (responseData.response && responseData.response.success) {
            response.body = responseData.response;
        } else if (
            Array.isArray(responseData.msgs)
            && responseData.msgs.length > 0
            && responseData.msgs[0].message
            && responseData.msgs[0].type
        ) {
            const additionalMessages = (responseData.msgs as HordeAjaxClientResponseMessages).slice(1);
            response.body = new HordeAjaxClientError(responseData.msgs[0].message, responseData.msgs[0].type, additionalMessages);
        } else {
            response.body = new Error('Unknown server-side error occurred');
        }
        /* eslint-enable @typescript-eslint/no-unsafe-member-access */
    }

    /**
     * Call a given request method on the configured HTTP server.
     *
     * @param method HTTP method
     * @param separator Query parameter separator
     * @param params Parsed query parameters as str
     * @param data HTTP body
     *
     * @return Response data; 'body' may contain the catched exception
     * @since  v1.0.0
     */
    public async request(method: string, separator = ';', params?: HttpClientQueryParams, data?: HttpClientRequestData) {
        if (data) {
            if ((typeof Blob == 'undefined' || (!(data instanceof Blob)))
                && (typeof ArrayBuffer == 'undefined' || (!(data instanceof ArrayBuffer)))
                && (typeof ReadableStream == 'undefined' || (!(data instanceof ReadableStream)))
                && data instanceof Object
            ) {
                if (!this._requestInstance.headers.has('accept')) {
                    this._requestInstance.headers.set('accept', 'application/json');
                }

                if (!this._requestInstance.headers.has('content-type')) {
                    let contentType = 'application/x-www-form-urlencoded';

                    if (document.characterSet) {
                        contentType += `; charset=${document.characterSet}`;
                    }

                    this._requestInstance.headers.set('content-type', contentType);
                }

                const dataMapObject = data as MapObject;
                const jsonQueryData: MapObject = { };

                for (const key in data as MapObject) {
                    jsonQueryData[key] = (typeof dataMapObject[key] == 'object' ? JSON.stringify(dataMapObject[key]) : dataMapObject[key]);
                }

                data = this.buildRequestParameters(jsonQueryData, '&');
            }
        }

        return super.request(method, separator, params, data);
    }

    /**
     * Sends the request to the configured HTTP server and returns the result.
     *
     * @param method HTTP method
     * @param requestArgs Request arguments to be used
     *
     * @return Response data; 'body' may contain the catched Exception
     * @since  v1.0.0
     */
    protected async _request(method: string, requestArgs: HttpClientRequestArgs) {
        if (requestArgs.params) {
            requestArgs.params += (requestArgs.params.includes('?') ? '&' : '?') + `token=${this.token}`;
        } else {
            requestArgs.params = `?token=${this.token}`;
        }

        return super._request(method, requestArgs);
    }
}
