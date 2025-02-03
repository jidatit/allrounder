// import React, { useState } from "react";
// import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
// import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
// import "leaflet/dist/leaflet.css";
// import "leaflet-geosearch/dist/geosearch.css";
// import L from "leaflet";

// const LocationSelector = ({ onLocationSelect }) => {
//   const [position, setPosition] = useState([51.505, -0.09]); // Default position (London)

//   const handleMapClick = (e) => {
//     const { lat, lng } = e.latlng;
//     setPosition([lat, lng]);
//     onLocationSelect({ lat, lng });
//   };

//   return (
//     <MapContainer
//       center={position}
//       zoom={13}
//       style={{ height: "300px", width: "100%" }}
//       onClick={handleMapClick}
//     >
//       <TileLayer
//         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//         attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//       />
//       <Marker position={position}>
//         <Popup>Selected Location</Popup>
//       </Marker>
//       <GeoSearchControl
//         provider={new OpenStreetMapProvider()}
//         showMarker={false}
//         showPopup={false}
//         style={{ width: "100%" }}
//       />
//     </MapContainer>
//   );
// };

// export default LocationSelector;

// import React, { useEffect, useState } from "react";
// import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
// import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
// import "leaflet/dist/leaflet.css";
// import "leaflet-geosearch/dist/geosearch.css";
// import L from "leaflet";

// const SearchControl = ({ onLocationSelect }) => {
//   const map = useMap();

//   useEffect(() => {
//     const provider = new OpenStreetMapProvider();

//     const searchControl = new GeoSearchControl({
//       provider,
//       style: "bar",
//       showMarker: false,
//       autoClose: true,
//       retainZoomLevel: false,
//       animateZoom: true,
//       keepResult: true,
//     });

//     map.addControl(searchControl);

//     map.on("geosearch/showlocation", (result) => {
//       const { lat, lng } = result.location;
//       onLocationSelect({ lat, lng });
//     });

//     return () => {
//       map.removeControl(searchControl);
//     };
//   }, [map, onLocationSelect]);

//   return null;
// };

// const LocationSelector = ({ onLocationSelect }) => {
//   const [position, setPosition] = useState([51.505, -0.09]); // Default position (London)

//   const handleMapClick = (e) => {
//     const { lat, lng } = e.latlng;
//     setPosition([lat, lng]);
//     onLocationSelect({ lat, lng });
//   };

//   return (
//     <MapContainer
//       center={position}
//       zoom={13}
//       style={{ height: "300px", width: "100%" }}
//       onClick={handleMapClick}
//     >
//       <TileLayer
//         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//         attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//       />
//       <Marker position={position}>
//         <Popup>Selected Location</Popup>
//       </Marker>
//       <SearchControl onLocationSelect={setPosition} />
//     </MapContainer>
//   );
// };

// export default LocationSelector;

// import React, { useState, useEffect } from "react";
// import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
// import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
// import "leaflet/dist/leaflet.css";
// import "leaflet-geosearch/dist/geosearch.css";
// import L from "leaflet";

// const SearchControl = ({ onLocationSelect }) => {
//   const map = useMap();

//   useEffect(() => {
//     const provider = new OpenStreetMapProvider();
//     const searchControl = new GeoSearchControl({
//       provider,
//       showMarker: false,
//       showPopup: false,
//     });

//     map.addControl(searchControl);

//     map.on("geosearch/showlocation", (e) => {
//       const { lat, lng } = e.location;
//       if (lat && lng) {
//         onLocationSelect({ lat, lng });
//       }
//     });

//     return () => map.removeControl(searchControl);
//   }, [map, onLocationSelect]);

//   return null;
// };

// const LocationSelector = ({ onLocationSelect }) => {
//   const [position, setPosition] = useState([51.505, -0.09]); // Default position (London)

//   const handleMapClick = (e) => {
//     const { lat, lng } = e.latlng;
//     if (lat && lng) {
//       setPosition([lat, lng]);
//       onLocationSelect({ lat, lng });
//     }
//   };

//   return (
//     <MapContainer
//       center={position}
//       zoom={13}
//       style={{ height: "300px", width: "100%" }}
//       whenCreated={(map) => map.invalidateSize()}
//       onClick={handleMapClick}
//     >
//       <TileLayer
//         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//         attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//       />
//       <SearchControl onLocationSelect={onLocationSelect} />
//       {position[0] && position[1] && (
//         <Marker position={position}>
//           <Popup>Selected Location</Popup>
//         </Marker>
//       )}
//     </MapContainer>
//   );
// };

// export default LocationSelector;

import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
import "leaflet/dist/leaflet.css";
import "leaflet-geosearch/dist/geosearch.css";
import L from "leaflet";

const SearchControl = ({ onLocationSelect, setPosition }) => {
  const map = useMap();

  useEffect(() => {
    const provider = new OpenStreetMapProvider();
    const searchControl = new GeoSearchControl({
      provider,
      showMarker: false, // We manage our own marker
      showPopup: false,
    });

    map.addControl(searchControl);

    map.on("geosearch/showlocation", (e) => {
      const { lat, lng } = e.location;
      if (lat && lng) {
        setPosition([lat, lng]); // Update marker position
        onLocationSelect({ lat, lng });
      }
    });

    return () => map.removeControl(searchControl);
  }, [map, onLocationSelect, setPosition]);

  return null;
};

// Separate component for handling map clicks
const MapClickHandler = ({ setPosition, onLocationSelect }) => {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]); // Update marker position
      onLocationSelect({ lat, lng });
    },
  });
  return null;
};

const LocationSelector = ({ onLocationSelect }) => {
  const [position, setPosition] = useState([51.505, -0.09]); // Default position (London)

  return (
    <MapContainer
      center={position}
      zoom={13}
      style={{ height: "300px", width: "100%" }}
      whenCreated={(map) => map.invalidateSize()}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <SearchControl
        onLocationSelect={onLocationSelect}
        setPosition={setPosition}
      />
      <MapClickHandler
        setPosition={setPosition}
        onLocationSelect={onLocationSelect}
      />
      {position && (
        <Marker position={position}>
          <Popup>Selected Location</Popup>
        </Marker>
      )}
    </MapContainer>
  );
};

export default LocationSelector;
