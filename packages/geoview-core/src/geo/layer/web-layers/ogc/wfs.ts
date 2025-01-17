import axios from 'axios';

import VectorLayer from 'ol/layer/Vector';
import { Vector as VectorSource } from 'ol/source';
import { GeoJSON as GeoJSONFormat } from 'ol/format';
import { Extent } from 'ol/extent';
import { Style, Stroke, Fill, Circle as StyleCircle } from 'ol/style';
import { asArray, asString } from 'ol/color';
import { all } from 'ol/loadingstrategy';
import { transformExtent } from 'ol/proj';

import {
  AbstractWebLayersClass,
  CONST_LAYER_TYPES,
  TypeJsonObject,
  TypeWFSLayer,
  TypeJsonArray,
  TypeBaseWebLayersConfig,
} from '../../../../core/types/cgpv-types';
import { getXMLHttpRequest, setAlphaColor, xmlToJson } from '../../../../core/utils/utilities';

import { api } from '../../../../app';

// constant to define default style if not set by renderer
// TODO: put somewhere to reuse for all vector layers + maybe array so if many layer, we increase the choice
const defaultCircleMarkerStyle = new Style({
  image: new StyleCircle({
    radius: 5,
    stroke: new Stroke({
      color: asString(setAlphaColor(asArray('#333'), 1)),
      width: 1,
    }),
    fill: new Fill({
      color: asString(setAlphaColor(asArray('#FFB27F'), 0.8)),
    }),
  }),
});

const defaultLineStringStyle = new Style({
  stroke: new Stroke({
    color: asString(setAlphaColor(asArray('#000000'), 1)),
    width: 2,
  }),
});

const defaultLinePolygonStyle = new Style({
  stroke: new Stroke({
    // 1 is for opacity
    color: asString(setAlphaColor(asArray('#000000'), 1)),
    width: 2,
  }),
  fill: new Fill({
    color: asString(setAlphaColor(asArray('#000000'), 0.5)),
  }),
});

const defaultSelectStyle = new Style({
  stroke: new Stroke({
    color: asString(setAlphaColor(asArray('#0000FF'), 1)),
    width: 3,
  }),
  fill: new Fill({
    color: asString(setAlphaColor(asArray('#0000FF'), 0.5)),
  }),
});

/**
 * Create a style from a renderer object
 *
 * @param {TypeJsonObject} renderer the render with the style properties
 * @returns {Style} the new style with the custom renderer
 */
const createStyleFromRenderer = (renderer: TypeJsonObject): Style => {
  return renderer.radius
    ? new Style({
        image: new StyleCircle({
          radius: renderer.radius as number,
          stroke: new Stroke({
            color: asString(setAlphaColor(asArray(renderer.color as string), renderer.opacity as number)),
            width: 1,
          }),
          fill: new Fill({
            color: asString(setAlphaColor(asArray(renderer.fillColor as string), renderer.fillOpacity as number)),
          }),
        }),
      })
    : new Style({
        stroke: new Stroke({
          color: asString(setAlphaColor(asArray(renderer.color as string), renderer.opacity as number)),
          width: 3,
        }),
        fill: new Fill({
          color: asString(setAlphaColor(asArray(renderer.fillColor as string), renderer.fillOpacity as number)),
        }),
      });
};

/* ******************************************************************************************************************************
 * Type Gard function that redefines a TypeBaseWebLayersConfig as a TypeWFSLayer
 * if the layerType attribute of the verifyIfLayer parameter is WFS. The type ascention
 * applies only to the the true block of the if clause that use this function.
 *
 * @param {TypeBaseWebLayersConfig} polymorphic object to test in order to determine if the type ascention is valid
 *
 * @return {boolean} true if the type ascention is valid
 */
export const layerConfigIsWFS = (verifyIfLayer: TypeBaseWebLayersConfig): verifyIfLayer is TypeWFSLayer => {
  return verifyIfLayer.layerType === CONST_LAYER_TYPES.WFS;
};

/* ******************************************************************************************************************************
 * Type Gard function that redefines an AbstractWebLayersClass as a WFS
 * if the type attribute of the verifyIfWebLayer parameter is WFS. The type ascention
 * applies only to the the true block of the if clause that use this function.
 *
 * @param {AbstractWebLayersClass} polymorphic object to test in order to determine if the type ascention is valid
 *
 * @return {boolean} true if the type ascention is valid
 */
export const webLayerIsWFS = (verifyIfWebLayer: AbstractWebLayersClass): verifyIfWebLayer is WFS => {
  return verifyIfWebLayer.type === CONST_LAYER_TYPES.WFS;
};

/**
 * a class to add WFS layer
 *
 * @exports
 * @class WFS
 */
export class WFS extends AbstractWebLayersClass {
  // layer
  layer!: VectorLayer<VectorSource>;

  // private varibale holding wms capabilities
  #capabilities: TypeJsonObject = {};

  // private varibale holding wms paras
  #version = '2.0.0';

  /**
   * Initialize layer
   * @param {string} mapId the id of the map
   * @param {TypeWFSLayer} layerConfig the layer configuration
   */
  constructor(mapId: string, layerConfig: TypeWFSLayer) {
    super(CONST_LAYER_TYPES.WFS, layerConfig, mapId);

    this.entries = layerConfig.layerEntries.map((item) => item.id);
  }

  /**
   * Add a WFS layer to the map.
   *
   * @param {TypeWFSLayer} layer the layer configuration
   * @return {Promise<VectorLayer<VectorSource> | null>} layers to add to the map
   */
  async add(layer: TypeWFSLayer): Promise<VectorLayer<VectorSource> | null> {
    // const resCapabilities = await axios.get<TypeJsonObject>(this.url, {
    //   params: { request: 'getcapabilities', service: 'WFS' },
    // });
    const resCapabilities = await getXMLHttpRequest(`${this.url}?service=WFS&request=getcapabilities`);

    // need to pass a xmldom to xmlToJson
    const xmlDOM = new DOMParser().parseFromString(resCapabilities as string, 'text/xml');
    const json = xmlToJson(xmlDOM);

    this.#capabilities = json['wfs:WFS_Capabilities'];
    this.#version = json['wfs:WFS_Capabilities']['@attributes'].version as string;

    const featTypeInfo = this.getFeatureTypeInfo(
      json['wfs:WFS_Capabilities'].FeatureTypeList.FeatureType,
      layer.layerEntries.map((item) => item.id).toString()
    );

    if (!featTypeInfo) {
      return null;
    }

    const layerName = layer.name ? layer.name[api.map(this.mapId).getLanguageCode()] : (featTypeInfo.Name['#text'] as string).split(':')[1];

    if (layerName) this.name = layerName;

    const params = {
      service: 'WFS',
      version: this.#version,
      request: 'GetFeature',
      typeName: layer.layerEntries.map((item) => item.id).toString(),
      srsname: 'EPSG:4326',
      outputFormat: 'application/json',
    };

    const style: Record<string, Style> = {
      Polygon: layer.renderer ? createStyleFromRenderer(layer.renderer) : defaultLinePolygonStyle,
      LineString: layer.renderer ? createStyleFromRenderer(layer.renderer) : defaultLineStringStyle,
      Point: layer.renderer ? createStyleFromRenderer(layer.renderer) : defaultCircleMarkerStyle,
    };

    const getResponse = await axios.get<VectorLayer<VectorSource> | string>(this.url, { params });

    const geo = new Promise<VectorLayer<VectorSource> | null>((resolve) => {
      let attribution = '';

      if (
        this.#capabilities['ows:ServiceIdentification'] &&
        this.#capabilities['ows:ServiceIdentification']['ows:Abstract'] &&
        this.#capabilities['ows:ServiceIdentification']['ows:Abstract']['#text']
      ) {
        attribution = this.#capabilities['ows:ServiceIdentification']['ows:Abstract']['#text'] as string;
      }

      const vectorSource = new VectorSource({
        attributions: [attribution],
        loader: (extent, resolution, projection, success, failure) => {
          // TODO check for failure of getResponse then call failure
          const features = new GeoJSONFormat().readFeatures(getResponse.data, {
            extent,
            featureProjection: projection,
          });
          if (features.length > 0) {
            vectorSource.addFeatures(features);
          }
          if (success) success(features);
        },
        strategy: all,
      });

      const wfsLayer = new VectorLayer({
        source: vectorSource,
        style: (feature) => {
          const geometryType = feature.getGeometry()?.getType();

          return style[geometryType] ? style[geometryType] : defaultSelectStyle;
        },
      });

      resolve(wfsLayer);
    });
    return geo;
  }

  /**
   * Get feature type info of a given entry
   * @param {object} featureTypeList feature type list
   * @param {string} entries names(comma delimited) to check
   * @returns {TypeJsonValue | null} feature type object or null
   */
  private getFeatureTypeInfo(featureTypeList: TypeJsonObject, entries?: string): TypeJsonObject | null {
    const res = null;

    if (Array.isArray(featureTypeList)) {
      const featureTypeArray: TypeJsonArray = featureTypeList;

      for (let i = 0; i < featureTypeArray.length; i += 1) {
        let fName = featureTypeArray[i].Name['#text'] as string;

        const fNameSplit = fName.split(':');
        fName = fNameSplit.length > 1 ? fNameSplit[1] : fNameSplit[0];

        const entrySplit = entries!.split(':');
        const entryName = entrySplit.length > 1 ? entrySplit[1] : entrySplit[0];

        if (entryName === fName) {
          return featureTypeArray[i];
        }
      }
    } else {
      let fName = featureTypeList.Name['#text'] as string;

      const fNameSplit = fName.split(':');
      fName = fNameSplit.length > 1 ? fNameSplit[1] : fNameSplit[0];

      const entrySplit = entries!.split(':');
      const entryName = entrySplit.length > 1 ? entrySplit[1] : entrySplit[0];

      if (entryName === fName) {
        return featureTypeList;
      }
    }

    return res;
  }

  /**
   * Get capabilities of the current WFS service
   *
   * @returns {TypeJsonObject} WFS capabilities in json format
   */
  getCapabilities = (): TypeJsonObject => {
    return this.#capabilities;
  };

  /**
   * Set Layer Opacity
   * @param {number} opacity layer opacity
   */
  setOpacity = (opacity: number) => {
    this.layer?.setOpacity(opacity);
  };

  /**
   * Get bounds
   *
   * @returns {Extent} layer bounds
   */
  getBounds = (): Extent => {
    const transformedExtent = transformExtent(
      this.layer?.getSource()?.getExtent() || [],
      api.projection.projections[api.map(this.mapId).currentProjection],
      'EPSG:4326'
    );

    return transformedExtent || [];
  };
}
