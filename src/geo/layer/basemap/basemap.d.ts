import { TypeBasemapProps, TypeBasemapOptions, TypeAttribution } from '../../../core/types/cgpv-types';
/**
 * A class to get a Basemap for a define projection and language. For the moment, a list maps are available and
 * can be filtered by projection (currently only WM and LCC projections are listed,
 * in case other projections needed, they need to be added to the list)
 *
 * @export
 * @class Basemap
 */
export declare class Basemap {
    basemaps: TypeBasemapProps[];
    activeBasemap: TypeBasemapProps;
    language: string;
    basemapOptions: TypeBasemapOptions;
    private projection;
    private mapId;
    private basemapsPaneName;
    /**
     * initialize basemap
     *
     * @param {TypeBasemapOptions} basemapOptions optional basemap option properties, passed in from map config
     * @param {string} language language to be used either en-CA or fr-CA
     * @param {number} projection projection number
     */
    constructor(basemapOptions: TypeBasemapOptions, language: string, projection: number, mapId?: string);
    /**
     * basemap list
     */
    basemapsList: Record<number, Record<string, string>>;
    /**
     * basemap layer configuration
     */
    private basemapLayerOptions;
    /**
     * attribution to add the the map
     */
    private attributionVal;
    /**
     * Get basemap thumbnail url
     *
     * @param {string[]} basemapTypes basemap layer type (shaded, transport, label, simple)
     * @param {TypeProjections} projection basemap projection
     * @param {TypeLocalizedLanguages} language basemap language
     * @returns {string[]} array of thumbnail urls
     */
    private getThumbnailUrl;
    /**
     * Get basemap information (nbame and description)
     *
     * @param {string[]} basemapTypes basemap layer type (shaded, transport, label, simple)
     * @param {TypeProjections} projection basemap projection
     * @param {TypeLocalizedLanguages} language basemap language
     * @returns {string} array with information [name, description]
     */
    private getInfo;
    /**
     * Check if the type of basemap already exist
     *
     * @param {string} type basemap type
     * @returns {boolean} true if basemap exist, false otherwise
     */
    isExisting: (type: string) => boolean;
    /**
     * Create the core basemap and add the layers to it
     *
     * @param {TypeBasemapOptions} basemapOptions basemap options
     */
    createCoreBasemap: (basemapOptions: TypeBasemapOptions) => void;
    /**
     * Create a custom basemap
     *
     * @param {TypeBasemapProps} basemapProps basemap properties
     */
    createCustomBasemap: (basemapProps: TypeBasemapProps) => void;
    /**
     * Load the default basemap that was passed in the map config
     *
     * @param {TypeBasemapOptions} basemapOptions basemap options
     */
    loadDefaultBasemaps: (basemapOptions: TypeBasemapOptions) => void;
    /**
     * Create a new basemap
     *
     * @param {TypeBasemapProps} basemapProps basemap properties
     */
    private createBasemap;
    /**
     * Set the current basemap and update the basemap layers on the map
     *
     * @param {string} id the id of the basemap
     */
    setBasemap: (id: string) => void;
    /**
     * get attribution value to add the the map
     *
     * @returns {TypeAttribution} the attribution value
     */
    get attribution(): TypeAttribution;
}
