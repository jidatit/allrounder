import { useEffect } from "react";
import { useMap } from "react-leaflet";

const SetBoundsComponent = ({ locations, getBounds }) => {
  const map = useMap();

  useEffect(() => {
    if (locations?.length > 0) {
      const bounds = getBounds(locations);
      if (bounds) {
        map.fitBounds(bounds, {
          padding: [50, 50],
          maxZoom: 15,
          duration: 1,
        });
      }
    }
  }, [locations, map]);

  return null;
};
export default SetBoundsComponent;
