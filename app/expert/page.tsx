"use client";

import { SlideExpert } from "../apresentacao/_slides";

export default function ExpertPage() {
  return (
    <div className="w-screen h-screen overflow-hidden" style={{ background: "var(--bg-0)" }}>
      <SlideExpert />
    </div>
  );
}
