import { motion } from "framer-motion";
import CarbonTree from "../components/CarbonTree";
import EarningsCard from "../components/EarningsCard";
import ActionButtons from "../components/ActionButtons";
import SatelliteWidget from "../components/SatelliteWidget";
import { useToast } from "@/hooks/use-toast";

interface DashboardScreenProps {
  language: "hi" | "en";
  onNavigate: (tab: string) => void;
}

const DashboardScreen = ({ language, onNavigate }: DashboardScreenProps) => {
  const { toast } = useToast();

  const handleMapFarm = () => {
    onNavigate("khet");
    toast({
      title: language === "hi" ? "खेत मैपिंग" : "Farm Mapping",
      description: language === "hi" 
        ? "अपने खेत की सीमा चलकर मैप करें" 
        : "Walk your farm boundary to map it",
    });
  };

  const handleUploadPhoto = () => {
    onNavigate("dairy");
    toast({
      title: language === "hi" ? "फोटो अपलोड" : "Photo Upload",
      description: language === "hi" 
        ? "कैमरा खोलकर फोटो लें" 
        : "Open camera to take photo",
    });
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Carbon Tree Hero */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <CarbonTree healthScore={85} credits={12450} />
      </motion.div>

      {/* Earnings Card */}
      <EarningsCard 
        totalEarnings={12450} 
        pendingCredits={15} 
        language={language} 
      />

      {/* Action Buttons */}
      <ActionButtons 
        onMapFarm={handleMapFarm}
        onUploadPhoto={handleUploadPhoto}
        language={language}
      />

      {/* Satellite Widget */}
      <div className="px-4 mt-6">
        <SatelliteWidget 
          healthScore={85}
          lastUpdated={language === "hi" ? "आज" : "Today"}
          language={language}
        />
      </div>
    </div>
  );
};

export default DashboardScreen;
