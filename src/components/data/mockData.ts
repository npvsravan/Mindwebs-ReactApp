

// src/data/mockData.ts (or src/components/data/mockData.ts)

import { FeatureCollection } from "geojson";

const mockData: FeatureCollection = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        name: "Zone A",
        date: "2025-08-01"
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [78.501, 17.435],
            [78.503, 17.435],
            [78.503, 17.437],
            [78.501, 17.437],
            [78.501, 17.435]
          ]
        ]
      }
    },
    {
      type: "Feature",
      properties: {
        name: "Zone B",
        date: "2025-08-03"
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [78.510, 17.440],
            [78.512, 17.440],
            [78.512, 17.442],
            [78.510, 17.442],
            [78.510, 17.440]
          ]
        ]
      }
    }
  ]
};

export default mockData;
