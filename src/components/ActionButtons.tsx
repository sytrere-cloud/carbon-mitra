import { motion } from "framer-motion";
import { MapPin, Camera } from "lucide-react";

interface ActionButtonsProps {
  onMapFarm: () => void;
  onUploadPhoto: () => void;
  language: "hi" | "en";
}

const ActionButtons = ({ onMapFarm, onUploadPhoto, language }: ActionButtonsProps) => {
  const labels = {
    hi: {
      mapFarm: "खेत मैप करें",
      uploadPhoto: "फोटो अपलोड"
    },
    en: {
      mapFarm: "Map Farm",
      uploadPhoto: "Upload Photo"
    }
  };

  const t = labels[language];

  return (
    <div className="flex gap-3 px-4 mt-6">
      <motion.button
        className="flex-1 flex items-center justify-center gap-3 btn-primary py-4"
        onClick={onMapFarm}
        whileTap={{ scale: 0.98 }}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="w-10 h-10 rounded-xl bg-primary-foreground/20 flex items-center justify-center">
          <MapPin className="w-5 h-5" />
        </div>
        <span className="font-semibold">{t.mapFarm}</span>
      </motion.button>

      <motion.button
        className="flex-1 flex items-center justify-center gap-3 btn-amber py-4"
        onClick={onUploadPhoto}
        whileTap={{ scale: 0.98 }}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.6 }}
      >
        <div className="w-10 h-10 rounded-xl bg-soil/20 flex items-center justify-center">
          <Camera className="w-5 h-5 text-soil" />
        </div>
        <span className="font-semibold text-soil">{t.uploadPhoto}</span>
      </motion.button>
    </div>
  );
};

export default ActionButtons;
