import { PayloadBaseClass } from './payload-base-class';
import { EventStringId } from '../event';
export declare const payloadIsAttribution: (verifyIfPayload: PayloadBaseClass) => verifyIfPayload is AttributionPayload;
export declare class AttributionPayload extends PayloadBaseClass {
    attribution: string;
    /**
     * Constructor for the class
     *
     * @param {EventStringId} event the event identifier for which the payload is constructed
     * @param {string | null} handlerName the handler Name
     * @param {string} attribution attribution text
     */
    constructor(event: EventStringId, handlerName: string | null, attribution: string);
}
/**
 * Helper function used to instanciate a AttributionPayload object. This function
 * avoids the "new AttributionPayload" syntax.
 *
 * @param {EventStringId} event the event identifier for which the payload is constructed
 * @param {string | null} handlerName the handler name
 * @param {string} attribution the attribution text
 *
 * @returns {AttributionPayload} the AttributionPayload object created
 */
export declare const attributionPayload: (event: EventStringId, handlerName: string | null, attribution: string) => AttributionPayload;
