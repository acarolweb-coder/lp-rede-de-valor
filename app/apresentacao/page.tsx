"use client";

import dynamic from "next/dynamic";

const Apresentacao = dynamic(() => import("./_slides"), {
  ssr: false,
  loading: () => (
    <div
      className="w-screen h-screen"
      style={{
        background: "var(--bg-0)",
        fontFamily: "var(--font-jakarta), 'Plus Jakarta Sans', system-ui, sans-serif",
      }}
    />
  ),
});

export default function Page() {
  return <Apresentacao />;
}
