import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import DashboardScreen from "@/screens/DashboardScreen";
import KhetScreen from "@/screens/KhetScreen";
import DairyScreen from "@/screens/DairyScreen";
import WalletScreen from "@/screens/WalletScreen";
import GyaanScreen from "@/screens/GyaanScreen";
import OnboardingScreen from "@/screens/OnboardingScreen";
import LoginScreen from "@/screens/LoginScreen";
import SplashScreen from "@/components/SplashScreen";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [language, setLanguage] = useState<"hi" | "en">("en");
  const [showSplash, setShowSplash] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for existing session
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };
    
    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    // Show splash for 2 seconds
    const timer = setTimeout(() => {
      setShowSplash(false);
      // Check if user has seen onboarding
      const hasSeenOnboarding = localStorage.getItem("namastuBharat_onboarding");
      if (!hasSeenOnboarding) {
        setShowOnboarding(true);
      } else if (!isAuthenticated) {
        setShowLogin(true);
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const toggleLanguage = () => {
    setLanguage(prev => prev === "hi" ? "en" : "hi");
  };

  const handleOnboardingComplete = () => {
    localStorage.setItem("namastuBharat_onboarding", "true");
    setShowOnboarding(false);
    if (!isAuthenticated) {
      setShowLogin(true);
    }
  };

  const handleLoginSuccess = () => {
    setShowLogin(false);
  };

  const handleLoginSkip = () => {
    setShowLogin(false);
  };

  const renderScreen = () => {
    switch (activeTab) {
      case "home":
        return <DashboardScreen language={language} onNavigate={setActiveTab} />;
      case "khet":
        return <KhetScreen language={language} />;
      case "dairy":
        return <DairyScreen language={language} />;
      case "gyaan":
        return <GyaanScreen language={language} />;
      case "wallet":
        return <WalletScreen language={language} />;
      default:
        return <DashboardScreen language={language} onNavigate={setActiveTab} />;
    }
  };

  // Show splash screen
  if (showSplash) {
    return <SplashScreen />;
  }

  // Show onboarding
  if (showOnboarding) {
    return (
      <OnboardingScreen 
        language={language} 
        onComplete={handleOnboardingComplete} 
      />
    );
  }

  // Show login
  if (showLogin) {
    return (
      <LoginScreen 
        language={language} 
        onSuccess={handleLoginSuccess}
        onSkip={handleLoginSkip}
      />
    );
  }

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
