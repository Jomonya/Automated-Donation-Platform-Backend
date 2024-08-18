// src/components/WorldMap.js
import React from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { scaleQuantize } from 'd3-scale';
import './WorldMap.css';

// Example data with predefined coordinates for each country
const donationData = [
  { country: 'Nigeria', donations: 150, coordinates: [8, 10] },
  { country: 'Kenya', donations: 100, coordinates: [37.9062, 1.2921] },
  { country: 'South Africa', donations: 200, coordinates: [24.9916, -28.8166] },
  // Add more data as needed
];

const colorScale = scaleQuantize()
  .domain([0, 200])
  .range([
    "#d0ebff",
    "#a4d8ff",
    "#75c2ff",
    "#47acff",
    "#1a95ff",
    "#007ce6",
    "#0064b3",
    "#004d80",
    "#00364d"
  ]);

const WorldMap = () => (
  <div className="world-map">
    <ComposableMap projection="geoMercator">
      <Geographies geography="https://unpkg.com/world-atlas@1/world/110m.json">
        {({ geographies }) =>
          geographies.map(geo => {
            const donation = donationData.find(
              d => d.country === geo.properties.name
            );
            return (
              <React.Fragment key={geo.rsmKey}>
                <Geography
                  geography={geo}
                  fill={donation ? colorScale(donation.donations) : "#E0E0E0"}
                  stroke="#FFFFFF"
                />
                {donation && (
                  <text
                    x={donation.coordinates[0]}
                    y={donation.coordinates[1]}
                    textAnchor="middle"
                    style={{ fontFamily: 'system-ui', fill: '#007ce6' }}
                  >
                    {donation.donations}
                  </text>
                )}
              </React.Fragment>
            );
          })
        }
      </Geographies>
    </ComposableMap>
  </div>
);

export default WorldMap;
