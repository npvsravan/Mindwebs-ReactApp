import React, { useEffect, useRef, useState } from "react";
import {
  MapContainer,
  TileLayer,
  FeatureGroup,
  useMap,
  GeoJSON,
} from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import L, { GeoJSON as LeafletGeoJSON } from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import "./MapComponent.css";
import type { FeatureCollection } from "geojson";
import geojsonData from "./data/geo.json";

import Sidebar from "./Sidebar";

interface ThresholdRule {
  color: string;
  operator: string;
  value: number;
}

interface DataSourceConfig {
  field: string;
  rules: ThresholdRule[];
}

const center: [number, number] = [17.3606, 78.4746];

const MapComponent: React.FC = () => {
  const drawnItemsRef = useRef<L.FeatureGroup>(new L.FeatureGroup());
  const importedGeoJsonRef = useRef<LeafletGeoJSON | null>(null);
  const [hoverName, setHoverName] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("2023-01-01");
  const [filteredData, setFilteredData] = useState<FeatureCollection>({
    type: "FeatureCollection",
    features: [],
  });

  const [dataConfig, setDataConfig] = useState<DataSourceConfig | null>(null); // 👈 Config from Sidebar

  useEffect(() => {
    const filtered = (geojsonData.features as any[]).filter(
      (feature) =>
        feature.properties &&
        feature.properties.timestamp &&
        feature.properties.timestamp <= selectedDate
    );

    setFilteredData({
      type: "FeatureCollection",
      features: filtered,
    });
  }, [selectedDate]);

  const onCreated = (e: any) => {
    drawnItemsRef.current.addLayer(e.layer);
  };

  const onDeleted = (e: any) => {
    e.layers.eachLayer((layer: any) => {
      drawnItemsRef.current.removeLayer(layer);
    });
  };

  const handleExportGeoJSON = () => {
    const drawnLayers = drawnItemsRef.current.toGeoJSON();
    const importedLayers = importedGeoJsonRef.current?.toGeoJSON();
    const combined = {
      type: "FeatureCollection",
      features: [
        ...(drawnLayers.features || []),
        ...(importedLayers?.features || []),
      ],
    };

    const blob = new Blob([JSON.stringify(combined)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "shapes.geojson";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportGeoJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (importedGeoJsonRef.current) {
          importedGeoJsonRef.current.clearLayers();
        }

        const layer = new L.GeoJSON(json, {
          onEachFeature: (feature, layer) => {
            const name = feature.properties?.name || "Imported Shape";
            layer.bindTooltip(name, { permanent: false, direction: "top" });
            layer.on("mouseover", () => setHoverName(name));
            layer.on("mouseout", () => setHoverName(null));
            layer.on("click", () => {
              if (window.confirm(`Delete shape "${name}"?`)) {
                importedGeoJsonRef.current?.removeLayer(layer);
              }
            });
          },
          style: { color: "purple" },
        });

        importedGeoJsonRef.current = layer;
        drawnItemsRef.current.addLayer(layer);
      } catch (err) {
        alert("Invalid GeoJSON file.");
      }
    };

    reader.readAsText(file);
  };

  const getColorForFeature = (feature: any): string => {
    if (!dataConfig || !feature.properties) return "blue";
    const value = parseFloat(feature.properties[dataConfig.field]);
    if (isNaN(value)) return "gray";

    for (const rule of dataConfig.rules) {
      switch (rule.operator) {
        case "<":
          if (value < rule.value) return rule.color;
          break;
        case "<=":
          if (value <= rule.value) return rule.color;
          break;
        case ">":
          if (value > rule.value) return rule.color;
          break;
        case ">=":
          if (value >= rule.value) return rule.color;
          break;
        case "=":
          if (value === rule.value) return rule.color;
          break;
      }
    }

    return "blue";
  };

  return (
    <div style={{ display: "flex", height: "100vh", width: "100%" }}>
      {/* ⬅️ Sidebar */}
      <Sidebar onConfigChange={setDataConfig} />

      {/* 🗺 Map and Controls */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <div className="map-controls">
          <button onClick={handleExportGeoJSON} title="Download drawn shapes">
            📥 Export GeoJSON
          </button>

          <label className="file-input-label" title="Import shapes from file">
            📤 Import GeoJSON
            <input
              type="file"
              accept=".geojson,application/json"
              onChange={handleImportGeoJSON}
              className="file-input"
            />
          </label>

          <div className="date-control">
            <label htmlFor="date">📅 Date Filter: </label>
            <input
              id="date"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
        </div>

        <MapContainer center={center} zoom={13} style={{ flex: 1 }}>
          <TileLayer
            attribution="© OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <FeatureGroup ref={drawnItemsRef as any}>
            <EditControl
              position="topright"
              onCreated={onCreated}
              onDeleted={onDeleted}
              draw={{
                polygon: true,
                rectangle: true,
                circle: true,
                marker: false,
                polyline: false,
                circlemarker: false,
              }}
              edit={{ remove: true }}
            />
          </FeatureGroup>

          {/* Filtered & Colored GeoJSON polygons */}
          <GeoJSON
            data={filteredData}
            style={(feature) => ({ color: getColorForFeature(feature) })}
          />
        </MapContainer>
      </div>
    </div>
  );
};

export default MapComponent;
