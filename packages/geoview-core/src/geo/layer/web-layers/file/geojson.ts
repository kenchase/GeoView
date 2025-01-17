import Feature from 'ol/Feature';
import { Vector as VectorSource } from 'ol/source';
import { VectorImage as VectorLayer } from 'ol/layer';
import { GeoJSON as GeoJSONFormat } from 'ol/format';
import { Style, Stroke, Fill, Circle as StyleCircle } from 'ol/style';
import { asArray, asString } from 'ol/color';
import { Pixel } from 'ol/pixel';
import { Extent } from 'ol/extent';
import { transformExtent } from 'ol/proj';

import {
  AbstractWebLayersClass,
  CONST_LAYER_TYPES,
  TypeWebLayers,
  TypeGeoJSONLayer,
  TypeBaseWebLayersConfig,
  TypeFilterFeatures,
  TypeFilterQuery,
  FILTER_OPERATOR,
  TypeJsonObject,
} from '../../../../core/types/cgpv-types';
import { setAlphaColor } from '../../../../core/utils/utilities';

import { api } from '../../../../app';

// constant to define default style if not set by renderer
// TODO: put somewhere to reuse for all vector layers + maybe array so if many layer, we increase the choice
const defaultCircleMarkerStyle = new Style({
  image: new StyleCircle({
    radius: 5,
    stroke: new Stroke({
      color: asString(setAlphaColor(asArray('#000000'), 1)),
      width: 1,
    }),
    fill: new Fill({
      color: asString(setAlphaColor(asArray('#000000'), 0.4)),
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
 * Type Gard function that redefines a TypeBaseWebLayersConfig as a TypeGeoJSONLayer
 * if the layerType attribute of the verifyIfLayer parameter is GEOJSON. The type ascention
 * applies only to the the true block of the if clause that use this function.
 *
 * @param {TypeBaseWebLayersConfig} polymorphic object to test in order to determine if the type ascention is valid
 *
 * @return {boolean} true if the type ascention is valid
 */
export const layerConfigIsGeoJSON = (verifyIfLayer: TypeBaseWebLayersConfig): verifyIfLayer is TypeGeoJSONLayer => {
  return verifyIfLayer.layerType === CONST_LAYER_TYPES.GEOJSON;
};

/* ******************************************************************************************************************************
 * Type Gard function that redefines an AbstractWebLayersClass as a GeoJSON
 * if the type attribute of the verifyIfWebLayer parameter is GEOJSON. The type ascention
 * applies only to the the true block of the if clause that use this function.
 *
 * @param {AbstractWebLayersClass} polymorphic object to test in order to determine if the type ascention is valid
 *
 * @return {boolean} true if the type ascention is valid
 */
export const webLayerIsGeoJSON = (verifyIfWebLayer: AbstractWebLayersClass): verifyIfWebLayer is GeoJSON => {
  return verifyIfWebLayer.type === CONST_LAYER_TYPES.GEOJSON;
};

/**
 * Class used to add geojson layer to the map
 *
 * @exports
 * @class GeoJSON
 */
export class GeoJSON extends AbstractWebLayersClass {
  // layer
  layer!: VectorLayer<VectorSource>;

  // eslint-disable-next-line @typescript-eslint/ban-types
  features: Feature[] = [];

  /**
   * Initialize layer
   *
   * @param {string} mapId the id of the map
   * @param {TypeGeoJSONLayer} layerConfig the layer configuration
   */
  constructor(mapId: string, layerConfig: TypeGeoJSONLayer) {
    super(CONST_LAYER_TYPES.GEOJSON as TypeWebLayers, layerConfig, mapId);
  }

  /**
   * Add a GeoJSON layer to the map.
   *
   * @param {TypeGeoJSONLayer} geoLayer the layer configuration
   * @return {Promise<VectorLayer<VectorSource> | null} layers to add to the map
   */
  add(geoLayer: TypeGeoJSONLayer): Promise<VectorLayer<VectorSource> | null> {
    const geo = new Promise<VectorLayer<VectorSource> | null>((resolve) => {
      const style: Record<string, Style> = {
        Polygon: geoLayer.renderer ? createStyleFromRenderer(geoLayer.renderer) : defaultLinePolygonStyle,
        LineString: geoLayer.renderer ? createStyleFromRenderer(geoLayer.renderer) : defaultLineStringStyle,
        Point: geoLayer.renderer ? createStyleFromRenderer(geoLayer.renderer) : defaultCircleMarkerStyle,
      };

      const geojson = new VectorLayer({
        source: new VectorSource({
          url: geoLayer.url[api.map(this.mapId).getLanguageCode()],
          format: new GeoJSONFormat(),
        }),
        style: (feature) => {
          const geometryType = feature.getGeometry()?.getType();

          return style[geometryType] ? style[geometryType] : defaultSelectStyle;
        },
      });

      const featureOverlay = new VectorLayer({
        source: new VectorSource(),
        map: api.map(this.mapId).map,
        style: new Style({
          stroke: new Stroke({
            color: 'rgba(255, 255, 255, 0.7)',
            width: 2,
          }),
        }),
      });

      let highlight: Feature | undefined;

      const highlightFeature = (pixel: Pixel) => {
        const feature = api.map(this.mapId).map.forEachFeatureAtPixel(pixel, (featurePixel) => {
          return featurePixel;
        });

        if (feature !== highlight) {
          if (highlight) {
            api.map(this.mapId).map.getTargetElement().style.cursor = '';

            featureOverlay.getSource()?.removeFeature(highlight);
          }
          if (feature) {
            api.map(this.mapId).map.getTargetElement().style.cursor = 'pointer';

            featureOverlay.getSource()?.addFeature(feature as Feature);
          }
          highlight = feature as Feature;
        }
      };

      api.map(this.mapId).map.on('pointermove', (evt) => {
        if (evt.dragging) {
          return;
        }
        const pixel = api.map(this.mapId).map.getEventPixel(evt.originalEvent);

        highlightFeature(pixel);
      });

      // click on a feature
      // api.map(this.mapId).map.on('click', (evt) => {});

      /**
       * Store features
       */
      geojson.getSource()?.on('addfeature', (event) => {
        const { feature } = event;

        if (feature) this.features.push(feature);
      });

      resolve(geojson);
    });

    return geo;
  }

  filterFeatures(filters: TypeFilterQuery[]): TypeFilterFeatures {
    const result: TypeFilterFeatures = { pass: [], fail: [] };

    // get type of values
    const typeOfValue = filters.map((item) => typeof item.value);

    // loop all layer features
    for (let featureIndex = 0; featureIndex < this.features.length; featureIndex++) {
      const feature = this.features[featureIndex];

      // for each field, check value type associtaed and cast if needed
      const featValues: (string | number)[] = [];
      filters.forEach((filter: TypeFilterQuery, i: number) => {
        const tmpValue =
          typeOfValue[i] === 'string' ? String(feature.getProperties()[filter.field]) : Number(feature.getProperties()[filter.field]);
        featValues.push(tmpValue);
      });

      // apply the filters
      const pass: boolean[] = [];
      filters.forEach((filter: TypeFilterQuery, i: number) => {
        pass.push(FILTER_OPERATOR[filter.operator as string](featValues[i], filter.value));
      });

      // check if pass
      // TODO: redevelop to have unlimited number of filters
      if ((!pass.includes(false) && filters[1].connector === '&&') || (pass.includes(true) && filters[1].connector === '||')) {
        result.pass.push(feature);
      } else {
        result.fail.push(feature);
      }
    }

    return result;
  }

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
