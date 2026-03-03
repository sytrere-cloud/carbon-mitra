import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Camera, Satellite, MapPin, User, Calendar, CheckCircle, XCircle } from "lucide-react";

interface Photo {
  id: string;
  photo_url: string;
  photo_type: string;
  milestone_stage: string | null;
  captured_at: string;
  latitude: number | null;
  longitude: number | null;
  compass_heading: number | null;
  verification_status: string | null;
}

interface NDVIReading {
  id: string;
  ndvi_value: number | null;
  health_score: number | null;
  reading_date: string;
}

interface FarmDetail {
  id: string;
  name: string;
  area_hectares: number | null;
  crop_type: string | null;
  farmer_name: string | null;
  farmer_phone: string | null;
  farmer_village: string | null;
  photos: Photo[];
  ndvi_readings: NDVIReading[];
}

interface AuditorFarmDetailProps {
  farm: FarmDetail;
  onBack: () => void;
}

const AuditorFarmDetail = ({ farm, onBack }: AuditorFarmDetailProps) => {
  const [activeTab, setActiveTab] = useState<"photos" | "ndvi">("photos");

  const getNdviColor = (val: number | null) => {
    if (val === null) return "bg-muted";
    if (val >= 0.6) return "bg-primary";
    if (val >= 0.3) return "bg-accent";
    return "bg-destructive";
  };

  return (
    <div className="space-y-4">
      {/* Back button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={onBack}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm">Back to farms</span>
      </motion.button>

      {/* Farm header */}
      <div className="card-forest">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-xl bg-primary-foreground/20 flex items-center justify-center">
            <MapPin className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold">{farm.name}</h2>
            <p className="text-sm opacity-80">{farm.area_hectares ?? "—"} hectares • {farm.crop_type ?? "N/A"}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm opacity-80">
          <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> {farm.farmer_name}</span>
          <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {farm.farmer_village ?? "—"}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab("photos")}
          className={`flex-1 py-2.5 rounded-xl font-semibold text-sm transition-all ${
            activeTab === "photos" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
          }`}
        >
          <Camera className="w-4 h-4 inline mr-1.5" />
          Photos ({farm.photos.length})
        </button>
        <button
          onClick={() => setActiveTab("ndvi")}
          className={`flex-1 py-2.5 rounded-xl font-semibold text-sm transition-all ${
            activeTab === "ndvi" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
          }`}
        >
          <Satellite className="w-4 h-4 inline mr-1.5" />
          NDVI ({farm.ndvi_readings.length})
        </button>
      </div>

      {/* Photo Review Tab */}
      {activeTab === "photos" && (
        <div className="space-y-3">
          {farm.photos.length === 0 ? (
            <div className="card-earth text-center py-8">
              <Camera className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">No photos submitted yet</p>
            </div>
          ) : (
            farm.photos.map((photo, i) => (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="card-earth"
              >
                <div className="aspect-video rounded-xl overflow-hidden bg-muted mb-3">
                  <img
                    src={photo.photo_url}
                    alt={photo.photo_type}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.currentTarget.src = "/placeholder.svg"; }}
                  />
                </div>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-semibold text-sm text-foreground capitalize">{photo.photo_type}</p>
                    <p className="text-xs text-muted-foreground">
                      {photo.milestone_stage ? `Stage: ${photo.milestone_stage}` : "General"}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    photo.verification_status === "verified" 
                      ? "bg-primary/10 text-primary"
                      : photo.verification_status === "rejected"
                      ? "bg-destructive/10 text-destructive"
                      : "bg-accent/10 text-accent"
                  }`}>
                    {photo.verification_status ?? "pending"}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(photo.captured_at).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {photo.latitude?.toFixed(4)}, {photo.longitude?.toFixed(4)}
                  </span>
                  {photo.compass_heading && (
                    <span>🧭 {photo.compass_heading.toFixed(0)}°</span>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </div>
      )}

      {/* NDVI Tab */}
      {activeTab === "ndvi" && (
        <div className="space-y-3">
          {farm.ndvi_readings.length === 0 ? (
            <div className="card-earth text-center py-8">
              <Satellite className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">No satellite data available</p>
            </div>
          ) : (
            farm.ndvi_readings.map((reading, i) => (
              <motion.div
                key={reading.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="card-earth flex items-center gap-4"
              >
                <div className={`w-14 h-14 rounded-xl ${getNdviColor(reading.ndvi_value)} flex items-center justify-center text-primary-foreground font-bold`}>
                  {reading.ndvi_value?.toFixed(2) ?? "—"}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-foreground">
                    Health: {reading.health_score ?? "—"}%
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(reading.reading_date).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  {(reading.health_score ?? 0) >= 60 ? (
                    <CheckCircle className="w-5 h-5 text-primary" />
                  ) : (
                    <XCircle className="w-5 h-5 text-destructive" />
                  )}
                </div>
              </motion.div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default AuditorFarmDetail;
