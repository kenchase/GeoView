import { TypePluginOptions, TypeJsonObject } from '../cgpv-types';
export declare abstract class AbstractPluginClass {
    id: string;
    pluginProps: TypePluginOptions;
    configObj?: TypeJsonObject;
    constructor(id: string, props: TypePluginOptions);
}
