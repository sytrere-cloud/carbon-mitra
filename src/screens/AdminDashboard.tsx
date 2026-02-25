import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, 
  ImageIcon, 
  Coins, 
  Users, 
  Map,
  LogOut,
  AlertTriangle,
  Eye
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import PhotoVerificationQueue from "@/components/admin/PhotoVerificationQueue";
import CarbonCreditsManager from "@/components/admin/CarbonCreditsManager";
import FarmersList from "@/components/admin/FarmersList";
import AdminOverview from "@/components/admin/AdminOverview";
import AdminMapView from "@/components/admin/AdminMapView";
import FraudDetectionPanel from "@/components/FraudDetectionPanel";

interface AdminDashboardProps {
  onLogout: () => void;
}

type AdminTab = "overview" | "photos" | "credits" | "farmers" | "map" | "fraud";

const AdminDashboard = ({ onLogout }: AdminDashboardProps) => {
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const { signOut, user } = useAuth();

  const handleLogout = async () => {
    await signOut();
    onLogout();
  };

  const navItems = [
    { id: "overview" as AdminTab, label: "Overview", icon: LayoutDashboard },
    { id: "photos" as AdminTab, label: "Photo Verification", icon: ImageIcon },
    { id: "credits" as AdminTab, label: "Carbon Credits", icon: Coins },
    { id: "farmers" as AdminTab, label: "Farmers", icon: Users },
    { id: "map" as AdminTab, label: "Farm Map", icon: Map },
    { id: "fraud" as AdminTab, label: "Fraud Detection", icon: AlertTriangle },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <AdminOverview />;
      case "photos":
        return <PhotoVerificationQueue />;
      case "credits":
        return <CarbonCreditsManager />;
      case "farmers":
        return <FarmersList />;
      case "map":
        return <AdminMapView />;
      case "fraud":
        return <FraudDetectionPanel />;
      default:
        return <AdminOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-soil text-white flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <h1 className="text-xl font-bold">NamastuBharat</h1>
          <p className="text-sm text-white/60 mt-1">Admin Portal</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <motion.button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === item.id
                  ? "bg-white text-soil"
                  : "text-white/80 hover:bg-white/10"
              }`}
              whileTap={{ scale: 0.98 }}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </motion.button>
          ))}
        </nav>

        {/* User & Logout */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.email}</p>
              <p className="text-xs text-white/60">Administrator</p>
            </div>
          </div>
          <motion.button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2 bg-white/10 rounded-lg text-white/80 hover:bg-white/20 transition-colors"
            whileTap={{ scale: 0.98 }}
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm">Logout</span>
          </motion.button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="p-6"
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default AdminDashboard;
