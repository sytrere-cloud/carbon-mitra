import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Volume2, Camera } from "lucide-react";
import FarmMap from "@/components/FarmMap";
import NDVIVisualization from "@/components/NDVIVisualization";
import EvidenceMilestones from "@/components/EvidenceMilestones";
import { toast } from "@/hooks/use-toast";

interface KhetScreenProps {
  language: "hi" | "en";
}

type KhetTab = "map" | "satellite" | "evidence";

const KhetScreen = ({ language }: KhetScreenProps) => {
  const [activeTab, setActiveTab] = useState<KhetTab>("evidence");
  
  const labels = {
    hi: {
      title: "खेत निगरानी",
      mapFarm: "मैप करें",
      viewSatellite: "उपग्रह",
      evidence: "साक्ष्य",
      listen: "रिपोर्ट सुनें",
    },
    en: {
      title: "Farm Monitoring",
      mapFarm: "Map Farm",
      viewSatellite: "Satellite",
      evidence: "Evidence",
      listen: "Listen to Report",
    }
  };

  const t = labels[language];

  const handleBoundarySave = (boundary: GeoJSON.Polygon, areaHectares: number) => {
    console.log("Boundary saved:", boundary, "Area:", areaHectares);
    toast({
      title: language === "hi" ? "सीमा सहेजी गई!" : "Boundary Saved!",
      description: language === "hi" 
        ? `${areaHectares} हेक्टेयर क्षेत्रफल दर्ज किया गया` 
        : `${areaHectares} hectares recorded`,
    });
  };

  const tabs: { id: KhetTab; label: string; icon: React.ElementType }[] = [
    { id: "evidence", label: t.evidence, icon: Camera },
    { id: "map", label: t.mapFarm, icon: MapPin },
    { id: "satellite", label: t.viewSatellite, icon: MapPin },
  ];

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
        <motion.button className="voice-btn" whileTap={{ scale: 0.9 }}>
          <Volume2 className="w-5 h-5" />
        </motion.button>
      </motion.div>

      {/* Tab Buttons */}
      <div className="flex gap-2">
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-3 rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-1.5 ${
              activeTab === tab.id ? "bg-forest text-primary-foreground" : "bg-muted text-soil"
            }`}
            whileTap={{ scale: 0.98 }}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </motion.button>
        ))}
      </div>

      {/* Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === "map" && (
          <div className="card-earth">
            <FarmMap language={language} onBoundarySave={handleBoundarySave} />
          </div>
        )}
        {activeTab === "satellite" && (
          <div className="card-earth">
            <NDVIVisualization language={language} />
          </div>
        )}
        {activeTab === "evidence" && (
          <EvidenceMilestones language={language} />
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
