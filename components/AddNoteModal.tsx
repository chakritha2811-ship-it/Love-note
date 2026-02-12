"use client";

import { useState } from "react";
import { Note } from "@/utils/storage";
import DrawingPad from "./DrawingPad";

// 🔹 Import Firestore
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/utils/firebase";

interface Props {
  onClose: () => void;
  onSave: (note: Omit<Note, "id">) => void;
}

export default function AddNoteModal({ onClose, onSave }: Props) {
  const [text, setText] = useState("");
  const [fontFamily, setFontFamily] = useState("serif");
  const [drawing, setDrawing] = useState<string | undefined>();

  const handleSave = () => {
    // ✅ Always allow save if either text or drawing exists
    if (!text.trim() && !drawing) return;

    // 🔹 If no drawing, assign a random emoji
    const emojis = ["💌", "🌹", "💖", "💐", "💕", "🥰", "💘"];
    const noteDrawing = drawing || emojis[Math.floor(Math.random() * emojis.length)];

    const noteData = {
      text: text.trim(),
      fontFamily,
      bgColor: "#581616",
      textColor: "#782727",
      drawing: noteDrawing,
      position: { x: Math.random() * 600, y: Math.random() * 350 },
      createdAt: new Date(),
    };

    // 🔹 Save locally first to keep your original board behavior
    onSave(noteData);

    // 🔹 Save to Firestore publicly (anyone can read/write based on rules)
    addDoc(collection(db, "notes"), noteData)
      .then(() => console.log("Saved to Firestore!"))
      .catch((err) => console.log("Firebase save error:", err));

    // 🔹 Close modal immediately after saving
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl p-6 w-[420px] shadow-2xl space-y-4">

        <h2 className="text-2xl text-red-800 font-serif text-center">
          Write a Love Note💌 
        </h2>

        <textarea
          placeholder="Type something sweet here...💕"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full p-3 rounded-xl border"
          style={{ fontFamily, color: "#5d1c1c" }}
        />

        <select
          value={fontFamily}
          onChange={(e) => setFontFamily(e.target.value)}
          className="w-full p-2 rounded-lg border"
        >
          <option value="serif">💗 Elegant Serif</option>
          <option value="cursive">💞 Romantic Cursive</option>
          <option value="monospace">💌 Cute Typewriter</option>
          <option value="sans-serif">🌸 Minimal Clean</option>
          <option value="'Comic Sans MS'">🧸 Playful Handwritten</option>
        </select>

        <DrawingPad onSave={(img) => setDrawing(img)} />

        <div className="flex justify-between pt-2">
          <button onClick={onClose} className="text-grey-500">
            Cancel
          </button>

          <button
            onClick={handleSave}
            className="px-4 py-2 bg-pink-300 text-white rounded-full hover:scale-105 transition shadow-md"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
