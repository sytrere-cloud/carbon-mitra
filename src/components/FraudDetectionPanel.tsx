import { motion } from "framer-motion";
import { AlertTriangle, MapPin, Flame, TrendingDown, CheckCircle2, XCircle, Eye } from "lucide-react";

interface FraudFlag {
  id: string;
  type: "gps_mismatch" | "burning_detected" | "flat_ndvi" | "date_mismatch";
  severity: "high" | "medium" | "low";
  farmName: string;
  farmerName: string;
  description: string;
  detectedAt: string;
  resolved: boolean;
}

interface FraudDetectionPanelProps {
  flags?: FraudFlag[];
}

const FraudDetectionPanel = ({ flags }: FraudDetectionPanelProps) => {
  const mockFlags: FraudFlag[] = flags || [
    {
      id: "1",
      type: "gps_mismatch",
      severity: "high",
      farmName: "Kumar Farm",
      farmerName: "Rajesh Kumar",
      description: "Photo GPS coordinates (23.310°N, 77.450°E) are 2.3 km outside the registered farm polygon boundary.",
      detectedAt: "2025-12-15 14:30 UTC",
      resolved: false,
    },
    {
      id: "2",
      type: "burning_detected",
      severity: "high",
      farmName: "Yadav Khet",
      farmerName: "Suresh Yadav",
      description: "Satellite imagery shows black soot patterns consistent with stubble burning. NDVI dropped from 0.72 to 0.15 within 3 days.",
      detectedAt: "2025-11-20 09:15 UTC",
      resolved: false,
    },
    {
      id: "3",
      type: "flat_ndvi",
      severity: "medium",
      farmName: "Devi Fields",
      farmerName: "Priya Devi",
      description: "NDVI growth curve has been flat (0.21-0.25) for 8 weeks during expected growth period, indicating possible crop failure or fallow land.",
      detectedAt: "2025-10-05 11:00 UTC",
      resolved: true,
    },
  ];

  const flagConfig = {
    gps_mismatch: { icon: MapPin, label: "GPS Mismatch", color: "text-destructive" },
    burning_detected: { icon: Flame, label: "Burning Detected", color: "text-destructive" },
    flat_ndvi: { icon: TrendingDown, label: "Flat NDVI Curve", color: "text-amber" },
    date_mismatch: { icon: AlertTriangle, label: "Date Mismatch", color: "text-amber" },
  };

  const severityColors = {
    high: "bg-destructive/10 border-destructive/30 text-destructive",
    medium: "bg-amber/10 border-amber/30 text-amber-dark",
    low: "bg-muted border-border text-muted-foreground",
  };

  const unresolvedCount = mockFlags.filter((f) => !f.resolved).length;

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-destructive/5 rounded-xl p-4 text-center border border-destructive/20">
          <p className="text-3xl font-bold text-destructive">{unresolvedCount}</p>
          <p className="text-sm text-muted-foreground">Active Flags</p>
        </div>
        <div className="bg-amber/5 rounded-xl p-4 text-center border border-amber/20">
          <p className="text-3xl font-bold text-amber-dark">{mockFlags.length}</p>
          <p className="text-sm text-muted-foreground">Total Flags</p>
        </div>
        <div className="bg-forest/5 rounded-xl p-4 text-center border border-forest/20">
          <p className="text-3xl font-bold text-forest">
            {mockFlags.filter((f) => f.resolved).length}
          </p>
          <p className="text-sm text-muted-foreground">Resolved</p>
        </div>
      </div>

      {/* Flags List */}
      <div className="space-y-4">
        {mockFlags.map((flag, i) => {
          const cfg = flagConfig[flag.type];
          const Icon = cfg.icon;
          return (
            <motion.div
              key={flag.id}
              className={`rounded-xl border-2 p-5 ${flag.resolved ? "bg-muted/50 border-border opacity-60" : severityColors[flag.severity]}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Icon className={`w-5 h-5 ${flag.resolved ? "text-muted-foreground" : cfg.color}`} />
                  <span className="font-semibold text-soil">{cfg.label}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium uppercase ${
                    flag.severity === "high" ? "bg-destructive text-destructive-foreground" : "bg-amber text-foreground"
                  }`}>
                    {flag.severity}
                  </span>
                </div>
                {flag.resolved ? (
                  <CheckCircle2 className="w-5 h-5 text-forest" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-destructive animate-pulse" />
                )}
              </div>

              <p className="text-sm text-soil font-medium mb-1">
                {flag.farmName} — {flag.farmerName}
              </p>
              <p className="text-sm text-muted-foreground mb-3">{flag.description}</p>

              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{flag.detectedAt}</span>
                {!flag.resolved && (
                  <div className="flex gap-2">
                    <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-forest text-primary-foreground text-xs font-medium hover:bg-forest-dark transition-colors">
                      <Eye className="w-3 h-3" /> Investigate
                    </button>
                    <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-destructive text-destructive-foreground text-xs font-medium hover:opacity-90 transition-opacity">
                      <XCircle className="w-3 h-3" /> Reject
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default FraudDetectionPanel;
