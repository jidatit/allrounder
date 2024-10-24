import React, { useState, useRef } from "react";
import { Dialog, DialogTitle, DialogContent, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const MapModal = ({ location, locationMap, createCustomIcon }) => {
  const [isOpen, setIsOpen] = useState(false);
  const mapRef = useRef(null);

  const getCenterCoordinates = (locations) => {
    if (!locations || locations.length === 0) return [0, 0];
    const lats = locations.map((loc) => loc.lat);
    const lngs = locations.map((loc) => loc.lng);
    return [
      (Math.min(...lats) + Math.max(...lats)) / 2,
      (Math.min(...lngs) + Math.max(...lngs)) / 2,
    ];
  };

  const getBounds = (locations) => {
    if (!locations || locations.length === 0) return null;

    const validLocations = locations.filter((loc) => loc.lat && loc.lng);
    if (validLocations.length === 0) return null;

    let minLat = validLocations[0].lat;
    let maxLat = validLocations[0].lat;
    let minLng = validLocations[0].lng;
    let maxLng = validLocations[0].lng;

    validLocations.forEach((loc) => {
      minLat = Math.min(minLat, loc.lat);
      maxLat = Math.max(maxLat, loc.lat);
      minLng = Math.min(minLng, loc.lng);
      maxLng = Math.max(maxLng, loc.lng);
    });

    return [
      [minLat - 0.1, minLng - 0.1], // Add padding
      [maxLat + 0.1, maxLng + 0.1], // Add padding
    ];
  };

  const SetBoundsComponent = ({ locations, getBounds }) => {
    const map = useRef(null);

    React.useEffect(() => {
      if (map.current && locations.length > 0) {
        const bounds = getBounds(locations);
        map.current.fitBounds(bounds);
      }
    }, [locations, getBounds]);

    return null;
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="w-[110px] h-[33px] md:w-[137px] my-4 bg-[#E55938] rounded-3xl text-xs md:text-sm text-white custom-semibold flex items-center justify-center"
      >
        View on map
      </button>

      <Dialog
        open={isOpen}
        onClose={handleClose}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          style: {
            maxHeight: "90vh",
          },
        }}
      >
        <DialogTitle className="flex justify-between items-center border-b p-4">
          <div>
            <h3 className="text-lg font-semibold">Location Map</h3>
            <p className="text-sm text-gray-500 mt-1">{location}</p>
          </div>
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent className="p-0">
          <div className="w-full h-[600px] md:h-[400px]">
            <MapContainer
              ref={mapRef}
              center={getCenterCoordinates(locationMap)}
              zoom={12}
              style={{ height: "100%", width: "100%" }}
              className="z-10"
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />

              {/* Add a component to handle bounds fitting */}
              <SetBoundsComponent
                locations={locationMap}
                getBounds={getBounds}
              />

              {locationMap.map((location) => (
                <Marker
                  key={location.id}
                  position={[location.lat, location.lng]}
                  icon={createCustomIcon(2)}
                >
                  <Popup>
                    <div className="p-2">
                      <h3 className="font-bold">{location.name}</h3>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MapModal;
