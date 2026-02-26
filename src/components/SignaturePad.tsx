import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Pen, Type, RotateCcw, Check } from "lucide-react";

interface SignaturePadProps {
  language: "hi" | "en";
  onSignatureCapture: (data: string, type: "draw" | "type") => void;
}

const CURSIVE_FONTS = [
  "'Brush Script MT', cursive",
  "'Segoe Script', cursive",
  "cursive",
];

const SignaturePad = ({ language, onSignatureCapture }: SignaturePadProps) => {
  const [mode, setMode] = useState<"draw" | "type">("draw");
  const [typedName, setTypedName] = useState("");
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const labels = {
    hi: { draw: "हस्ताक्षर करें", type: "नाम टाइप करें", clear: "मिटाएं", confirm: "पुष्टि करें", placeholder: "अपना पूरा नाम टाइप करें" },
    en: { draw: "Draw Signature", type: "Type Name", clear: "Clear", confirm: "Confirm", placeholder: "Type your full name" },
  };
  const t = labels[language];

  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    ctx.scale(2, 2);
    ctx.strokeStyle = "hsl(16, 35%, 18%)";
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  }, []);

  useEffect(() => {
    if (mode === "draw") initCanvas();
  }, [mode, initCanvas]);

  const getPos = (e: React.TouchEvent | React.MouseEvent) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    if ("touches" in e) {
      return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top };
    }
    return { x: (e as React.MouseEvent).clientX - rect.left, y: (e as React.MouseEvent).clientY - rect.top };
  };

  const startDraw = (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    setIsDrawing(true);
    setHasDrawn(true);
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const { x, y } = getPos(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDrawing) return;
    e.preventDefault();
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const { x, y } = getPos(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const endDraw = () => setIsDrawing(false);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  };

  const handleConfirm = () => {
    if (mode === "draw") {
      const data = canvasRef.current?.toDataURL("image/png") || "";
      onSignatureCapture(data, "draw");
    } else {
      onSignatureCapture(typedName, "type");
    }
  };

  const canConfirm = mode === "draw" ? hasDrawn : typedName.trim().length >= 2;

  return (
    <div className="space-y-4">
      {/* Mode Toggle */}
      <div className="flex gap-2">
        <motion.button
          onClick={() => setMode("draw")}
          className={`flex-1 py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all ${
            mode === "draw" ? "bg-forest text-primary-foreground" : "bg-muted text-muted-foreground"
          }`}
          whileTap={{ scale: 0.97 }}
        >
          <Pen className="w-4 h-4" /> {t.draw}
        </motion.button>
        <motion.button
          onClick={() => setMode("type")}
          className={`flex-1 py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all ${
            mode === "type" ? "bg-forest text-primary-foreground" : "bg-muted text-muted-foreground"
          }`}
          whileTap={{ scale: 0.97 }}
        >
          <Type className="w-4 h-4" /> {t.type}
        </motion.button>
      </div>

      {/* Signature Area */}
      {mode === "draw" ? (
        <div className="relative">
          <canvas
            ref={canvasRef}
            className="w-full h-32 rounded-2xl border-2 border-dashed border-border bg-card touch-none cursor-crosshair"
            onMouseDown={startDraw}
            onMouseMove={draw}
            onMouseUp={endDraw}
            onMouseLeave={endDraw}
            onTouchStart={startDraw}
            onTouchMove={draw}
            onTouchEnd={endDraw}
          />
          {!hasDrawn && (
            <p className="absolute inset-0 flex items-center justify-center text-muted-foreground text-sm pointer-events-none">
              {language === "hi" ? "यहाँ हस्ताक्षर करें" : "Sign here"}
            </p>
          )}
          <motion.button
            onClick={clearCanvas}
            className="absolute top-2 right-2 p-1.5 rounded-lg bg-muted/80 text-muted-foreground"
            whileTap={{ scale: 0.9 }}
          >
            <RotateCcw className="w-4 h-4" />
          </motion.button>
        </div>
      ) : (
        <div className="space-y-3">
          <input
            type="text"
            value={typedName}
            onChange={(e) => setTypedName(e.target.value)}
            placeholder={t.placeholder}
            className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground focus:ring-2 focus:ring-primary focus:border-primary outline-none"
            maxLength={100}
          />
          {typedName.trim() && (
            <div className="w-full h-20 rounded-2xl border border-border bg-card flex items-center justify-center">
              <span style={{ fontFamily: CURSIVE_FONTS[0], fontSize: "28px" }} className="text-foreground">
                {typedName}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Confirm */}
      <motion.button
        onClick={handleConfirm}
        disabled={!canConfirm}
        className={`w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
          canConfirm ? "btn-amber" : "bg-muted text-muted-foreground cursor-not-allowed"
        }`}
        whileTap={canConfirm ? { scale: 0.98 } : {}}
      >
        <Check className="w-5 h-5" />
        {t.confirm}
      </motion.button>
    </div>
  );
};

export default SignaturePad;
