import { useState } from "react";
import { motion } from "framer-motion";
import { 
  MapPin, 
  Satellite, 
  Volume2, 
  ChevronLeft, 
  ChevronRight,
  Leaf,
  Droplets,
  Sun
} from "lucide-react";

interface KhetScreenProps {
  language: "hi" | "en";
}

const KhetScreen = ({ language }: KhetScreenProps) => {
  const [selectedMonth, setSelectedMonth] = useState(5); // June
  
  const labels = {
    hi: {
      title: "खेत निगरानी",
      satellite: "उपग्रह दृश्य",
      health: "फसल स्वास्थ्य",
      area: "क्षेत्रफल",
      hectares: "हेक्टेयर",
      carbonIncrease: "कार्बन वृद्धि",
      thisYear: "इस साल",
      lastYear: "पिछले साल",
      listen: "रिपोर्ट सुनें",
      months: ["जन", "फर", "मार्च", "अप्रै", "मई", "जून", "जुला", "अग", "सित", "अक्टू", "नव", "दिस"]
    },
    en: {
      title: "Farm Monitoring",
      satellite: "Satellite View",
      health: "Crop Health",
      area: "Area",
      hectares: "Hectares",
      carbonIncrease: "Carbon Increase",
      thisYear: "This Year",
      lastYear: "Last Year",
      listen: "Listen to Report",
      months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    }
  };

  const t = labels[language];

  // Generate farm plot grid (simulated NDVI)
  const generateFarmGrid = (isHealthy: boolean) => {
    const colors = [];
    for (let i = 0; i < 64; i++) {
      if (isHealthy) {
        const green = 120 + Math.random() * 80;
        colors.push(`rgb(40, ${green}, 50)`);
      } else {
        const base = Math.random();
        if (base > 0.6) {
          colors.push(`rgb(${150 + Math.random() * 50}, ${100 + Math.random() * 50}, 50)`);
        } else {
          colors.push(`rgb(60, ${80 + Math.random() * 40}, 50)`);
        }
      }
    }
    return colors;
  };

  const currentGrid = generateFarmGrid(true);
  const lastYearGrid = generateFarmGrid(false);

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

      {/* Timeline Slider */}
      <motion.div
        className="card-earth"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center justify-between mb-3">
          <motion.button
            className="p-2 rounded-full bg-muted"
            whileTap={{ scale: 0.9 }}
            onClick={() => setSelectedMonth(Math.max(0, selectedMonth - 1))}
          >
            <ChevronLeft className="w-5 h-5 text-soil" />
          </motion.button>
          
          <div className="flex-1 overflow-hidden mx-4">
            <div className="flex gap-2 overflow-x-auto py-2 no-scrollbar">
              {t.months.map((month, i) => (
                <motion.button
                  key={i}
                  onClick={() => setSelectedMonth(i)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                    selectedMonth === i 
                      ? "bg-forest text-primary-foreground" 
                      : "bg-muted text-muted-foreground"
                  }`}
                  whileTap={{ scale: 0.95 }}
                >
                  {month}
                </motion.button>
              ))}
            </div>
          </div>

          <motion.button
            className="p-2 rounded-full bg-muted"
            whileTap={{ scale: 0.9 }}
            onClick={() => setSelectedMonth(Math.min(11, selectedMonth + 1))}
          >
            <ChevronRight className="w-5 h-5 text-soil" />
          </motion.button>
        </div>
      </motion.div>

      {/* Satellite Comparison */}
      <motion.div
        className="grid grid-cols-2 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {/* Last Year */}
        <div className="card-earth">
          <div className="flex items-center gap-2 mb-3">
            <Satellite className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground">{t.lastYear}</span>
          </div>
          <div className="grid grid-cols-8 gap-0.5 rounded-lg overflow-hidden aspect-square">
            {lastYearGrid.map((color, i) => (
              <div key={i} className="aspect-square" style={{ backgroundColor: color }} />
            ))}
          </div>
        </div>

        {/* This Year */}
        <div className="card-earth border-2 border-forest">
          <div className="flex items-center gap-2 mb-3">
            <Satellite className="w-4 h-4 text-forest" />
            <span className="text-xs font-medium text-forest">{t.thisYear}</span>
          </div>
          <div className="grid grid-cols-8 gap-0.5 rounded-lg overflow-hidden aspect-square">
            {currentGrid.map((color, i) => (
              <motion.div 
                key={i} 
                className="aspect-square" 
                style={{ backgroundColor: color }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.01 * i }}
              />
            ))}
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        className="grid grid-cols-3 gap-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="card-earth text-center">
          <Leaf className="w-6 h-6 text-forest mx-auto mb-2" />
          <p className="text-2xl font-bold text-forest">85%</p>
          <p className="text-xs text-muted-foreground">{t.health}</p>
        </div>
        <div className="card-earth text-center">
          <MapPin className="w-6 h-6 text-amber mx-auto mb-2" />
          <p className="text-2xl font-bold text-soil">2.5</p>
          <p className="text-xs text-muted-foreground">{t.hectares}</p>
        </div>
        <div className="card-earth text-center">
          <Sun className="w-6 h-6 text-amber mx-auto mb-2" />
          <p className="text-2xl font-bold text-forest">+10%</p>
          <p className="text-xs text-muted-foreground">{t.carbonIncrease}</p>
        </div>
      </motion.div>

      {/* Listen Button */}
      <motion.button
        className="w-full btn-primary flex items-center justify-center gap-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        whileTap={{ scale: 0.98 }}
      >
        <Volume2 className="w-5 h-5" />
        <span>{t.listen}</span>
      </motion.button>
    </div>
  );
};

export default KhetScreen;
