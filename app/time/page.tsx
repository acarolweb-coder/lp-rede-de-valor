"use client";

import dynamic from "next/dynamic";

const ApresentacaoTIME = dynamic(() => import("./_slides"), {
  ssr: false,
  loading: () => (
    <div
      className="w-screen h-screen"
      style={{
        background: "#030303",
        fontFamily: "var(--font-jakarta), 'Plus Jakarta Sans', system-ui, sans-serif",
      }}
    />
  ),
});

export default function Page() {
  return <ApresentacaoTIME />;
}
