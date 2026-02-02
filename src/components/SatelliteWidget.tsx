import { motion } from "framer-motion";
import { Satellite, Volume2 } from "lucide-react";

interface SatelliteWidgetProps {
  healthScore: number;
  lastUpdated: string;
  language: "hi" | "en";
}

const SatelliteWidget = ({ healthScore, lastUpdated, language }: SatelliteWidgetProps) => {
  const labels = {
    hi: {
      satellite: "उपग्रह दृश्य",
      health: "स्वास्थ्य",
      updated: "अपडेट",
      listen: "सुनें"
    },
    en: {
      satellite: "Satellite View",
      health: "Health",
      updated: "Updated",
      listen: "Listen"
    }
  };

  const t = labels[language];

  // Generate NDVI-like color grid
  const generateGrid = () => {
    const colors = [];
    for (let i = 0; i < 16; i++) {
      // Random green shades based on health
      const baseGreen = healthScore > 70 ? 150 : healthScore > 40 ? 120 : 80;
      const variation = Math.random() * 60 - 30;
      const green = Math.min(255, Math.max(50, baseGreen + variation));
      const red = healthScore < 50 ? 100 + Math.random() * 50 : 30 + Math.random() * 40;
      colors.push(`rgb(${red}, ${green}, 40)`);
    }
    return colors;
  };

  const gridColors = generateGrid();

  return (
    <motion.div
      className="satellite-widget p-3"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.3 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Satellite className="w-4 h-4 text-card" />
          <span className="text-xs font-medium text-card">{t.satellite}</span>
        </div>
        <motion.button
          className="p-1.5 rounded-full bg-card/20 hover:bg-card/30 transition-colors"
          whileTap={{ scale: 0.9 }}
        >
          <Volume2 className="w-3.5 h-3.5 text-card" />
        </motion.button>
      </div>

      {/* NDVI Grid Visualization */}
      <div className="grid grid-cols-4 gap-0.5 rounded-lg overflow-hidden mb-2">
        {gridColors.map((color, i) => (
          <motion.div
            key={i}
            className="aspect-square"
            style={{ backgroundColor: color }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 + i * 0.02 }}
          />
        ))}
        {/* Farm boundary overlay */}
        <div className="absolute inset-3 top-9 border-2 border-dashed border-card/50 rounded-lg pointer-events-none" />
      </div>

      {/* Health Score Overlay */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div 
            className="w-3 h-3 rounded-full"
            style={{ 
              backgroundColor: healthScore > 70 ? '#4CAF50' : healthScore > 40 ? '#FFC107' : '#F44336' 
            }}
          />
          <span className="text-xs text-card font-medium">
            {t.health}: <span className="font-bold">{healthScore}%</span>
          </span>
        </div>
        <span className="text-[10px] text-card/70">{t.updated}: {lastUpdated}</span>
      </div>
    </motion.div>
  );
};

export default SatelliteWidget;
