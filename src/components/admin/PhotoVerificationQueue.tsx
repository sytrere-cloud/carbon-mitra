import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ImageIcon, 
  MapPin, 
  Calendar, 
  CheckCircle2, 
  XCircle,
  Clock,
  Eye,
  ChevronDown,
  Filter,
  Satellite
} from "lucide-react";

interface Photo {
  id: string;
  farmerId: string;
  farmerName: string;
  photoUrl: string;
  photoType: "sowing" | "growth" | "harvest" | "no_burn";
  latitude: number;
  longitude: number;
  capturedAt: string;
  status: "pending" | "approved" | "rejected";
  farmName: string;
  district: string;
}

const PhotoVerificationQueue = () => {
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("pending");
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [showCompare, setShowCompare] = useState(false);

  // Mock data
  const photos: Photo[] = [
    {
      id: "1",
      farmerId: "f1",
      farmerName: "Rajesh Kumar",
      photoUrl: "/placeholder.svg",
      photoType: "harvest",
      latitude: 23.2599,
      longitude: 77.4126,
      capturedAt: "2026-02-02T10:30:00",
      status: "pending",
      farmName: "Kumar Farm",
      district: "Bhopal",
    },
    {
      id: "2",
      farmerId: "f2",
      farmerName: "Priya Devi",
      photoUrl: "/placeholder.svg",
      photoType: "no_burn",
      latitude: 23.1815,
      longitude: 77.3910,
      capturedAt: "2026-02-02T09:15:00",
      status: "pending",
      farmName: "Devi Fields",
      district: "Bhopal",
    },
    {
      id: "3",
      farmerId: "f3",
      farmerName: "Suresh Yadav",
      photoUrl: "/placeholder.svg",
      photoType: "growth",
      latitude: 23.3100,
      longitude: 77.4500,
      capturedAt: "2026-02-01T16:45:00",
      status: "approved",
      farmName: "Yadav Khet",
      district: "Sehore",
    },
  ];

  const filteredPhotos = filter === "all" ? photos : photos.filter(p => p.status === filter);

  const getPhotoTypeLabel = (type: string) => {
    switch (type) {
      case "sowing": return "Sowing Stage";
      case "growth": return "Growth Stage";
      case "harvest": return "Pre-Harvest";
      case "no_burn": return "No-Burn Proof";
      default: return type;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved": return "bg-forest/10 text-forest";
      case "rejected": return "bg-red-100 text-red-600";
      default: return "bg-amber/10 text-amber-600";
    }
  };

  const handleApprove = (photoId: string) => {
    // In real app, call API
    console.log("Approving photo:", photoId);
    setSelectedPhoto(null);
  };

  const handleReject = (photoId: string, reason: string) => {
    // In real app, call API
    console.log("Rejecting photo:", photoId, reason);
    setSelectedPhoto(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-soil">Photo Verification</h1>
          <p className="text-muted-foreground">Review and verify farmer photo submissions</p>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as typeof filter)}
            className="px-4 py-2 rounded-lg border bg-card text-sm"
          >
            <option value="all">All Photos</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-amber/10 rounded-xl p-4 text-center">
          <Clock className="w-6 h-6 text-amber-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-soil">89</p>
          <p className="text-sm text-muted-foreground">Pending</p>
        </div>
        <div className="bg-forest/10 rounded-xl p-4 text-center">
          <CheckCircle2 className="w-6 h-6 text-forest mx-auto mb-2" />
          <p className="text-2xl font-bold text-soil">856</p>
          <p className="text-sm text-muted-foreground">Approved</p>
        </div>
        <div className="bg-red-100 rounded-xl p-4 text-center">
          <XCircle className="w-6 h-6 text-red-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-soil">45</p>
          <p className="text-sm text-muted-foreground">Rejected</p>
        </div>
      </div>

      {/* Photo Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPhotos.map((photo) => (
          <motion.div
            key={photo.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card rounded-xl border shadow-sm overflow-hidden"
          >
            {/* Photo Preview */}
            <div className="relative aspect-video bg-muted">
              <img 
                src={photo.photoUrl} 
                alt="Farm photo"
                className="w-full h-full object-cover"
              />
              <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(photo.status)}`}>
                {photo.status}
              </div>
              <div className="absolute top-2 left-2 px-2 py-1 bg-black/60 rounded-full text-xs text-white">
                {getPhotoTypeLabel(photo.photoType)}
              </div>
            </div>

            {/* Photo Details */}
            <div className="p-4 space-y-3">
              <div>
                <h3 className="font-semibold text-soil">{photo.farmerName}</h3>
                <p className="text-sm text-muted-foreground">{photo.farmName}</p>
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{photo.district}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(photo.capturedAt).toLocaleDateString()}</span>
                </div>
              </div>

              {/* GPS */}
              <div className="text-xs text-muted-foreground bg-muted rounded-lg p-2">
                GPS: {photo.latitude.toFixed(4)}, {photo.longitude.toFixed(4)}
              </div>

              {/* Actions */}
              {photo.status === "pending" && (
                <div className="flex gap-2 pt-2">
                  <motion.button
                    onClick={() => setSelectedPhoto(photo)}
                    className="flex-1 flex items-center justify-center gap-2 py-2 bg-muted rounded-lg text-sm font-medium text-soil hover:bg-muted/80"
                    whileTap={{ scale: 0.98 }}
                  >
                    <Satellite className="w-4 h-4" />
                    Compare
                  </motion.button>
                  <motion.button
                    onClick={() => handleApprove(photo.id)}
                    className="flex-1 flex items-center justify-center gap-2 py-2 bg-forest text-white rounded-lg text-sm font-medium"
                    whileTap={{ scale: 0.98 }}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Approve
                  </motion.button>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Comparison Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedPhoto(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b">
                <h2 className="text-xl font-bold text-soil">Photo vs Satellite Comparison</h2>
                <p className="text-muted-foreground">Verify GPS match between farmer photo and satellite image</p>
              </div>

              <div className="p-6">
                {/* Side by side comparison */}
                <div className="grid grid-cols-2 gap-6">
                  {/* Farmer Photo */}
                  <div>
                    <h3 className="font-medium text-soil mb-3">Farmer Uploaded Photo</h3>
                    <div className="aspect-video bg-muted rounded-xl overflow-hidden">
                      <img 
                        src={selectedPhoto.photoUrl}
                        alt="Farmer photo"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="mt-2 text-sm text-muted-foreground">
                      <p>Captured: {new Date(selectedPhoto.capturedAt).toLocaleString()}</p>
                      <p>GPS: {selectedPhoto.latitude.toFixed(6)}, {selectedPhoto.longitude.toFixed(6)}</p>
                    </div>
                  </div>

                  {/* Satellite View */}
                  <div>
                    <h3 className="font-medium text-soil mb-3">Satellite View (Same Date)</h3>
                    <div className="aspect-video bg-muted rounded-xl overflow-hidden relative">
                      {/* Simulated NDVI grid */}
                      <div className="grid grid-cols-8 gap-0.5 w-full h-full">
                        {Array(64).fill(0).map((_, i) => {
                          const health = 0.5 + Math.random() * 0.4;
                          const green = 100 + Math.floor(health * 100);
                          return (
                            <div 
                              key={i}
                              style={{ backgroundColor: `rgb(40, ${green}, 50)` }}
                            />
                          );
                        })}
                      </div>
                      <div className="absolute top-2 right-2 bg-forest text-white text-xs px-2 py-1 rounded-full">
                        Health: 78%
                      </div>
                    </div>
                    <div className="mt-2 text-sm text-muted-foreground">
                      <p>Source: Sentinel-2 (Simulated)</p>
                      <p className="text-forest font-medium">✓ GPS coordinates match</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4 mt-6 pt-6 border-t">
                  <motion.button
                    onClick={() => handleReject(selectedPhoto.id, "GPS mismatch")}
                    className="flex-1 flex items-center justify-center gap-2 py-3 border-2 border-red-200 text-red-600 rounded-xl font-medium hover:bg-red-50"
                    whileTap={{ scale: 0.98 }}
                  >
                    <XCircle className="w-5 h-5" />
                    Reject (GPS Mismatch)
                  </motion.button>
                  <motion.button
                    onClick={() => handleApprove(selectedPhoto.id)}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-forest text-white rounded-xl font-medium"
                    whileTap={{ scale: 0.98 }}
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    Verify & Approve
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PhotoVerificationQueue;
