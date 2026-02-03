import { motion } from "framer-motion";
import { 
  Users, 
  ImageIcon, 
  Coins, 
  TrendingUp,
  CheckCircle2,
  Clock,
  XCircle,
  IndianRupee
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

const AdminOverview = () => {
  // Mock stats data
  const stats = [
    { label: "Total Farmers", value: "1,247", icon: Users, color: "text-forest", bgColor: "bg-forest/10" },
    { label: "Photos Pending", value: "89", icon: Clock, color: "text-amber", bgColor: "bg-amber/10" },
    { label: "Credits Issued", value: "12,450", icon: Coins, color: "text-forest", bgColor: "bg-forest/10" },
    { label: "Revenue", value: "₹62.25L", icon: IndianRupee, color: "text-soil", bgColor: "bg-soil/10" },
  ];

  // Mock chart data
  const creditsTrend = [
    { month: "Jan", credits: 400 },
    { month: "Feb", credits: 600 },
    { month: "Mar", credits: 800 },
    { month: "Apr", credits: 1200 },
    { month: "May", credits: 1800 },
    { month: "Jun", credits: 2400 },
    { month: "Jul", credits: 3200 },
    { month: "Aug", credits: 4000 },
  ];

  const verificationStats = [
    { status: "Approved", count: 856, color: "#2E7D32" },
    { status: "Pending", count: 89, color: "#F59E0B" },
    { status: "Rejected", count: 45, color: "#EF4444" },
  ];

  const recentActivity = [
    { id: 1, farmer: "Rajesh Kumar", action: "Photo approved", time: "2 min ago", type: "approved" },
    { id: 2, farmer: "Priya Devi", action: "New photo submitted", time: "5 min ago", type: "pending" },
    { id: 3, farmer: "Suresh Yadav", action: "Credits issued (25)", time: "12 min ago", type: "approved" },
    { id: 4, farmer: "Meena Kumari", action: "Photo rejected", time: "18 min ago", type: "rejected" },
    { id: 5, farmer: "Ravi Singh", action: "Farm boundary updated", time: "25 min ago", type: "approved" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-soil">Dashboard Overview</h1>
        <p className="text-muted-foreground">Monitor carbon credits and farmer verification status</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-card rounded-xl p-5 border shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold text-soil mt-1">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Credits Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-card rounded-xl p-5 border shadow-sm"
        >
          <h3 className="font-semibold text-soil mb-4">Carbon Credits Issued</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={creditsTrend}>
                <defs>
                  <linearGradient id="colorCredits" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2E7D32" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#2E7D32" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "white", 
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px" 
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="credits" 
                  stroke="#2E7D32" 
                  strokeWidth={2}
                  fill="url(#colorCredits)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Verification Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-card rounded-xl p-5 border shadow-sm"
        >
          <h3 className="font-semibold text-soil mb-4">Photo Verification Status</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={verificationStats} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} />
                <XAxis type="number" stroke="#6b7280" fontSize={12} />
                <YAxis dataKey="status" type="category" stroke="#6b7280" fontSize={12} width={80} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "white", 
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px" 
                  }} 
                />
                <Bar 
                  dataKey="count" 
                  radius={[0, 8, 8, 0]}
                  fill="#2E7D32"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-card rounded-xl p-5 border shadow-sm"
      >
        <h3 className="font-semibold text-soil mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {recentActivity.map((activity) => (
            <div 
              key={activity.id}
              className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                activity.type === "approved" ? "bg-forest/10" :
                activity.type === "pending" ? "bg-amber/10" : "bg-red-100"
              }`}>
                {activity.type === "approved" ? (
                  <CheckCircle2 className="w-4 h-4 text-forest" />
                ) : activity.type === "pending" ? (
                  <Clock className="w-4 h-4 text-amber" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-500" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-soil">{activity.farmer}</p>
                <p className="text-xs text-muted-foreground">{activity.action}</p>
              </div>
              <span className="text-xs text-muted-foreground">{activity.time}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default AdminOverview;
