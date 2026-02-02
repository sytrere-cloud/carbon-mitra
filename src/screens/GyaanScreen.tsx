import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Lightbulb, 
  Play, 
  Volume2, 
  TreePine,
  Sprout,
  Droplets,
  MessageCircle,
  ChevronRight,
  Sparkles
} from "lucide-react";

interface GyaanScreenProps {
  language: "hi" | "en";
}

const GyaanScreen = ({ language }: GyaanScreenProps) => {
  const [activeTab, setActiveTab] = useState<"tips" | "videos">("tips");

  const labels = {
    hi: {
      title: "ज्ञान",
      subtitle: "कार्बन विकास सलाह",
      tips: "AI टिप्स",
      videos: "वीडियो",
      potentialEarnings: "संभावित कमाई",
      askMitra: "मित्र से पूछें",
      watchNow: "अभी देखें"
    },
    en: {
      title: "Gyaan",
      subtitle: "Carbon Growth Advice",
      tips: "AI Tips",
      videos: "Videos",
      potentialEarnings: "Potential Earnings",
      askMitra: "Ask Mitra",
      watchNow: "Watch Now"
    }
  };

  const t = labels[language];

  const aiTips = [
    {
      icon: TreePine,
      title: { hi: "सीमा पर 10 नीम के पेड़ लगाएं", en: "Plant 10 Neem trees on the border" },
      description: { hi: "अतिरिक्त ₹2,000 कमाएं", en: "Earn additional ₹2,000" },
      earnings: 2000,
      color: "bg-forest/10 text-forest"
    },
    {
      icon: Sprout,
      title: { hi: "कम जुताई अपनाएं", en: "Adopt Reduced Tillage" },
      description: { hi: "मिट्टी का कार्बन 15% बढ़ाएं", en: "Increase soil carbon by 15%" },
      earnings: 3500,
      color: "bg-amber/10 text-amber"
    },
    {
      icon: Droplets,
      title: { hi: "ड्रिप सिंचाई का उपयोग करें", en: "Use Drip Irrigation" },
      description: { hi: "पानी बचाएं और क्रेडिट कमाएं", en: "Save water and earn credits" },
      earnings: 1500,
      color: "bg-sky/10 text-sky"
    }
  ];

  const videos = [
    {
      title: { hi: "कम जुताई कैसे करें", en: "How to do Reduced Tillage" },
      duration: "1:30",
      thumbnail: "🌾"
    },
    {
      title: { hi: "कवर क्रॉपिंग गाइड", en: "Cover Cropping Guide" },
      duration: "2:15",
      thumbnail: "🌱"
    },
    {
      title: { hi: "जैविक खाद बनाना", en: "Making Organic Compost" },
      duration: "1:45",
      thumbnail: "🍂"
    },
    {
      title: { hi: "पानी बचाने के तरीके", en: "Water Conservation Methods" },
      duration: "2:00",
      thumbnail: "💧"
    }
  ];

  return (
    <div className="px-4 space-y-6 pb-8">
      {/* Header */}
      <motion.div
        className="flex items-center justify-between"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className="text-xl font-bold text-soil flex items-center gap-2">
            <Lightbulb className="w-6 h-6 text-amber" />
            {t.title}
          </h1>
          <p className="text-sm text-muted-foreground">{t.subtitle}</p>
        </div>
        <motion.button
          className="voice-btn"
          whileTap={{ scale: 0.9 }}
        >
          <Volume2 className="w-5 h-5" />
        </motion.button>
      </motion.div>

      {/* Tab Switcher */}
      <motion.div
        className="flex gap-2 p-1 bg-muted rounded-2xl"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {(["tips", "videos"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 rounded-xl font-medium text-sm transition-all ${
              activeTab === tab
                ? "bg-card shadow-earth-sm text-soil"
                : "text-muted-foreground"
            }`}
          >
            {tab === "tips" ? t.tips : t.videos}
          </button>
        ))}
      </motion.div>

      {/* AI Tips */}
      {activeTab === "tips" && (
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {aiTips.map((tip, index) => {
            const Icon = tip.icon;
            return (
              <motion.div
                key={index}
                className="card-earth"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl ${tip.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-soil">{tip.title[language]}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {tip.description[language]}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber" />
                      <span className="text-sm font-medium text-amber">
                        +₹{tip.earnings.toLocaleString('en-IN')} {t.potentialEarnings}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* Videos */}
      {activeTab === "videos" && (
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {videos.map((video, index) => (
            <motion.div
              key={index}
              className="card-earth flex items-center gap-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {/* Thumbnail */}
              <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-forest to-forest-dark flex items-center justify-center relative">
                <span className="text-3xl">{video.thumbnail}</span>
                <div className="absolute inset-0 flex items-center justify-center bg-soil/30 rounded-xl">
                  <div className="w-8 h-8 rounded-full bg-card flex items-center justify-center">
                    <Play className="w-4 h-4 text-forest ml-0.5" fill="currentColor" />
                  </div>
                </div>
              </div>

              {/* Info */}
              <div className="flex-1">
                <h3 className="font-semibold text-soil">{video.title[language]}</h3>
                <p className="text-sm text-muted-foreground mt-1">{video.duration}</p>
              </div>

              <motion.button
                className="px-3 py-2 rounded-xl bg-forest/10 text-forest text-sm font-medium"
                whileTap={{ scale: 0.95 }}
              >
                {t.watchNow}
              </motion.button>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Mitra Chatbot FAB */}
      <motion.button
        className="fixed bottom-24 right-4 w-14 h-14 rounded-full bg-forest text-primary-foreground shadow-glow-forest flex items-center justify-center"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: "spring" }}
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: 1.05 }}
      >
        <MessageCircle className="w-6 h-6" />
      </motion.button>
    </div>
  );
};

export default GyaanScreen;
