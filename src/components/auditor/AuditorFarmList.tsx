import { motion } from "framer-motion";
import { MapPin, ChevronRight, Leaf, AlertTriangle, CheckCircle } from "lucide-react";

interface Farm {
  id: string;
  name: string;
  area_hectares: number | null;
  crop_type: string | null;
  farmer_name: string | null;
  photo_count: number;
  latest_ndvi: number | null;
  status: string;
}

interface AuditorFarmListProps {
  farms: Farm[];
  onSelectFarm: (farmId: string) => void;
}

const AuditorFarmList = ({ farms, onSelectFarm }: AuditorFarmListProps) => {
  const getStatusBadge = (status: string, ndvi: number | null) => {
    if (ndvi !== null && ndvi < 0.3) {
      return <span className="badge-pending flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Alert</span>;
    }
    if (status === "verified") {
      return <span className="badge-verified flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Verified</span>;
    }
    return <span className="badge-pending flex items-center gap-1"><Leaf className="w-3 h-3" /> Pending</span>;
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-foreground">Assigned Farms</h2>
      {farms.length === 0 ? (
        <div className="card-earth text-center py-8">
          <MapPin className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
          <p className="text-muted-foreground">No farms assigned yet</p>
        </div>
      ) : (
        <div className="space-y-2">
          {farms.map((farm, i) => (
            <motion.button
              key={farm.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => onSelectFarm(farm.id)}
              className="w-full card-earth flex items-center gap-3 hover:shadow-lg transition-shadow"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-semibold text-foreground">{farm.name}</p>
                <p className="text-xs text-muted-foreground">
                  {farm.farmer_name} • {farm.area_hectares ?? "—"} ha • {farm.crop_type ?? "N/A"}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  📷 {farm.photo_count} photos • NDVI: {farm.latest_ndvi?.toFixed(2) ?? "—"}
                </p>
              </div>
              <div className="flex flex-col items-end gap-1 flex-shrink-0">
                {getStatusBadge(farm.status, farm.latest_ndvi)}
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </div>
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
};

export default AuditorFarmList;
