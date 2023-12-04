import React, { useEffect } from "react";
import MapView from "@arcgis/core/views/MapView";
import Map from "@arcgis/core/Map";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import { SimpleRenderer } from "@arcgis/core/renderers";
import PictureMarkerSymbol from "@arcgis/core/symbols/PictureMarkerSymbol";

const SolarPowerMap = () => {
  useEffect(() => {
    const initMap = async () => {
      const map = new Map({
        basemap: "streets-navigation-vector",
      });

      const view = new MapView({
        container: "map",
        map: map,
        center: [-122.676481, 45.512709],
        zoom: 13,
      });

      const solarPowerPlantLayer = new FeatureLayer({
        url:
          "https://services.arcgis.com/V400BJ6t4GT6kDZf/arcgis/rest/services/SolarPowerPlants/FeatureServer/",
        renderer: {
          type: "simple",
          symbol: new PictureMarkerSymbol({
            type: "picture-marker",
            url:
              "https://developers.arcgis.com/javascript/latest/images/symbols/s_symbols.svg?symbolName=SolarPowerPlant",
          }) as any, // Explicitly cast to RendererProperties
        } as SimpleRenderer, // Explicitly cast to SimpleRenderer
      });

      map.add(solarPowerPlantLayer);
    };

    initMap();
  }, []);

  return <div id="map" style={{ height: "500px" }}></div>;
};

export default SolarPowerMap;
