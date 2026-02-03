import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Coins, 
  TrendingUp, 
  IndianRupee,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Filter,
  Download,
  Send
} from "lucide-react";

interface CarbonCredit {
  id: string;
  farmerId: string;
  farmerName: string;
  farmName: string;
  creditsAmount: number;
  pricePerCredit: number;
  status: "pending" | "verified" | "sold";
  payoutStatus: "pending" | "processing" | "completed";
  season: string;
  year: number;
  createdAt: string;
}

const CarbonCreditsManager = () => {
  const [filter, setFilter] = useState<"all" | "pending" | "verified" | "sold">("all");

  // Mock data
  const credits: CarbonCredit[] = [
    {
      id: "1",
      farmerId: "f1",
      farmerName: "Rajesh Kumar",
      farmName: "Kumar Farm",
      creditsAmount: 25,
      pricePerCredit: 500,
      status: "verified",
      payoutStatus: "pending",
      season: "Kharif",
      year: 2025,
      createdAt: "2026-01-15",
    },
    {
      id: "2",
      farmerId: "f2",
      farmerName: "Priya Devi",
      farmName: "Devi Fields",
      creditsAmount: 18,
      pricePerCredit: 500,
      status: "sold",
      payoutStatus: "completed",
      season: "Rabi",
      year: 2025,
      createdAt: "2026-01-10",
    },
    {
      id: "3",
      farmerId: "f3",
      farmerName: "Suresh Yadav",
      farmName: "Yadav Khet",
      creditsAmount: 32,
      pricePerCredit: 500,
      status: "pending",
      payoutStatus: "pending",
      season: "Kharif",
      year: 2025,
      createdAt: "2026-02-01",
    },
  ];

  const filteredCredits = filter === "all" ? credits : credits.filter(c => c.status === filter);

  const totalPending = credits.filter(c => c.status === "pending").reduce((sum, c) => sum + c.creditsAmount, 0);
  const totalVerified = credits.filter(c => c.status === "verified").reduce((sum, c) => sum + c.creditsAmount, 0);
  const totalSold = credits.filter(c => c.status === "sold").reduce((sum, c) => sum + c.creditsAmount, 0);
  const totalRevenue = credits.filter(c => c.status === "sold").reduce((sum, c) => sum + (c.creditsAmount * c.pricePerCredit), 0);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return <span className="px-2 py-1 bg-forest/10 text-forest rounded-full text-xs font-medium">Verified</span>;
      case "sold":
        return <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-xs font-medium">Sold</span>;
      default:
        return <span className="px-2 py-1 bg-amber/10 text-amber-600 rounded-full text-xs font-medium">Pending</span>;
    }
  };

  const getPayoutBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <span className="text-forest text-xs">✓ Paid</span>;
      case "processing":
        return <span className="text-amber-600 text-xs">Processing</span>;
      default:
        return <span className="text-muted-foreground text-xs">Pending</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-soil">Carbon Credits</h1>
          <p className="text-muted-foreground">Manage credit verification and payouts</p>
        </div>
        <div className="flex gap-2">
          <motion.button
            className="flex items-center gap-2 px-4 py-2 bg-muted rounded-lg text-sm font-medium"
            whileTap={{ scale: 0.98 }}
          >
            <Download className="w-4 h-4" />
            Export
          </motion.button>
          <motion.button
            className="flex items-center gap-2 px-4 py-2 bg-forest text-white rounded-lg text-sm font-medium"
            whileTap={{ scale: 0.98 }}
          >
            <Send className="w-4 h-4" />
            Bulk Payout
          </motion.button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-card rounded-xl p-4 border shadow-sm">
          <div className="flex items-center gap-2 text-amber-600 mb-2">
            <Clock className="w-5 h-5" />
            <span className="text-sm">Pending</span>
          </div>
          <p className="text-2xl font-bold text-soil">{totalPending}</p>
          <p className="text-xs text-muted-foreground">credits awaiting verification</p>
        </div>
        <div className="bg-card rounded-xl p-4 border shadow-sm">
          <div className="flex items-center gap-2 text-forest mb-2">
            <CheckCircle2 className="w-5 h-5" />
            <span className="text-sm">Verified</span>
          </div>
          <p className="text-2xl font-bold text-soil">{totalVerified}</p>
          <p className="text-xs text-muted-foreground">ready for marketplace</p>
        </div>
        <div className="bg-card rounded-xl p-4 border shadow-sm">
          <div className="flex items-center gap-2 text-blue-600 mb-2">
            <ArrowUpRight className="w-5 h-5" />
            <span className="text-sm">Sold</span>
          </div>
          <p className="text-2xl font-bold text-soil">{totalSold}</p>
          <p className="text-xs text-muted-foreground">credits transacted</p>
        </div>
        <div className="bg-card rounded-xl p-4 border shadow-sm">
          <div className="flex items-center gap-2 text-soil mb-2">
            <IndianRupee className="w-5 h-5" />
            <span className="text-sm">Revenue</span>
          </div>
          <p className="text-2xl font-bold text-soil">₹{(totalRevenue / 100000).toFixed(2)}L</p>
          <p className="text-xs text-muted-foreground">total earnings</p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2">
        <Filter className="w-4 h-4 text-muted-foreground" />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as typeof filter)}
          className="px-4 py-2 rounded-lg border bg-card text-sm"
        >
          <option value="all">All Credits</option>
          <option value="pending">Pending Verification</option>
          <option value="verified">Verified</option>
          <option value="sold">Sold</option>
        </select>
      </div>

      {/* Credits Table */}
      <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Farmer</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Farm</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Season</th>
              <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Credits</th>
              <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Value</th>
              <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
              <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Payout</th>
              <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredCredits.map((credit) => (
              <tr key={credit.id} className="hover:bg-muted/30 transition-colors">
                <td className="py-3 px-4">
                  <p className="font-medium text-soil">{credit.farmerName}</p>
                </td>
                <td className="py-3 px-4 text-muted-foreground">{credit.farmName}</td>
                <td className="py-3 px-4 text-muted-foreground">{credit.season} {credit.year}</td>
                <td className="py-3 px-4 text-center">
                  <span className="font-semibold text-soil">{credit.creditsAmount}</span>
                </td>
                <td className="py-3 px-4 text-center">
                  <span className="font-medium text-forest">₹{(credit.creditsAmount * credit.pricePerCredit).toLocaleString()}</span>
                </td>
                <td className="py-3 px-4 text-center">
                  {getStatusBadge(credit.status)}
                </td>
                <td className="py-3 px-4 text-center">
                  {getPayoutBadge(credit.payoutStatus)}
                </td>
                <td className="py-3 px-4 text-center">
                  {credit.status === "pending" && (
                    <motion.button
                      className="px-3 py-1.5 bg-forest text-white rounded-lg text-xs font-medium"
                      whileTap={{ scale: 0.95 }}
                    >
                      Verify
                    </motion.button>
                  )}
                  {credit.status === "verified" && (
                    <motion.button
                      className="px-3 py-1.5 bg-blue-500 text-white rounded-lg text-xs font-medium"
                      whileTap={{ scale: 0.95 }}
                    >
                      List for Sale
                    </motion.button>
                  )}
                  {credit.status === "sold" && credit.payoutStatus === "pending" && (
                    <motion.button
                      className="px-3 py-1.5 bg-amber-500 text-white rounded-lg text-xs font-medium"
                      whileTap={{ scale: 0.95 }}
                    >
                      Process Payout
                    </motion.button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Current Market Price */}
      <div className="bg-forest/10 rounded-xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <TrendingUp className="w-6 h-6 text-forest" />
          <div>
            <p className="font-medium text-soil">Current Market Price (IEX)</p>
            <p className="text-sm text-muted-foreground">Indian Energy Exchange - Carbon Credits</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-forest">₹500</p>
          <p className="text-sm text-forest">+2.5% today</p>
        </div>
      </div>
    </div>
  );
};

export default CarbonCreditsManager;
