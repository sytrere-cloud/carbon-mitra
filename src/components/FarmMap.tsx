import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Check, X, Navigation } from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet-draw";

interface FarmMapProps {
  language: "hi" | "en";
  onBoundarySave?: (boundary: GeoJSON.Polygon, areaHectares: number) => void;
  existingBoundary?: GeoJSON.Polygon;
  readOnly?: boolean;
}

const FarmMap = ({ language, onBoundarySave, existingBoundary, readOnly = false }: FarmMapProps) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const drawnItemsRef = useRef<L.FeatureGroup | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [hasPolygon, setHasPolygon] = useState(!!existingBoundary);
  const [areaDisplay, setAreaDisplay] = useState<string>("");

  const labels = {
    hi: {
      title: "खेत मैपिंग",
      instructions: "अपने खेत की सीमा बनाने के लिए नक्शे पर टैप करें",
      locating: "आपका स्थान खोज रहे हैं...",
      locate: "मेरा स्थान",
      save: "सीमा सहेजें",
      clear: "साफ़ करें",
      area: "क्षेत्रफल",
      hectares: "हेक्टेयर",
    },
    en: {
      title: "Farm Mapping",
      instructions: "Tap on the map to draw your farm boundary",
      locating: "Finding your location...",
      locate: "My Location",
      save: "Save Boundary",
      clear: "Clear",
      area: "Area",
      hectares: "Hectares",
    },
  };

  const t = labels[language];

  const calculateArea = (layer: L.Polygon): number => {
    const latlngs = layer.getLatLngs()[0] as L.LatLng[];
    if (latlngs.length < 3) return 0;
    
    // Calculate area using Shoelace formula (approximate for small areas)
    let area = 0;
    for (let i = 0; i < latlngs.length; i++) {
      const j = (i + 1) % latlngs.length;
      area += latlngs[i].lng * latlngs[j].lat;
      area -= latlngs[j].lng * latlngs[i].lat;
    }
    area = Math.abs(area) / 2;
    
    // Convert to hectares (rough approximation at typical Indian latitudes)
    const metersPerDegree = 111000;
    const areaSquareMeters = area * metersPerDegree * metersPerDegree * Math.cos((latlngs[0].lat * Math.PI) / 180);
    const hectares = areaSquareMeters / 10000;
    
    return Math.round(hectares * 100) / 100;
  };

  const polygonToGeoJSON = (layer: L.Polygon): GeoJSON.Polygon => {
    const latlngs = layer.getLatLngs()[0] as L.LatLng[];
    const coordinates = latlngs.map(ll => [ll.lng, ll.lat]);
    // Close the polygon
    if (coordinates.length > 0) {
      coordinates.push(coordinates[0]);
    }
    return {
      type: "Polygon",
      coordinates: [coordinates],
    };
  };

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Default to central India
    const defaultCenter: L.LatLngTuple = [23.2599, 77.4126];
    
    // Initialize map
    const map = L.map(mapContainerRef.current, {
      center: defaultCenter,
      zoom: 15,
      zoomControl: false,
    });

    // Add OpenStreetMap tiles
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    // Add zoom control to bottom right
    L.control.zoom({ position: "bottomright" }).addTo(map);

    // Create feature group for drawn items
    const drawnItems = new L.FeatureGroup();
    map.addLayer(drawnItems);
    drawnItemsRef.current = drawnItems;

    // Add existing boundary if provided
    if (existingBoundary && existingBoundary.coordinates[0]) {
      const coords = existingBoundary.coordinates[0].map(
        coord => [coord[1], coord[0]] as L.LatLngTuple
      );
      const polygon = L.polygon(coords.slice(0, -1), {
        color: "#2E7D32",
        fillColor: "#2E7D32",
        fillOpacity: 0.3,
      });
      drawnItems.addLayer(polygon);
      map.fitBounds(polygon.getBounds());
      setAreaDisplay(calculateArea(polygon).toString());
    }

    if (!readOnly) {
      // Initialize draw control
      const drawControl = new L.Control.Draw({
        position: "topright",
        draw: {
          polyline: false,
          rectangle: false,
          circle: false,
          circlemarker: false,
          marker: false,
          polygon: {
            allowIntersection: false,
            showArea: true,
            shapeOptions: {
              color: "#2E7D32",
              fillColor: "#2E7D32",
              fillOpacity: 0.3,
            },
          },
        },
        edit: {
          featureGroup: drawnItems,
          remove: true,
        },
      });
      map.addControl(drawControl);

      // Handle draw events
      map.on(L.Draw.Event.CREATED, (e: L.DrawEvents.Created) => {
        const layer = e.layer as L.Polygon;
        drawnItems.clearLayers();
        drawnItems.addLayer(layer);
        setHasPolygon(true);
        const area = calculateArea(layer);
        setAreaDisplay(area.toString());
      });

      map.on(L.Draw.Event.DELETED, () => {
        setHasPolygon(false);
        setAreaDisplay("");
      });

      map.on(L.Draw.Event.EDITED, (e: L.DrawEvents.Edited) => {
        const layers = e.layers;
        layers.eachLayer((layer) => {
          if (layer instanceof L.Polygon) {
            const area = calculateArea(layer);
            setAreaDisplay(area.toString());
          }
        });
      });
    }

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [existingBoundary, readOnly]);

  const handleLocate = () => {
    if (!mapRef.current) return;
    
    setIsLocating(true);
    
    mapRef.current.locate({ setView: true, maxZoom: 17 });
    
    mapRef.current.on("locationfound", (e: L.LocationEvent) => {
      setIsLocating(false);
      L.marker(e.latlng, {
        icon: L.divIcon({
          className: "location-marker",
          html: '<div class="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg animate-pulse"></div>',
          iconSize: [16, 16],
        }),
      }).addTo(mapRef.current!);
    });

    mapRef.current.on("locationerror", () => {
      setIsLocating(false);
    });
  };

  const handleSave = () => {
    if (!drawnItemsRef.current || !onBoundarySave) return;
    
    const layers = drawnItemsRef.current.getLayers();
    if (layers.length > 0 && layers[0] instanceof L.Polygon) {
      const polygon = layers[0] as L.Polygon;
      const geoJSON = polygonToGeoJSON(polygon);
      const area = calculateArea(polygon);
      onBoundarySave(geoJSON, area);
    }
  };

  const handleClear = () => {
    if (!drawnItemsRef.current) return;
    drawnItemsRef.current.clearLayers();
    setHasPolygon(false);
    setAreaDisplay("");
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-forest" />
          <h2 className="text-lg font-semibold text-soil">{t.title}</h2>
        </div>
        {areaDisplay && (
          <div className="bg-forest/10 px-3 py-1 rounded-full">
            <span className="text-sm font-medium text-forest">
              {areaDisplay} {t.hectares}
            </span>
          </div>
        )}
      </div>

      {/* Instructions */}
      {!readOnly && (
        <p className="text-sm text-muted-foreground">{t.instructions}</p>
      )}

      {/* Map Container */}
      <div 
        ref={mapContainerRef} 
        className="w-full h-64 rounded-xl overflow-hidden border-2 border-border shadow-lg"
        style={{ minHeight: "256px" }}
      />

      {/* Action Buttons */}
      {!readOnly && (
        <div className="flex gap-3">
          <motion.button
            onClick={handleLocate}
            disabled={isLocating}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-muted rounded-xl font-medium text-soil"
            whileTap={{ scale: 0.98 }}
          >
            <Navigation className="w-5 h-5" />
            {isLocating ? t.locating : t.locate}
          </motion.button>

          {hasPolygon && (
            <>
              <motion.button
                onClick={handleClear}
                className="px-4 py-3 bg-red-100 rounded-xl text-red-600"
                whileTap={{ scale: 0.98 }}
              >
                <X className="w-5 h-5" />
              </motion.button>
              
              <motion.button
                onClick={handleSave}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-forest text-white rounded-xl font-medium"
                whileTap={{ scale: 0.98 }}
              >
                <Check className="w-5 h-5" />
                {t.save}
              </motion.button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default FarmMap;
