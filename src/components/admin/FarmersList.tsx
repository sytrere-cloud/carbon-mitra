import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Users, 
  Search, 
  MapPin, 
  Leaf,
  Eye,
  Phone,
  Filter,
  ChevronRight
} from "lucide-react";

interface Farmer {
  id: string;
  name: string;
  phone: string;
  village: string;
  district: string;
  state: string;
  totalFarms: number;
  totalArea: number;
  creditsEarned: number;
  healthScore: number;
  status: "active" | "pending" | "inactive";
}

const FarmersList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("all");

  // Mock data
  const farmers: Farmer[] = [
    {
      id: "1",
      name: "Rajesh Kumar",
      phone: "+91 98765 43210",
      village: "Khajuri Kalan",
      district: "Bhopal",
      state: "Madhya Pradesh",
      totalFarms: 2,
      totalArea: 4.5,
      creditsEarned: 125,
      healthScore: 85,
      status: "active",
    },
    {
      id: "2",
      name: "Priya Devi",
      phone: "+91 87654 32109",
      village: "Mandideep",
      district: "Raisen",
      state: "Madhya Pradesh",
      totalFarms: 1,
      totalArea: 2.0,
      creditsEarned: 48,
      healthScore: 72,
      status: "active",
    },
    {
      id: "3",
      name: "Suresh Yadav",
      phone: "+91 76543 21098",
      village: "Ashta",
      district: "Sehore",
      state: "Madhya Pradesh",
      totalFarms: 3,
      totalArea: 7.2,
      creditsEarned: 210,
      healthScore: 91,
      status: "active",
    },
    {
      id: "4",
      name: "Meena Kumari",
      phone: "+91 65432 10987",
      village: "Berasia",
      district: "Bhopal",
      state: "Madhya Pradesh",
      totalFarms: 1,
      totalArea: 1.5,
      creditsEarned: 0,
      healthScore: 0,
      status: "pending",
    },
  ];

  const districts = ["all", ...Array.from(new Set(farmers.map(f => f.district)))];

  const filteredFarmers = farmers.filter(farmer => {
    const matchesSearch = farmer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      farmer.village.toLowerCase().includes(searchQuery.toLowerCase()) ||
      farmer.phone.includes(searchQuery);
    const matchesDistrict = selectedDistrict === "all" || farmer.district === selectedDistrict;
    return matchesSearch && matchesDistrict;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-forest/10 text-forest";
      case "pending": return "bg-amber/10 text-amber-600";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getHealthColor = (score: number) => {
    if (score >= 80) return "text-forest";
    if (score >= 60) return "text-amber-600";
    if (score > 0) return "text-red-500";
    return "text-muted-foreground";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-soil">Farmer Management</h1>
          <p className="text-muted-foreground">View and manage registered farmers</p>
        </div>
        <div className="bg-forest/10 px-4 py-2 rounded-lg">
          <span className="text-forest font-semibold">{farmers.length}</span>
          <span className="text-muted-foreground ml-2">Total Farmers</span>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name, village, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl border bg-card focus:border-forest focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="px-4 py-3 rounded-xl border bg-card"
          >
            <option value="all">All Districts</option>
            {districts.filter(d => d !== "all").map(district => (
              <option key={district} value={district}>{district}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Farmers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredFarmers.map((farmer) => (
          <motion.div
            key={farmer.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-xl border shadow-sm p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-forest/10 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-forest" />
                </div>
                <div>
                  <h3 className="font-semibold text-soil">{farmer.name}</h3>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Phone className="w-3 h-3" />
                    <span>{farmer.phone}</span>
                  </div>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(farmer.status)}`}>
                {farmer.status}
              </span>
            </div>

            <div className="flex items-center gap-1 text-sm text-muted-foreground mb-4">
              <MapPin className="w-4 h-4" />
              <span>{farmer.village}, {farmer.district}, {farmer.state}</span>
            </div>

            <div className="grid grid-cols-4 gap-3 mb-4">
              <div className="text-center p-2 bg-muted/50 rounded-lg">
                <p className="text-lg font-bold text-soil">{farmer.totalFarms}</p>
                <p className="text-xs text-muted-foreground">Farms</p>
              </div>
              <div className="text-center p-2 bg-muted/50 rounded-lg">
                <p className="text-lg font-bold text-soil">{farmer.totalArea}</p>
                <p className="text-xs text-muted-foreground">Hectares</p>
              </div>
              <div className="text-center p-2 bg-muted/50 rounded-lg">
                <p className="text-lg font-bold text-forest">{farmer.creditsEarned}</p>
                <p className="text-xs text-muted-foreground">Credits</p>
              </div>
              <div className="text-center p-2 bg-muted/50 rounded-lg">
                <p className={`text-lg font-bold ${getHealthColor(farmer.healthScore)}`}>
                  {farmer.healthScore > 0 ? `${farmer.healthScore}%` : "-"}
                </p>
                <p className="text-xs text-muted-foreground">Health</p>
              </div>
            </div>

            <motion.button
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-muted rounded-lg text-sm font-medium text-soil hover:bg-muted/80"
              whileTap={{ scale: 0.98 }}
            >
              <Eye className="w-4 h-4" />
              View Details
              <ChevronRight className="w-4 h-4" />
            </motion.button>
          </motion.div>
        ))}
      </div>

      {filteredFarmers.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No farmers found matching your search</p>
        </div>
      )}
    </div>
  );
};

export default FarmersList;
