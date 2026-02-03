import { useState } from "react";
import { motion } from "framer-motion";
import { Satellite, ChevronLeft, ChevronRight, TrendingUp, TrendingDown } from "lucide-react";
import { useNDVI } from "@/hooks/useNDVI";

interface NDVIVisualizationProps {
  language: "hi" | "en";
  farmId?: string;
}

const NDVIVisualization = ({ language, farmId }: NDVIVisualizationProps) => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const { monthlyReadings, previousYearReadings, yearOverYearChange } = useNDVI(farmId);

  const labels = {
    hi: {
      title: "उपग्रह स्वास्थ्य दृश्य",
      thisYear: "इस साल",
      lastYear: "पिछले साल",
      healthScore: "स्वास्थ्य स्कोर",
      improvement: "सुधार",
      decline: "गिरावट",
      months: ["जन", "फर", "मार्च", "अप्रै", "मई", "जून", "जुला", "अग", "सित", "अक्टू", "नव", "दिस"],
      legend: {
        healthy: "स्वस्थ",
        moderate: "मध्यम",
        stressed: "तनाव",
        bare: "खाली",
      },
    },
    en: {
      title: "Satellite Health View",
      thisYear: "This Year",
      lastYear: "Last Year",
      healthScore: "Health Score",
      improvement: "Improvement",
      decline: "Decline",
      months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      legend: {
        healthy: "Healthy",
        moderate: "Moderate",
        stressed: "Stressed",
        bare: "Bare",
      },
    },
  };

  const t = labels[language];

  const currentReading = monthlyReadings[selectedMonth];
  const previousReading = previousYearReadings[selectedMonth];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Satellite className="w-5 h-5 text-forest" />
          <h2 className="text-lg font-semibold text-soil">{t.title}</h2>
        </div>
        
        {/* Year-over-year change badge */}
        <div className={`flex items-center gap-1 px-3 py-1 rounded-full ${
          yearOverYearChange >= 0 ? "bg-forest/10 text-forest" : "bg-red-100 text-red-600"
        }`}>
          {yearOverYearChange >= 0 ? (
            <TrendingUp className="w-4 h-4" />
          ) : (
            <TrendingDown className="w-4 h-4" />
          )}
          <span className="text-sm font-medium">
            {yearOverYearChange >= 0 ? "+" : ""}{yearOverYearChange}%
          </span>
        </div>
      </div>

      {/* Month Timeline */}
      <div className="flex items-center gap-2">
        <motion.button
          className="p-2 rounded-full bg-muted"
          whileTap={{ scale: 0.9 }}
          onClick={() => setSelectedMonth(Math.max(0, selectedMonth - 1))}
        >
          <ChevronLeft className="w-4 h-4 text-soil" />
        </motion.button>
        
        <div className="flex-1 overflow-x-auto no-scrollbar">
          <div className="flex gap-1.5">
            {t.months.map((month, i) => (
              <motion.button
                key={i}
                onClick={() => setSelectedMonth(i)}
                className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  selectedMonth === i 
                    ? "bg-forest text-white" 
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
          <ChevronRight className="w-4 h-4 text-soil" />
        </motion.button>
      </div>

      {/* Side-by-side comparison */}
      <div className="grid grid-cols-2 gap-3">
        {/* Previous Year */}
        <div className="card-earth">
          <div className="text-center mb-2">
            <span className="text-xs font-medium text-muted-foreground">{t.lastYear}</span>
          </div>
          <div className="grid grid-cols-8 gap-0.5 rounded-lg overflow-hidden aspect-square mb-2">
            {previousReading?.grid.flat().map((cell, i) => (
              <div 
                key={i} 
                className="aspect-square" 
                style={{ backgroundColor: cell.color }} 
              />
            ))}
          </div>
          <div className="text-center">
            <span className="text-lg font-bold text-soil">{previousReading?.healthScore}%</span>
            <p className="text-xs text-muted-foreground">{t.healthScore}</p>
          </div>
        </div>

        {/* Current Year */}
        <div className="card-earth border-2 border-forest">
          <div className="text-center mb-2">
            <span className="text-xs font-medium text-forest">{t.thisYear}</span>
          </div>
          <div className="grid grid-cols-8 gap-0.5 rounded-lg overflow-hidden aspect-square mb-2">
            {currentReading?.grid.flat().map((cell, i) => (
              <motion.div 
                key={i} 
                className="aspect-square" 
                style={{ backgroundColor: cell.color }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.005 * i }}
              />
            ))}
          </div>
          <div className="text-center">
            <span className="text-lg font-bold text-forest">{currentReading?.healthScore}%</span>
            <p className="text-xs text-muted-foreground">{t.healthScore}</p>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-4">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: "rgb(30, 160, 40)" }} />
          <span className="text-xs text-muted-foreground">{t.legend.healthy}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: "rgb(60, 120, 50)" }} />
          <span className="text-xs text-muted-foreground">{t.legend.moderate}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: "rgb(180, 140, 50)" }} />
          <span className="text-xs text-muted-foreground">{t.legend.stressed}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: "rgb(140, 100, 60)" }} />
          <span className="text-xs text-muted-foreground">{t.legend.bare}</span>
        </div>
      </div>
    </div>
  );
};

export default NDVIVisualization;
