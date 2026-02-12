"use client";

import { useEffect, useState } from "react";
import AddNoteModal from "@/components/AddNoteModal";
import NoteIcon from "@/components/NoteIcon";
import { Note } from "@/utils/storage";

// 🔹 Import Firestore
import { collection, addDoc, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/utils/firebase"; // your firebase.ts file

type Screen = "start" | "choose" | "board";

export default function Page() {
  const [screen, setScreen] = useState<Screen>("start");
  const [selectedType, setSelectedType] = useState<"him" | "her" | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [noPosition, setNoPosition] = useState({ top: 0, left: 0 });

  // ===========================
  // 🔹 Load notes from Firebase in real-time
  // ===========================
  useEffect(() => {
    const q = collection(db, "notes");
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notesData = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setNotes(notesData as Note[]);
    });
    return () => unsubscribe();
  }, []);

  // ===========================
  // 🔹 Add note to Firebase (and keep your original board behavior)
  // ===========================
  const addNote = async (noteData: Omit<Note, "id">) => {
    await addDoc(collection(db, "notes"), {
      ...noteData,
      position: { x: Math.random() * 600, y: Math.random() * 350 },
      createdAt: new Date(),
    });
  };

  // ===========================
  // 🔹 Delete note from Firebase
  // ===========================
  const deleteNote = async (id: string) => {
    await deleteDoc(doc(db, "notes", id));
  };

  const updatePosition = (id: string, x: number, y: number): void => {
    // Keep positions local for dragging only
    setNotes((prev) =>
      prev.map((note) => (note.id === id ? { ...note, position: { x, y } } : note))
    );
  };

  const moveNoButton = (): void => {
    const randomTop = Math.random() * 300 - 150;
    const randomLeft = Math.random() * 300 - 150;
    setNoPosition({ top: randomTop, left: randomLeft });
  };

  // ===========================
  // SCREEN 1 — YES / NO
  // ===========================
  if (screen === "start") {
    return (
      <div className="h-screen flex flex-col items-center justify-center relative text-center">
        <h1 className="text-5xl text-white font-mono mb-12 glow-text">
          Will you open our Love Board?🎀
        </h1>

        <div className="relative flex gap-12">
          <button
            onClick={() => setScreen("choose")}
            className="px-8 py-3 text-white rounded-full shadow-lg hover:scale-110 transition text-xl glow-text glow-button"
            style={{ backgroundColor: "#8f0e0e80" }}
          >
            Yes🌹
          </button>

          <button
            onMouseEnter={moveNoButton}
            style={{
              transform: `translate(${noPosition.left}px, ${noPosition.top}px)`,
              backgroundColor: "#8f0e0e80",
            }}
            className="px-8 py-3 text-white rounded-full shadow-lg hover:scale-110 transition text-xl glow-text glow-button"
          >
            No 🙈
          </button>
        </div>
      </div>
    );
  }

  // ===========================
  // SCREEN 2 — FOR HIM / HER
  // ===========================
  if (screen === "choose") {
    return (
      <div className="h-screen flex flex-col items-center justify-center text-center">
        <h1 className="text-5xl text-white font-mono mb-12 glow-text">
          Who is this Love Board for?💌
        </h1>

        <div className="flex gap-16">
          <button
            onClick={() => {
              setSelectedType("him");
              setScreen("board");
            }}
            className="px-8 py-3 text-white rounded-2xl text-xl shadow-lg hover:scale-110 transition glow-text glow-button"
            style={{ backgroundColor: "#8f0e0e80" }}
          >
            For Him🐻
          </button>

          <button
            onClick={() => {
              setSelectedType("her");
              setScreen("board");
            }}
            className="px-8 py-3 text-white rounded-2xl text-xl shadow-lg hover:scale-110 transition glow-text glow-button"
            style={{ backgroundColor: "#8f0e0e80" }}
          >
            For Her💐
          </button>
        </div>
      </div>
    );
  }

  // ===========================
  // SCREEN 3 — LOVE BOARD
  // ===========================
  return (
    <div className="min-h-screen relative p-8 flex flex-col items-center justify-center pt-0">
      <h1 className="text-5xl text-white font-mono mb-12 glow-text">
        {selectedType === "him" ? "Love Board for Him" : "Love Board for Her"}
      </h1>

      <button
        onClick={() => setShowModal(true)}
        className="absolute top-8 right-8 w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-xl hover:scale-110 transition"
        style={{ backgroundColor: "#4e0909A6" }}
      >
        💌
      </button>

      <div className="relative w-full h-[70vh] overflow-hidden">
        {notes.map((note) => (
          <NoteIcon
            key={note.id}
            note={note}
            onClick={() => setSelectedNote(note)}
            onDelete={() => deleteNote(note.id)}
            onDrag={updatePosition}
          />
        ))}
      </div>

      {showModal && <AddNoteModal onClose={() => setShowModal(false)} onSave={addNote} />}

      {selectedNote && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div
            className="p-6 w-[400px] rounded-3xl shadow-lg"
            style={{ backgroundColor: "#5f121266" }}
          >
            <h2 className="text-center text-white text-xl mb-4 font-mono glow-text">
              Your Love Note💌
            </h2>

            <p
              className="whitespace-pre-wrap text-center text-lg font-mono text-white"
              style={{
                fontFamily: selectedNote.fontFamily,
              }}
            >
              {selectedNote.text}
            </p>

            <button
              onClick={() => setSelectedNote(null)}
              className="mt-6 block mx-auto px-4 py-2 text-white rounded-full hover:scale-105 transition glow-text"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
