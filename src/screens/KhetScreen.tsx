import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Volume2 } from "lucide-react";
import FarmMap from "@/components/FarmMap";
import NDVIVisualization from "@/components/NDVIVisualization";
import { toast } from "@/hooks/use-toast";

interface KhetScreenProps {
  language: "hi" | "en";
}

const KhetScreen = ({ language }: KhetScreenProps) => {
  const [showMap, setShowMap] = useState(false);
  
  const labels = {
    hi: {
      title: "खेत निगरानी",
      mapFarm: "खेत मैप करें",
      viewSatellite: "उपग्रह दृश्य देखें",
      listen: "रिपोर्ट सुनें",
    },
    en: {
      title: "Farm Monitoring",
      mapFarm: "Map Your Farm",
      viewSatellite: "View Satellite Data",
      listen: "Listen to Report",
    }
  };

  const t = labels[language];

  const handleBoundarySave = (boundary: GeoJSON.Polygon, areaHectares: number) => {
    // In real app, save to Supabase
    console.log("Boundary saved:", boundary, "Area:", areaHectares);
    toast({
      title: language === "hi" ? "सीमा सहेजी गई!" : "Boundary Saved!",
      description: language === "hi" 
        ? `${areaHectares} हेक्टेयर क्षेत्रफल दर्ज किया गया` 
        : `${areaHectares} hectares recorded`,
    });
    setShowMap(false);
  };

  return (
    <div className="px-4 space-y-6 pb-8">
      {/* Header */}
      <motion.div
        className="flex items-center justify-between"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-2">
          <MapPin className="w-6 h-6 text-forest" />
          <h1 className="text-xl font-bold text-soil">{t.title}</h1>
        </div>
        <motion.button
          className="voice-btn"
          whileTap={{ scale: 0.9 }}
        >
          <Volume2 className="w-5 h-5" />
        </motion.button>
      </motion.div>

      {/* Toggle Buttons */}
      <div className="flex gap-3">
        <motion.button
          onClick={() => setShowMap(true)}
          className={`flex-1 py-3 rounded-xl font-medium transition-all ${
            showMap 
              ? "bg-forest text-white" 
              : "bg-muted text-soil"
          }`}
          whileTap={{ scale: 0.98 }}
        >
          {t.mapFarm}
        </motion.button>
        <motion.button
          onClick={() => setShowMap(false)}
          className={`flex-1 py-3 rounded-xl font-medium transition-all ${
            !showMap 
              ? "bg-forest text-white" 
              : "bg-muted text-soil"
          }`}
          whileTap={{ scale: 0.98 }}
        >
          {t.viewSatellite}
        </motion.button>
      </div>

      {/* Content */}
      <motion.div
        key={showMap ? "map" : "satellite"}
        initial={{ opacity: 0, x: showMap ? -20 : 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        {showMap ? (
          <div className="card-earth">
            <FarmMap 
              language={language} 
              onBoundarySave={handleBoundarySave}
            />
          </div>
        ) : (
          <div className="card-earth">
            <NDVIVisualization language={language} />
          </div>
        )}
      </motion.div>

      {/* Listen Button */}
      <motion.button
        className="w-full btn-primary flex items-center justify-center gap-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        whileTap={{ scale: 0.98 }}
      >
        <Volume2 className="w-5 h-5" />
        <span>{t.listen}</span>
      </motion.button>
    </div>
  );
};

export default KhetScreen;
