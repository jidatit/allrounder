import { useEffect, useRef, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { OpenStreetMapProvider } from "leaflet-geosearch";
import SetBoundsComponent from "./SetBoundsComponent";
import { useNavigate } from "react-router-dom";
import ContentLoader from "react-content-loader";
const ActivitiesMap = ({ activities, featureActivityParam }) => {
  const mapRef = useRef(null);
  const navigate = useNavigate();
  const [locations, setLocations] = useState([]);
  const [mapBounds, setMapBounds] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mapCenter, setMapCenter] = useState([33.684422, 73.047882]);
  const [mapZoom, setMapZoom] = useState(13);

  // Geocode locations and set map parameters
  useEffect(() => {
    const geocodeLocations = async () => {
      setIsLoading(true);
      const provider = new OpenStreetMapProvider();

      try {
        const geocodedLocations = await Promise.all(
          activities.map(async (activity) => {
            if (!activity.location) return null;

            const results = await provider.search({ query: activity.location });

            if (results && results[0]) {
              return {
                ...activity, // Spread all activity properties
                id: activity.activityId, // Ensure we have the activityId
                lat: results[0].y,
                lng: results[0].x,
              };
            }
            return null;
          })
        );

        const validLocations = geocodedLocations.filter((loc) => loc !== null);
        setLocations(validLocations);

        if (validLocations.length > 0) {
          const bounds = calculateBounds(validLocations);
          setMapBounds(bounds);

          if (validLocations.length === 1) {
            setMapCenter([validLocations[0].lat, validLocations[0].lng]);
            setMapZoom(13);
          } else {
            const center = calculateCenter(validLocations);
            setMapCenter(center);

            const [[minLat, minLng], [maxLat, maxLng]] = bounds;
            const latDiff = Math.abs(maxLat - minLat);
            const lngDiff = Math.abs(maxLng - minLng);

            let zoom = 13;
            if (latDiff > 1 || lngDiff > 1) zoom = 8;
            if (latDiff > 5 || lngDiff > 5) zoom = 6;
            if (latDiff > 10 || lngDiff > 10) zoom = 4;

            setMapZoom(zoom);
          }
        }
      } catch (error) {
        console.error("Error geocoding locations:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (activities && activities.length > 0) {
      geocodeLocations();
    }
  }, [activities]);

  const handleActivityClick = (activity) => {
    navigate(`/post/${activity.activityId}/${featureActivityParam}`);
  };

  const calculateCenter = (locations) => {
    if (!locations || locations.length === 0) {
      return [33.684422, 73.047882];
    }

    const validLocations = locations.filter((loc) => loc.lat && loc.lng);
    if (validLocations.length === 0) return [33.684422, 73.047882];

    const totalLat = validLocations.reduce((sum, loc) => sum + loc.lat, 0);
    const totalLng = validLocations.reduce((sum, loc) => sum + loc.lng, 0);
    return [totalLat / validLocations.length, totalLng / validLocations.length];
  };

  const calculateBounds = (locations) => {
    if (!locations || locations.length === 0) return null;

    const validLocations = locations.filter((loc) => loc.lat && loc.lng);
    if (validLocations.length === 0) return null;

    const lats = validLocations.map((loc) => loc.lat);
    const lngs = validLocations.map((loc) => loc.lng);

    const padding = locations.length > 1 ? 0.5 : 0.1;
    return [
      [Math.min(...lats) - padding, Math.min(...lngs) - padding],
      [Math.max(...lats) + padding, Math.max(...lngs) + padding],
    ];
  };

  const createMarkerIcon = (index) => {
    return L.divIcon({
      className: "custom-div-icon",
      html: `<div class="marker-index">${index + 1}</div>`,
      iconSize: [30, 30],
      iconAnchor: [15, 15],
    });
  };

  if (isLoading) {
    return (
      <ContentLoader
        speed={1}
        width={700}
        height={800}
        viewBox="0 0 800 860"
        backgroundColor="#d9d9d9"
        foregroundColor="#ecebeb"
      >
        <rect x="-8" y="-11" rx="2" ry="2" width="700" height="800" />
      </ContentLoader>
    );
  }

  return (
    <div className="h-full w-full relative">
      <MapContainer
        ref={mapRef}
        center={mapCenter}
        zoom={mapZoom}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {locations.map((location, index) => (
          <Marker
            key={location.id}
            position={[location.lat, location.lng]}
            icon={createMarkerIcon(index)}
            eventHandlers={{
              click: () => handleActivityClick(location),
            }}
          >
            <Popup>
              <div className="text-sm">
                <h3 className="font-bold">{location.title}</h3>
                <p>{location.location}</p>
                <button
                  className="mt-2 text-blue-600 hover:text-blue-800"
                  onClick={() => handleActivityClick(location)}
                >
                  View Details
                </button>
              </div>
            </Popup>
          </Marker>
        ))}

        {mapBounds && <SetBoundsComponent bounds={mapBounds} />}
      </MapContainer>
    </div>
  );
};

export default ActivitiesMap;
