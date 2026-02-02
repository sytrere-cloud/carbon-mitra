import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Camera, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Calendar,
  Volume2,
  Upload,
  ImageIcon
} from "lucide-react";

interface PhotoTask {
  id: string;
  title: { hi: string; en: string };
  status: "pending" | "completed" | "upcoming";
  date?: string;
  location?: string;
}

interface DairyScreenProps {
  language: "hi" | "en";
}

const DairyScreen = ({ language }: DairyScreenProps) => {
  const [showCamera, setShowCamera] = useState(false);
  
  const labels = {
    hi: {
      title: "फोटो प्रमाण",
      subtitle: "सत्यापित फोटो जर्नल",
      takePhoto: "फोटो लें",
      verified: "सत्यापित",
      pending: "प्रतीक्षारत",
      upcoming: "आगामी",
      gpsLocked: "GPS लॉक",
      timestamped: "समय मुद्रित",
      blockchain: "ब्लॉकचैन पर संग्रहीत"
    },
    en: {
      title: "Photo Proof",
      subtitle: "Verified Photo Journal",
      takePhoto: "Take Photo",
      verified: "Verified",
      pending: "Pending",
      upcoming: "Upcoming",
      gpsLocked: "GPS Locked",
      timestamped: "Timestamped",
      blockchain: "Stored on Blockchain"
    }
  };

  const t = labels[language];

  const photoTasks: PhotoTask[] = [
    { 
      id: "1", 
      title: { hi: "बुवाई चरण फोटो", en: "Sowing Stage Photo" }, 
      status: "completed",
      date: "15 Oct 2025",
      location: "23.02°N, 72.57°E"
    },
    { 
      id: "2", 
      title: { hi: "मध्य-मौसम विकास", en: "Mid-Season Growth" }, 
      status: "completed",
      date: "15 Nov 2025",
      location: "23.02°N, 72.57°E"
    },
    { 
      id: "3", 
      title: { hi: "कटाई पूर्व प्रमाण", en: "Pre-Harvest Proof" }, 
      status: "pending",
      date: "Today"
    },
    { 
      id: "4", 
      title: { hi: "कटाई के बाद - जलाया नहीं", en: "Post-Harvest - No Burning" }, 
      status: "upcoming"
    },
  ];

  const getStatusColor = (status: PhotoTask["status"]) => {
    switch (status) {
      case "completed": return "text-forest bg-forest/10";
      case "pending": return "text-amber bg-amber/10";
      case "upcoming": return "text-muted-foreground bg-muted";
    }
  };

  const getStatusIcon = (status: PhotoTask["status"]) => {
    switch (status) {
      case "completed": return <CheckCircle2 className="w-5 h-5" />;
      case "pending": return <Clock className="w-5 h-5" />;
      case "upcoming": return <Calendar className="w-5 h-5" />;
    }
  };

  return (
    <div className="px-4 space-y-6 pb-8">
      {/* Header */}
      <motion.div
        className="flex items-center justify-between"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className="text-xl font-bold text-soil flex items-center gap-2">
            <Camera className="w-6 h-6 text-forest" />
            {t.title}
          </h1>
          <p className="text-sm text-muted-foreground">{t.subtitle}</p>
        </div>
        <motion.button
          className="voice-btn"
          whileTap={{ scale: 0.9 }}
        >
          <Volume2 className="w-5 h-5" />
        </motion.button>
      </motion.div>

      {/* Photo Timeline */}
      <div className="space-y-4">
        {photoTasks.map((task, index) => (
          <motion.div
            key={task.id}
            className="card-earth relative"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            {/* Timeline connector */}
            {index < photoTasks.length - 1 && (
              <div className="absolute left-7 top-14 w-0.5 h-8 bg-border" />
            )}

            <div className="flex items-start gap-4">
              {/* Status Icon */}
              <div className={`p-2 rounded-xl ${getStatusColor(task.status)}`}>
                {getStatusIcon(task.status)}
              </div>

              {/* Content */}
              <div className="flex-1">
                <h3 className="font-semibold text-soil">{task.title[language]}</h3>
                
                {task.status === "completed" && (
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      <span>{task.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      <span>{task.location}</span>
                    </div>
                    <div className="mt-2 flex gap-2">
                      <span className="badge-verified">{t.gpsLocked}</span>
                      <span className="badge-verified">{t.blockchain}</span>
                    </div>
                  </div>
                )}

                {task.status === "pending" && (
                  <div className="mt-3">
                    <motion.button
                      className="btn-amber flex items-center gap-2 text-sm py-2 px-4"
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowCamera(true)}
                    >
                      <Camera className="w-4 h-4" />
                      {t.takePhoto}
                    </motion.button>
                  </div>
                )}

                {task.status === "upcoming" && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {language === "hi" ? "जल्द आ रहा है" : "Coming soon"}
                  </p>
                )}
              </div>

              {/* Thumbnail for completed */}
              {task.status === "completed" && (
                <div className="w-16 h-16 rounded-xl bg-forest/20 flex items-center justify-center">
                  <ImageIcon className="w-6 h-6 text-forest" />
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Camera Modal */}
      <AnimatePresence>
        {showCamera && (
          <motion.div
            className="fixed inset-0 bg-soil/90 z-50 flex flex-col items-center justify-center p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-card rounded-3xl p-6 w-full max-w-sm"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
            >
              {/* Camera Preview Placeholder */}
              <div className="aspect-[4/3] bg-muted rounded-2xl flex items-center justify-center mb-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-soil/20" />
                <Camera className="w-12 h-12 text-muted-foreground" />
                {/* Ghost overlay hint */}
                <div className="absolute inset-4 border-2 border-dashed border-forest/30 rounded-xl" />
              </div>

              {/* Auto-stamp info */}
              <div className="bg-forest/10 rounded-xl p-3 mb-4">
                <p className="text-xs text-forest font-medium text-center">
                  📍 GPS: 23.02°N, 72.57°E • 🕐 {new Date().toLocaleTimeString()}
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <motion.button
                  className="flex-1 py-3 rounded-xl bg-muted text-muted-foreground font-medium"
                  onClick={() => setShowCamera(false)}
                  whileTap={{ scale: 0.95 }}
                >
                  {language === "hi" ? "रद्द करें" : "Cancel"}
                </motion.button>
                <motion.button
                  className="flex-1 btn-primary"
                  onClick={() => setShowCamera(false)}
                  whileTap={{ scale: 0.95 }}
                >
                  <Upload className="w-5 h-5 inline mr-2" />
                  {language === "hi" ? "अपलोड" : "Upload"}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DairyScreen;
