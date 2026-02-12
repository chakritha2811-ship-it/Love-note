"use client";

import { useEffect, useRef, useState } from "react";
import { Note } from "@/utils/storage";

interface Props {
  note: Note;
  onDelete: () => void;
  onDrag: (id: string, x: number, y: number) => void;
  onClick: () => void;
}

export default function NoteIcon({
  note,
  onDelete,
  onDrag,
  onClick
}: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const [showDelete, setShowDelete] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || !note.position) return;
    el.style.left = `${note.position.x}px`;
    el.style.top = `${note.position.y}px`;
  }, [note.position]);

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    const parentRect =
      e.currentTarget.parentElement?.getBoundingClientRect();
    if (!parentRect) return;

    const x = e.clientX - parentRect.left;
    const y = e.clientY - parentRect.top;

    onDrag(note.id, x, y);
  };

  const handleMouseDown = () => {
    timerRef.current = setTimeout(() => {
      setShowDelete(true);
    }, 800); // long press duration
  };

  const handleMouseUp = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  };

  const handleDeleteConfirm = () => {
    onDelete();
    setShowDelete(false);
  };

  return (
    <div
      ref={ref}
      draggable
      onDragEnd={handleDragEnd}
      onClick={onClick}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      className="absolute cursor-pointer hover:scale-110 transition"
    >
      {/* DRAWING OR ENVELOPE */}
      {note.drawing ? (
        <img
          src={note.drawing}
          alt="drawing"
          className="w-28 h-28 object-contain drop-shadow-lg"
        />
      ) : (
        <div
          className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center text-white text-xl"
          style={{
            boxShadow:
              "0 0 10px rgba(137, 20, 20, 0.8), 0 0 25px rgba(121, 25, 25, 0.6)"
          }}
        >
          💌
        </div>
      )}

      {/* LONG PRESS DELETE POPUP */}
      {showDelete && (
        <div className="absolute top-full mt-2 bg-white shadow-xl rounded-xl p-3 text-sm">
          <p className="mb-2">Delete this note?</p>
          <div className="flex gap-3">
            <button
              onClick={handleDeleteConfirm}
              className="text-red-600"
            >
              Yes
            </button>
            <button
              onClick={() => setShowDelete(false)}
              className="text-gray-500"
            >
              No
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
