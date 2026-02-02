import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import DashboardScreen from "@/screens/DashboardScreen";
import KhetScreen from "@/screens/KhetScreen";
import DairyScreen from "@/screens/DairyScreen";
import WalletScreen from "@/screens/WalletScreen";

const Index = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [language, setLanguage] = useState<"hi" | "en">("en");

  const toggleLanguage = () => {
    setLanguage(prev => prev === "hi" ? "en" : "hi");
  };

  const renderScreen = () => {
    switch (activeTab) {
      case "home":
        return <DashboardScreen language={language} onNavigate={setActiveTab} />;
      case "khet":
        return <KhetScreen language={language} />;
      case "dairy":
        return <DairyScreen language={language} />;
      case "wallet":
        return <WalletScreen language={language} />;
      default:
        return <DashboardScreen language={language} onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className="app-container min-h-screen">
      {/* Header */}
      <Header 
        language={language}
        onLanguageToggle={toggleLanguage}
        userName={language === "hi" ? "राजेश किसान" : "Rajesh Kisan"}
      />

      {/* Main Content */}
      <main className="safe-bottom">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderScreen()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <BottomNav 
        activeTab={activeTab}
        onTabChange={setActiveTab}
        language={language}
      />
    </div>
  );
};

export default Index;
