export interface Note {
  id: string;
  text?: string;
  bgColor?: string;
  textColor?: string;
  fontFamily?: string;
  drawing?: string;
  position?: {
    x: number;
    y: number;
  };
}

const STORAGE_KEY = "valentine_notes";

export function loadNotes(): Note[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? (JSON.parse(data) as Note[]) : [];
}

export function saveNotes(notes: Note[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}
