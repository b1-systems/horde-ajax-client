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

/**
 * Horde response message base type
 *
 * @since v1.0.0
 */
export type HordeAjaxClientResponseMessage = {
    message: string,
    type: string
};

/**
 * Array of Horde response messages
 *
 * @since v1.0.0
 */
export type HordeAjaxClientResponseMessages = HordeAjaxClientResponseMessage[];
