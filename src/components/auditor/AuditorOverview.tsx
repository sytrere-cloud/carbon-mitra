import { motion } from "framer-motion";
import { CheckCircle, Clock, AlertTriangle, MapPin, Camera, Satellite } from "lucide-react";

interface AuditorOverviewProps {
  assignedFarms: number;
  photosToReview: number;
  ndviAlerts: number;
  completedAudits: number;
}

const AuditorOverview = ({ assignedFarms, photosToReview, ndviAlerts, completedAudits }: AuditorOverviewProps) => {
  const stats = [
    { label: "Assigned Farms", value: assignedFarms, icon: MapPin, color: "bg-primary/10 text-primary" },
    { label: "Photos to Review", value: photosToReview, icon: Camera, color: "bg-accent/10 text-accent" },
    { label: "NDVI Alerts", value: ndviAlerts, icon: AlertTriangle, color: "bg-destructive/10 text-destructive" },
    { label: "Completed", value: completedAudits, icon: CheckCircle, color: "bg-primary/10 text-primary" },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-foreground">Overview</h2>
      <div className="grid grid-cols-2 gap-3">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="card-earth p-4"
          >
            <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center mb-2`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AuditorOverview;
