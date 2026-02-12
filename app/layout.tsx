import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Valentine Love Board 💖",
  description: "Romantic scrapbook love board",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-romantic min-h-screen font-mono">
        <div className="absolute inset-0 bg-black/17 pointer-events-none"></div>
        {children}
      </body>
    </html>
  );
}
