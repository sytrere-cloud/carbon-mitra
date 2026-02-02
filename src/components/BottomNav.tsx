import { Home, MapPin, Camera, Wallet } from "lucide-react";
import { motion } from "framer-motion";

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  language: "hi" | "en";
}

const BottomNav = ({ activeTab, onTabChange, language }: BottomNavProps) => {
  const tabs = [
    { 
      id: "home", 
      icon: Home, 
      label: { hi: "होम", en: "Home" } 
    },
    { 
      id: "khet", 
      icon: MapPin, 
      label: { hi: "खेत", en: "Farm" } 
    },
    { 
      id: "dairy", 
      icon: Camera, 
      label: { hi: "फोटो", en: "Photos" } 
    },
    { 
      id: "wallet", 
      icon: Wallet, 
      label: { hi: "वॉलेट", en: "Wallet" } 
    },
  ];

  return (
    <nav className="nav-bottom z-50">
      <div className="flex items-center justify-around px-4 py-2">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          
          return (
            <motion.button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`nav-item flex-1 ${isActive ? "active" : ""}`}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="relative"
                animate={isActive ? { y: -2 } : { y: 0 }}
              >
                <Icon 
                  className={`nav-icon w-6 h-6 transition-colors duration-300 ${
                    isActive ? "text-forest" : "text-muted-foreground"
                  }`}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                {isActive && (
                  <motion.div
                    className="absolute -bottom-1 left-1/2 w-1 h-1 rounded-full bg-forest"
                    layoutId="navIndicator"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  />
                )}
              </motion.div>
              <span 
                className={`text-xs mt-1 font-medium transition-colors duration-300 ${
                  isActive ? "text-forest" : "text-muted-foreground"
                }`}
              >
                {tab.label[language]}
              </span>
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
