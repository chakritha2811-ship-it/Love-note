"use client";

import React from "react";

export default function GlowBackground({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Gingham Background */}
      <div className="fixed inset-0 bg-gingham bg-repeat bg-center bg-cover" />

      {/* Soft Romantic Inner Glow */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,rgba(255,0,0,0.25),transparent_65%)] pointer-events-none" />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
