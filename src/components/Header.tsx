import { motion } from "framer-motion";
import { User, Volume2 } from "lucide-react";

interface HeaderProps {
  language: "hi" | "en";
  onLanguageToggle: () => void;
  userName: string;
}

const Header = ({ language, onLanguageToggle, userName }: HeaderProps) => {
  return (
    <header className="flex items-center justify-between px-4 py-3 safe-top">
      {/* Profile Section */}
      <motion.div 
        className="flex items-center gap-3"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <div className="w-10 h-10 rounded-full bg-forest flex items-center justify-center shadow-glow-forest">
          <User className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground">
            {language === "hi" ? "नमस्ते" : "Namaste"} 🙏
          </p>
          <p className="font-semibold text-soil text-sm">{userName}</p>
        </div>
      </motion.div>

      {/* Right Actions */}
      <motion.div 
        className="flex items-center gap-2"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        {/* Voice Button */}
        <motion.button
          className="voice-btn"
          whileTap={{ scale: 0.9 }}
          aria-label="Voice assistance"
        >
          <Volume2 className="w-5 h-5" />
        </motion.button>

        {/* Language Toggle */}
        <motion.button
          onClick={onLanguageToggle}
          className="px-3 py-2 rounded-xl bg-card shadow-earth-sm border border-border font-semibold text-sm"
          whileTap={{ scale: 0.95 }}
        >
          <span className={language === "hi" ? "text-forest" : "text-muted-foreground"}>
            हिं
          </span>
          <span className="mx-1 text-border">|</span>
          <span className={language === "en" ? "text-forest" : "text-muted-foreground"}>
            EN
          </span>
        </motion.button>
      </motion.div>
    </header>
  );
};

export default Header;
