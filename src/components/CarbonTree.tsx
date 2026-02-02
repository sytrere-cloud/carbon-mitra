import { motion } from "framer-motion";

interface CarbonTreeProps {
  healthScore: number; // 0-100
  credits: number;
}

const CarbonTree = ({ healthScore, credits }: CarbonTreeProps) => {
  // Determine tree color based on health
  const getTreeColor = () => {
    if (healthScore >= 80) return "#2E7D32"; // Lush green
    if (healthScore >= 60) return "#4CAF50"; // Medium green
    if (healthScore >= 40) return "#8BC34A"; // Light green
    return "#9E9E9E"; // Gray/stressed
  };

  const treeColor = getTreeColor();
  const coinsToShow = Math.min(Math.floor(credits / 1000), 5); // Max 5 coins

  return (
    <div className="relative w-full flex flex-col items-center py-4">
      {/* Glowing background */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="w-48 h-48 rounded-full opacity-30"
          style={{ background: `radial-gradient(circle, ${treeColor}40, transparent)` }}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* The Tree SVG */}
      <motion.svg
        viewBox="0 0 200 220"
        className="w-56 h-56 tree-glow relative z-10"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Ground/Soil */}
        <ellipse cx="100" cy="210" rx="60" ry="10" fill="#5D4037" opacity="0.3" />
        
        {/* Tree trunk */}
        <motion.path
          d="M90 210 L95 160 L85 160 L90 130 L80 130 Q100 120 120 130 L110 130 L105 160 L115 160 L110 210 Z"
          fill="#5D4037"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
        />
        
        {/* Tree canopy - multiple layers for depth */}
        <motion.ellipse
          cx="100"
          cy="90"
          rx="55"
          ry="50"
          fill={treeColor}
          opacity="0.9"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        />
        <motion.ellipse
          cx="70"
          cy="100"
          rx="35"
          ry="35"
          fill={treeColor}
          opacity="0.95"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        />
        <motion.ellipse
          cx="130"
          cy="95"
          rx="40"
          ry="38"
          fill={treeColor}
          opacity="0.95"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        />
        <motion.ellipse
          cx="100"
          cy="60"
          rx="45"
          ry="40"
          fill={treeColor}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        />
        
        {/* Highlight on leaves */}
        <motion.ellipse
          cx="85"
          cy="50"
          rx="20"
          ry="15"
          fill="#4CAF50"
          opacity="0.5"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        />

        {/* Gold coins hanging from tree */}
        {Array.from({ length: coinsToShow }).map((_, i) => (
          <motion.g
            key={i}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 + i * 0.15, duration: 0.5 }}
          >
            <motion.circle
              cx={65 + i * 18}
              cy={75 + (i % 2) * 25}
              r="10"
              fill="#F9A825"
              className="coin-shimmer"
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
            />
            <text
              x={65 + i * 18}
              y={79 + (i % 2) * 25}
              textAnchor="middle"
              fontSize="10"
              fill="#5D4037"
              fontWeight="bold"
            >
              ₹
            </text>
          </motion.g>
        ))}
      </motion.svg>

      {/* Health indicator */}
      <motion.div
        className="mt-2 flex items-center gap-2 px-4 py-2 rounded-full bg-card shadow-earth-sm"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <div className="w-2 h-2 rounded-full bg-forest animate-pulse" />
        <span className="text-sm font-medium text-soil">
          Health: <span className="text-forest font-bold">{healthScore}%</span>
        </span>
      </motion.div>
    </div>
  );
};

export default CarbonTree;
