import { AbstractPluginClass, TypeJsonObject, TypeJsonValue, TypeRecordOfPlugin } from '../core/types/cgpv-types';
/**
 * Class to manage plugins
 *
 * @exports
 * @class
 */
export declare class Plugin {
    #private;
    pluginsLoaded: boolean;
    plugins: TypeRecordOfPlugin;
    /**
     * Load a package script on runtime
     *
     * @param {string} id the package id to load
     */
    loadScript: (id: string) => Promise<any>;
    /**
     * Add new plugin
     *
     * @param {string} pluginId the plugin id
     * @param {string} mapId id of map to add this plugin to
     * @param {Class} constructor the plugin class (React Component)
     * @param {Object} props the plugin properties
     */
    addPlugin: (pluginId: string, mapId: string, constructor?: AbstractPluginClass | ((pluginId: string, props: TypeJsonObject) => TypeJsonValue) | undefined, props?: TypeJsonObject | undefined) => Promise<void>;
    /**
     * Delete a plugin
     *
     * @param {string} pluginId the id of the plugin to delete
     * @param {string} mapId the map id to remove the plugin from (if not provided then plugin will be removed from all maps)
     */
    removePlugin: (pluginId: string, mapId?: string | undefined) => void;
    /**
     * Delete all plugins loaded in a map
     *
     * @param {string} mapId the map id to remove the plugin from (if not provided then plugin will be removed from all maps)
     */
    removePlugins: (mapId: string) => void;
    /**
     * A function that will load each plugin on a map then checks if there are a next plugin to load
     *
     * @param {string} mapIndex the map index to load the plugin at
     * @param {string} pluginIndex the plugin index to load
     */
    loadPlugin: (mapIndex: number, pluginIndex: number) => void;
    /**
     * Load plugins provided by map config
     */
    loadPlugins: () => void;
}
