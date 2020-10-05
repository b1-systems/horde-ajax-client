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

import { HordeAjaxClientResponseMessages } from './horde-ajax-client-interfaces';

/**
 * Basic error class accepting the type property from Horde.
 *
 * @author    Tobias Wolf
 * @copyright B1 Systems GmbH, 2020+
 * @package   horde-ajax-client
 * @since     v1.0.0
 * @license   https://www.mozilla.org/en-US/MPL/2.0/
 *            Mozilla Public License, v. 2.0
 */
export class HordeAjaxClientError extends Error {
    /**
     * Horde error type
     */
    public readonly additionalMessages?: HordeAjaxClientResponseMessages;
    /**
     * Horde error type
     */
    public readonly type?: string;

    /**
     * Constructor (HordeAjaxClientError)
     *
     * @param message Horde error message
     * @param timeout Horde error type
     *
     * @since v1.0.0
     */
    constructor(message?: string, type?: string, additionalMessages?: HordeAjaxClientResponseMessages) {
        super(message);

        this.additionalMessages = additionalMessages;
        this.type = type;
    }
}
