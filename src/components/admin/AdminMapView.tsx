import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Map, Layers, Filter, Eye } from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface Farm {
  id: string;
  farmerName: string;
  farmName: string;
  center: [number, number];
  boundary: [number, number][];
  healthScore: number;
  areaHectares: number;
}

const AdminMapView = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const [selectedFarm, setSelectedFarm] = useState<Farm | null>(null);
  const [showNDVI, setShowNDVI] = useState(true);

  // Mock farm data around Bhopal
  const farms: Farm[] = [
    {
      id: "1",
      farmerName: "Rajesh Kumar",
      farmName: "Kumar Farm",
      center: [23.2599, 77.4126],
      boundary: [
        [23.258, 77.410],
        [23.258, 77.415],
        [23.262, 77.415],
        [23.262, 77.410],
      ],
      healthScore: 85,
      areaHectares: 2.5,
    },
    {
      id: "2",
      farmerName: "Priya Devi",
      farmName: "Devi Fields",
      center: [23.2700, 77.4300],
      boundary: [
        [23.268, 77.428],
        [23.268, 77.432],
        [23.272, 77.432],
        [23.272, 77.428],
      ],
      healthScore: 72,
      areaHectares: 1.8,
    },
    {
      id: "3",
      farmerName: "Suresh Yadav",
      farmName: "Yadav Khet",
      center: [23.2450, 77.3950],
      boundary: [
        [23.242, 77.392],
        [23.242, 77.398],
        [23.248, 77.398],
        [23.248, 77.392],
      ],
      healthScore: 91,
      areaHectares: 3.2,
    },
  ];

  const getHealthColor = (score: number): string => {
    if (score >= 80) return "#2E7D32";
    if (score >= 60) return "#F59E0B";
    return "#EF4444";
  };

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Initialize map centered on Bhopal
    const map = L.map(mapContainerRef.current, {
      center: [23.2599, 77.4126],
      zoom: 12,
    });

    // Add satellite tile layer
    L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
      attribution: 'Tiles &copy; Esri',
      maxZoom: 19,
    }).addTo(map);

    // Add farm polygons
    farms.forEach((farm) => {
      const polygon = L.polygon(farm.boundary as L.LatLngTuple[], {
        color: getHealthColor(farm.healthScore),
        fillColor: getHealthColor(farm.healthScore),
        fillOpacity: showNDVI ? 0.4 : 0.2,
        weight: 2,
      }).addTo(map);

      // Add popup
      polygon.bindPopup(`
        <div style="min-width: 150px;">
          <strong>${farm.farmName}</strong><br/>
          <span style="color: #666;">${farm.farmerName}</span><br/>
          <span style="color: ${getHealthColor(farm.healthScore)}; font-weight: 600;">
            Health: ${farm.healthScore}%
          </span><br/>
          <span style="color: #666;">Area: ${farm.areaHectares} ha</span>
        </div>
      `);

      polygon.on("click", () => {
        setSelectedFarm(farm);
      });

      // Add center marker with health indicator
      const healthIcon = L.divIcon({
        className: "health-marker",
        html: `
          <div style="
            background: ${getHealthColor(farm.healthScore)};
            color: white;
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 600;
            white-space: nowrap;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          ">
            ${farm.healthScore}%
          </div>
        `,
        iconSize: [50, 24],
        iconAnchor: [25, 12],
      });

      L.marker(farm.center as L.LatLngTuple, { icon: healthIcon }).addTo(map);
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [showNDVI]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-soil">Farm Map Overview</h1>
          <p className="text-muted-foreground">Satellite view of all registered farms with health status</p>
        </div>
        <div className="flex gap-2">
          <motion.button
            onClick={() => setShowNDVI(!showNDVI)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              showNDVI ? "bg-forest text-white" : "bg-muted text-soil"
            }`}
            whileTap={{ scale: 0.98 }}
          >
            <Layers className="w-4 h-4" />
            NDVI Overlay
          </motion.button>
        </div>
      </div>

      {/* Map and Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Map */}
        <div className="lg:col-span-3">
          <div 
            ref={mapContainerRef}
            className="w-full h-[600px] rounded-xl overflow-hidden border shadow-lg"
          />
        </div>

        {/* Farm List Sidebar */}
        <div className="space-y-4">
          <h3 className="font-semibold text-soil">Registered Farms</h3>
          {farms.map((farm) => (
            <motion.div
              key={farm.id}
              onClick={() => {
                setSelectedFarm(farm);
                mapRef.current?.flyTo(farm.center as L.LatLngTuple, 15);
              }}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                selectedFarm?.id === farm.id 
                  ? "border-forest bg-forest/5" 
                  : "bg-card hover:bg-muted/50"
              }`}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-soil">{farm.farmName}</h4>
                <span 
                  className="px-2 py-1 rounded-full text-xs font-semibold text-white"
                  style={{ backgroundColor: getHealthColor(farm.healthScore) }}
                >
                  {farm.healthScore}%
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{farm.farmerName}</p>
              <p className="text-sm text-muted-foreground">{farm.areaHectares} hectares</p>
            </motion.div>
          ))}

          {/* Legend */}
          <div className="p-4 bg-muted/50 rounded-xl">
            <h4 className="font-medium text-soil mb-3">Health Legend</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: "#2E7D32" }} />
                <span className="text-sm text-muted-foreground">Healthy (80%+)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: "#F59E0B" }} />
                <span className="text-sm text-muted-foreground">Moderate (60-79%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: "#EF4444" }} />
                <span className="text-sm text-muted-foreground">Stressed (&lt;60%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminMapView;
