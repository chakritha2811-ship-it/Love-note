"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  onSave: (image: string) => void;
}

export default function DrawingPad({ onSave }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [drawing, setDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = 4;
    ctx.strokeStyle = "#860d0d"; // RED STROKE
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    setDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!drawing) return;

    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;

    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.stroke();
  };

  const stopDrawing = () => setDrawing(false);

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const image = canvas.toDataURL("image/png"); // transparent
    onSave(image);
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="bg-[#ffe6ec] p-2 rounded-2xl shadow-inner">
        <canvas
          ref={canvasRef}
          width={300}
          height={200}
          className="rounded-xl cursor-crosshair"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
        />
      </div>

      <button
        onClick={handleSave}
        className="px-4 py-2 bg-pink-200 rounded-full shadow hover:scale-105 transition"
      >
        Save Drawing🎨
      </button>
    </div>
  );
}
