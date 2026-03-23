"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

// ─── CONSTANTS ───
const TOTAL = 15;
const FONT = "var(--font-jakarta), 'Plus Jakarta Sans', system-ui, sans-serif";

// ─── TYPE SCALES (presentation-size — big, bold, clear) ───
const TYPE = {
  hero: "clamp(3rem, 6vw, 5rem)",
  main: "clamp(2.6rem, 5vw, 3.8rem)",
  center: "clamp(2.2rem, 4.5vw, 3.2rem)",
  quote: "clamp(2rem, 4vw, 3rem)",
  body: "clamp(1.1rem, 1.8vw, 1.35rem)",
  bodyLg: "clamp(1.2rem, 2vw, 1.5rem)",
  label: 14,
  cardTitle: 20,
  cardBody: 16,
  stat: "clamp(2.8rem, 5vw, 4rem)",
  statLabel: 14,
  listItem: 18,
};

// ─── ANIMATION VARIANTS ───
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 30, filter: "blur(4px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
};
const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.6, ease: "easeOut" } },
};
const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};
const slideL = {
  hidden: { opacity: 0, x: -50, filter: "blur(5px)" },
  show: { opacity: 1, x: 0, filter: "blur(0px)", transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};
const slideR = {
  hidden: { opacity: 0, x: 50, filter: "blur(5px)" },
  show: { opacity: 1, x: 0, filter: "blur(0px)", transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};
const scaleReveal = {
  hidden: { opacity: 0, scale: 0.4, filter: "blur(10px)" },
  show: { opacity: 1, scale: 1, filter: "blur(0px)", transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] } },
};

// ─── COUNTER HOOK ───
function useCounter(target: number, dur = 1600, active = true) {
  const [v, setV] = useState(0);
  const raf = useRef<number | null>(null);
  useEffect(() => {
    if (!active) { setV(0); return; }
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - t0) / dur, 1);
      setV(Math.round((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => { if (raf.current) cancelAnimationFrame(raf.current); };
  }, [target, dur, active]);
  return v;
}

// ─── DECORATIVE: GOLD PARTICLES ───
function GoldDust() {
  const dots = [
    { x: "10%", y: "15%", s: 3, d: 0 }, { x: "88%", y: "20%", s: 2, d: 1 },
    { x: "5%", y: "75%", s: 3, d: 2 }, { x: "93%", y: "68%", s: 2, d: 0.5 },
    { x: "50%", y: "6%", s: 2, d: 2.8 }, { x: "70%", y: "90%", s: 3, d: 1.5 },
  ];
  return (
    <>
      {dots.map((p, i) => (
        <motion.div key={i} className="absolute rounded-full pointer-events-none"
          style={{ left: p.x, top: p.y, width: p.s, height: p.s, background: "var(--gold)" }}
          animate={{ opacity: [0.1, 0.5, 0.1], y: [0, -10, 0] }}
          transition={{ duration: 5 + p.d, repeat: Infinity, ease: "easeInOut", delay: p.d }}
        />
      ))}
    </>
  );
}

// ─── DECORATIVE: CORNER ACCENT ───
function CornerAccent({ position = "tl" }: { position?: "tl" | "tr" | "bl" | "br" }) {
  const pos = { tl: { top: 0, left: 0 }, tr: { top: 0, right: 0 }, bl: { bottom: 0, left: 0 }, br: { bottom: 0, right: 0 } }[position];
  const rot = { tl: 0, tr: 90, bl: -90, br: 180 }[position];
  return (
    <div className="absolute pointer-events-none z-20" style={{ ...pos, width: 80, height: 80 }}>
      <svg width="80" height="80" viewBox="0 0 80 80" style={{ transform: `rotate(${rot}deg)` }}>
        <path d="M0 0L40 0" stroke="var(--gold)" strokeWidth="1" opacity="0.3" />
        <path d="M0 0L0 40" stroke="var(--gold)" strokeWidth="1" opacity="0.3" />
      </svg>
    </div>
  );
}

// ─── CUSTOM SVG ICONS ───
function Icon({ name, size = 28, color = "var(--gold)" }: { name: string; size?: number; color?: string }) {
  const icons: Record<string, React.ReactNode> = {
    crowd: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="7" r="3"/><circle cx="17" cy="7" r="2.5"/>
        <path d="M2 21v-2a4 4 0 014-4h6a4 4 0 014 4v2"/><path d="M17 11a3 3 0 013 3v2"/>
      </svg>
    ),
    cardOff: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/>
        <path d="M4 4l16 16" strokeWidth="2"/>
      </svg>
    ),
    clock: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
      </svg>
    ),
    trendDown: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M23 18l-8-8-5 5L2 7"/><path d="M17 18h6v-6"/>
      </svg>
    ),
    target: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
      </svg>
    ),
    calendar: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/><path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01"/>
      </svg>
    ),
    handshake: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 11H4a2 2 0 00-2 2v1a2 2 0 002 2h2l3 3 3-3h2l3 3 3-3h0a2 2 0 002-2v-1a2 2 0 00-2-2z"/>
        <path d="M7 11V7a2 2 0 012-2h6a2 2 0 012 2v4"/>
      </svg>
    ),
    users: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
        <path d="M22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
      </svg>
    ),
    rocket: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 00-2.91-.09z"/>
        <path d="M12 15l-3-3a22 22 0 012-3.95A12.88 12.88 0 0122 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 01-4 2z"/>
        <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 3 0 3 0M12 15v5s3.03-.55 4-2c1.08-1.62 0-3 0-3"/>
      </svg>
    ),
    brain: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a5 5 0 015 5c0 1.3-.5 2.4-1.3 3.3A5 5 0 0119 15a5 5 0 01-3 4.6V22h-4v-2.4A5 5 0 019 15a5 5 0 013.3-4.7A5 5 0 0112 2z"/>
        <path d="M12 2a5 5 0 00-5 5c0 1.3.5 2.4 1.3 3.3"/>
      </svg>
    ),
    book: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
        <path d="M8 7h8M8 11h6"/>
      </svg>
    ),
    link: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/>
        <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>
      </svg>
    ),
    briefcase: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/>
        <path d="M12 12v.01"/>
      </svg>
    ),
    compass: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>
      </svg>
    ),
    shield: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/>
      </svg>
    ),
    diamond: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 3h12l4 6-10 13L2 9z"/><path d="M2 9h20"/>
      </svg>
    ),
    building: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="2" width="16" height="20" rx="1"/><path d="M9 22V12h6v10M8 6h.01M12 6h.01M16 6h.01M8 10h.01M12 10h.01M16 10h.01"/>
      </svg>
    ),
    star: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    ),
  };
  return <>{icons[name] || null}</>;
}

// ─── LABEL (reusable) ───
function Label({ children }: { children: string }) {
  return (
    <motion.p variants={fadeUp} style={{
      fontSize: TYPE.label, textTransform: "uppercase", letterSpacing: "0.3em",
      color: "var(--gold)", fontWeight: 700, marginBottom: 20,
    }}>{children}</motion.p>
  );
}

// ─── SLIDE WRAPPER ───
function SlideBase({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative w-full h-full overflow-hidden noise ${className}`}
      style={{ fontFamily: FONT, background: "var(--bg-0)" }}
    >{children}</div>
  );
}

// ─── DIAMOND FRAME (improved) ───
function DiamondFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative w-full h-full">
      <svg className="absolute z-10 pointer-events-none"
        style={{ top: "-6%", right: "-4%", width: "65%", height: "65%", opacity: 0.15 }}
        viewBox="0 0 200 200" fill="none"
      >
        <path d="M100 10L190 100L100 190L10 100Z" stroke="var(--gold)" strokeWidth="1.5" />
        <path d="M100 30L170 100L100 170L30 100Z" stroke="var(--gold)" strokeWidth="0.8" />
        <path d="M100 50L150 100L100 150L50 100Z" stroke="var(--gold)" strokeWidth="0.4" />
      </svg>
      <div className="absolute top-0 right-0 w-[3px] h-[40%] z-20" style={{
        background: "linear-gradient(to bottom, var(--gold), transparent)", opacity: 0.35,
      }} />
      <div className="absolute bottom-0 right-[18%] w-[3px] h-[25%] z-20" style={{
        background: "linear-gradient(to top, var(--gold-dark), transparent)", opacity: 0.2,
      }} />
      <div className="relative w-full h-full overflow-hidden rounded-sm">{children}</div>
    </div>
  );
}


// ════════════════════════════════════════════════════════════════
// SLIDE 1 — HERO CINEMATIC (fullscreen photo, text left)
// ════════════════════════════════════════════════════════════════
function Slide1() {
  return (
    <SlideBase>
      <div className="absolute inset-0">
        <Image src="/images/hero-bg.jpeg" alt="" fill className="object-cover" priority />
        <div className="absolute inset-0" style={{
          background: "linear-gradient(to right, rgba(0,0,0,0.93) 0%, rgba(0,0,0,0.75) 45%, rgba(0,0,0,0.35) 100%)"
        }} />
      </div>
      <GoldDust />
      <CornerAccent position="tl" />
      <CornerAccent position="br" />

      <motion.div className="relative z-10 flex flex-col justify-center h-full px-[8%] max-w-[65%]"
        variants={stagger} initial="hidden" animate="show"
      >
        {/* LOGOS — informação principal */}
        <motion.div variants={scaleReveal} className="flex items-center gap-6 mb-10" style={{
          filter: "drop-shadow(0 0 30px rgba(212,168,83,0.15))"
        }}>
          <Image src="/images/logo-rede-de-valor-branco-v2.png" alt="Rede de Valor" width={280} height={90} className="h-[72px] w-auto" />
          <span style={{ fontSize: 28, fontWeight: 200, color: "rgba(212,168,83,0.5)" }}>+</span>
          <Image src="/images/logo-time-v2.png" alt="TIME" width={200} height={65} className="h-[56px] w-auto" />
        </motion.div>

        <motion.div variants={fadeUp}
          className="self-start px-6 py-2.5 rounded-full mb-8 tracking-[0.25em] uppercase"
          style={{ border: "1px solid rgba(212,168,83,0.3)", color: "var(--gold)", background: "rgba(212,168,83,0.08)", fontWeight: 600, fontSize: 13 }}
        >
          Apresentação Comercial 2025
        </motion.div>

        <motion.h1 variants={fadeUp} style={{
          fontFamily: FONT, fontSize: TYPE.hero, fontWeight: 700,
          lineHeight: 1.05, color: "var(--text-primary)", letterSpacing: "-0.03em",
        }}>
          Um novo nível de<br />networking para quem quer{" "}
          <span className="text-gradient-gold-shine">crescer de verdade.</span>
        </motion.h1>

        <motion.p variants={fadeUp} style={{
          fontSize: TYPE.body, color: "var(--text-secondary)",
          marginTop: 28, maxWidth: 540, lineHeight: 1.7, fontWeight: 400,
        }}>
          A união da <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>Rede de Valor</span> com a{" "}
          <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>TIME Escola de Negócios</span> criou um ecossistema
          onde conexões geram oportunidades reais.
        </motion.p>

        <motion.div variants={fadeUp} className="flex items-center gap-12 mt-10 pt-8" style={{
          borderTop: "1px solid rgba(212,168,83,0.15)"
        }}>
          {[
            { n: "+500", l: "empresários conectados" },
            { n: "R$2M+", l: "em negócios gerados" },
            { n: "48h", l: "para primeira conexão" },
          ].map((s, i) => (
            <div key={i} className="flex flex-col">
              <span style={{ fontSize: 32, fontWeight: 700, color: "var(--gold)", lineHeight: 1 }}>{s.n}</span>
              <span style={{ fontSize: TYPE.statLabel, color: "var(--text-muted)", marginTop: 6 }}>{s.l}</span>
            </div>
          ))}
        </motion.div>
      </motion.div>

      <motion.div className="absolute bottom-8 right-8 z-10 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2, duration: 0.8 }}
      >
        <span style={{ color: "var(--text-muted)", fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase" }}>próximo</span>
        <motion.svg width="20" height="20" viewBox="0 0 20 20" fill="none"
          animate={{ y: [0, 6, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <path d="M4 7L10 13L16 7" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </motion.svg>
      </motion.div>
    </SlideBase>
  );
}

// ════════════════════════════════════════════════════════════════
// SLIDE 2 — REFLEXÃO (centered cinematic, no image — breathing slide)
// ════════════════════════════════════════════════════════════════
function Slide2() {
  return (
    <SlideBase>
      {/* Background image with heavy overlay */}
      <div className="absolute inset-0">
        <Image src="/images/slides/slide-networking.webp" alt="" fill className="object-cover" style={{ opacity: 0.15 }} />
        <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.85)" }} />
      </div>
      <div className="absolute inset-0" style={{
        background: "radial-gradient(ellipse 50% 50% at 50% 50%, rgba(212,168,83,0.06), transparent)"
      }} />

      {/* Diamond decoration behind */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <svg width="600" height="600" viewBox="0 0 600 600" fill="none" style={{ opacity: 0.05 }}>
          <path d="M300 30L570 300L300 570L30 300Z" stroke="var(--gold)" strokeWidth="1.5" />
          <path d="M300 90L510 300L300 510L90 300Z" stroke="var(--gold)" strokeWidth="1" />
        </svg>
      </div>

      <GoldDust />
      <CornerAccent position="tl" />
      <CornerAccent position="br" />

      <motion.div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-[10%]"
        variants={stagger} initial="hidden" animate="show"
      >
        {/* Decorative open quote */}
        <motion.svg variants={fadeIn} width="60" height="48" viewBox="0 0 60 48" fill="none" className="mb-8" style={{ opacity: 0.25 }}>
          <path d="M0 48V28.8C0 19.2 2.4 11.6 7.2 6C12 0.4 18.8 -2.13 27.6 -2.13V8.67C23.2 8.67 19.6 10.07 16.8 12.87C14 15.67 12.6 19.47 12.6 24.27H24V48H0ZM36 48V28.8C36 19.2 38.4 11.6 43.2 6C48 0.4 54.8 -2.13 63.6 -2.13V8.67C59.2 8.67 55.6 10.07 52.8 12.87C50 15.67 48.6 19.47 48.6 24.27H60V48H36Z" fill="var(--gold)" />
        </motion.svg>

        <motion.h2 variants={fadeUp} style={{
          fontFamily: FONT, fontSize: TYPE.hero, fontWeight: 700,
          color: "var(--text-primary)", lineHeight: 1.1, maxWidth: 900, letterSpacing: "-0.03em",
        }}>
          E se o <span style={{ color: "var(--gold)", fontWeight: 700 }}>networking</span> certo<br />
          pudesse mudar{" "}
          <span className="text-gradient-gold-shine">tudo?</span>
        </motion.h2>

        <motion.div variants={fadeUp} className="w-20 h-[2px] mt-8 mb-8" style={{ background: "var(--gold)", opacity: 0.4 }} />

        <motion.p variants={fadeUp} style={{
          fontSize: TYPE.bodyLg, color: "var(--text-secondary)",
          maxWidth: 700, lineHeight: 1.7,
        }}>
          Não estamos falando de trocar cartões. Estamos falando de construir
          pontes que geram negócios reais.
        </motion.p>
      </motion.div>
    </SlideBase>
  );
}

// ════════════════════════════════════════════════════════════════
// SLIDE 3 — PROBLEMA (split: text left + image right)
// ════════════════════════════════════════════════════════════════
function Slide3() {
  return (
    <SlideBase>
      <div className="absolute inset-0" style={{
        background: "radial-gradient(ellipse at 25% 50%, rgba(212,168,83,0.03), transparent 60%)"
      }} />

      <div className="flex items-center h-full">
        <motion.div className="w-[55%] flex flex-col justify-center px-[6%] relative z-10"
          variants={stagger} initial="hidden" animate="show"
        >
          <Label>O Problema</Label>

          <motion.h2 variants={fadeUp} style={{
            fontFamily: FONT, fontSize: TYPE.hero, fontWeight: 700,
            color: "var(--text-primary)", lineHeight: 1.05, letterSpacing: "-0.03em",
          }}>
            O networking<br />tradicional{" "}
            <span className="text-gradient-gold-shine">falhou.</span>
          </motion.h2>

          <motion.p variants={fadeUp} style={{
            fontSize: TYPE.body, color: "var(--text-secondary)",
            marginTop: 24, maxWidth: 460, lineHeight: 1.7,
          }}>
            Eventos genéricos, contatos que nunca respondem, grupos que não geram valor.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-10 grid grid-cols-3 gap-0">
            {[
              { n: "87%", l: "acham networking ineficiente" },
              { n: "3h", l: "desperdiçadas em eventos sem retorno" },
              { n: "92%", l: "dos cartões nunca viram negócio" },
            ].map((s, i) => (
              <div key={i} style={{
                padding: "18px 20px 18px 0",
                borderLeft: i > 0 ? "1px solid rgba(212,168,83,0.15)" : "none",
                paddingLeft: i > 0 ? 20 : 0,
              }}>
                <p style={{ fontSize: "clamp(2rem, 3.5vw, 2.8rem)", fontWeight: 700, color: "var(--gold)", lineHeight: 1 }}>{s.n}</p>
                <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 8, lineHeight: 1.4, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}>{s.l}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div className="w-[45%] h-full relative" variants={slideR} initial="hidden" animate="show">
          <DiamondFrame>
            <Image src="/images/slides/slide-problem.webp" alt="" fill className="object-cover" />
            <div className="absolute inset-0" style={{ background: "linear-gradient(to right, var(--bg-0) 0%, transparent 25%)" }} />
            <div className="absolute inset-0" style={{ background: "linear-gradient(to top, var(--bg-0) 0%, transparent 15%)" }} />
          </DiamondFrame>
        </motion.div>
      </div>
    </SlideBase>
  );
}

// ════════════════════════════════════════════════════════════════
// SLIDE 4 — DORES (fullscreen photo bg + bento grid overlay)
// ════════════════════════════════════════════════════════════════
function Slide4() {
  const pains = [
    { icon: "crowd", num: "01", title: "Eventos Genéricos", desc: "Centenas de pessoas, zero conexões que realmente importam para o seu negócio." },
    { icon: "cardOff", num: "02", title: "Contatos Frios", desc: "Trocou cartão, nunca mais responderam. Networking de fachada sem resultado." },
    { icon: "clock", num: "03", title: "Tempo Perdido", desc: "Horas investidas em almoços, cafés e eventos sem retorno mensurável." },
    { icon: "trendDown", num: "04", title: "Crescimento Travado", desc: "Oportunidades passam e o negócio estagna por falta de rede qualificada." },
  ];

  return (
    <SlideBase>
      <div className="absolute inset-0">
        <Image src="/images/slides/slide-dores.webp" alt="" fill className="object-cover" />
        <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.9)" }} />
      </div>
      {/* Radial glow top-left */}
      <div className="absolute inset-0" style={{
        background: "radial-gradient(ellipse at 20% 30%, rgba(212,168,83,0.04), transparent 50%)"
      }} />
      <CornerAccent position="tl" />
      <CornerAccent position="br" />

      <motion.div className="relative z-10 flex items-center h-full px-[5%] gap-[4%]"
        variants={stagger} initial="hidden" animate="show"
      >
        {/* Left — title area */}
        <div className="w-[38%] flex flex-col justify-center">
          <Label>As Dores</Label>
          <motion.h2 variants={fadeUp} style={{
            fontFamily: FONT, fontSize: TYPE.hero, fontWeight: 700,
            color: "var(--text-primary)", letterSpacing: "-0.03em", lineHeight: 1.05,
          }}>
            O problema<br />não é você,{" "}
            <span className="text-gradient-gold-shine">é o<br />ambiente.</span>
          </motion.h2>
          <motion.div variants={fadeUp} style={{ width: 60, height: 3, background: "var(--gold)", borderRadius: 2, marginTop: 28, opacity: 0.5 }} />
          <motion.p variants={fadeUp} style={{
            fontSize: TYPE.body, color: "var(--text-secondary)", lineHeight: 1.7, marginTop: 20, maxWidth: 360,
          }}>
            Enquanto você tenta crescer sozinho, as oportunidades certas estão passando.
          </motion.p>
        </div>

        {/* Right — bento cards */}
        <div className="w-[58%] grid grid-cols-2 gap-4">
          {pains.map((p, i) => (
            <motion.div key={i} variants={fadeUp}
              className="relative overflow-hidden rounded-2xl p-6 cursor-pointer group"
              style={{
                background: "linear-gradient(145deg, rgba(212,168,83,0.06) 0%, rgba(0,0,0,0.4) 100%)",
                border: "1px solid rgba(212,168,83,0.12)",
                backdropFilter: "blur(12px)",
                transition: "all 0.35s ease",
              }}
              whileHover={{
                borderColor: "rgba(212,168,83,0.3)",
                boxShadow: "0 0 30px rgba(212,168,83,0.08), inset 0 1px 0 rgba(212,168,83,0.1)",
                y: -3,
              }}
            >
              {/* Number watermark */}
              <span className="absolute top-3 right-4 select-none pointer-events-none" style={{
                fontSize: 64, fontWeight: 800, color: "rgba(212,168,83,0.04)", lineHeight: 1,
              }}>{p.num}</span>

              {/* Icon badge with glow */}
              <div style={{
                width: 44, height: 44, borderRadius: 10,
                background: "linear-gradient(135deg, rgba(212,168,83,0.15) 0%, rgba(212,168,83,0.05) 100%)",
                border: "1px solid rgba(212,168,83,0.2)",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 0 20px rgba(212,168,83,0.06)",
                marginBottom: 16,
              }}>
                <Icon name={p.icon} size={22} />
              </div>

              <h3 style={{ fontSize: 20, fontWeight: 700, color: "var(--gold)", marginBottom: 8 }}>{p.title}</h3>
              <p style={{ fontSize: 15, color: "var(--text-muted)", lineHeight: 1.6 }}>{p.desc}</p>

              {/* Bottom accent line */}
              <div className="absolute bottom-0 left-0 right-0 h-[2px]" style={{
                background: "linear-gradient(to right, transparent, rgba(212,168,83,0.15), transparent)",
              }} />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </SlideBase>
  );
}

// ════════════════════════════════════════════════════════════════
// SLIDE 5 — VIRADA (fullscreen photo background, text overlay left)
// ════════════════════════════════════════════════════════════════
function Slide5() {
  return (
    <SlideBase>
      <div className="absolute inset-0">
        <Image src="/images/slides/slide-virada.webp" alt="" fill className="object-cover" />
        <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.82)" }} />
      </div>
      <div className="absolute inset-0" style={{
        background: "radial-gradient(ellipse at 50% 40%, rgba(212,168,83,0.05), transparent 55%)"
      }} />
      <CornerAccent position="tl" />
      <CornerAccent position="br" />

      <motion.div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-[8%]"
        variants={stagger} initial="hidden" animate="show"
      >
        <Label>A Virada</Label>

        <motion.h2 variants={fadeUp} style={{
          fontFamily: FONT, fontSize: TYPE.hero, fontWeight: 700,
          color: "var(--text-primary)", lineHeight: 1.08, letterSpacing: "-0.03em",
          maxWidth: 900,
        }}>
          E se existisse um lugar onde{" "}
          <span style={{ color: "var(--gold)" }}>cada conexão</span><br />gera{" "}
          <span className="text-gradient-gold-shine">resultado?</span>
        </motion.h2>

        <motion.p variants={fadeUp} style={{
          fontSize: TYPE.bodyLg, color: "var(--text-secondary)",
          marginTop: 24, lineHeight: 1.7, maxWidth: 520,
        }}>
          Um ecossistema curado, com pessoas que realmente fazem acontecer.
        </motion.p>

        <motion.div variants={fadeUp} className="w-16 h-[2px] mt-8 mb-8" style={{ background: "var(--gold)", opacity: 0.35 }} />

        {/* 3 pillars — horizontal */}
        <motion.div variants={fadeUp} className="flex items-center gap-6">
          {[
            { icon: "target", text: "Curadoria rigorosa" },
            { icon: "star", text: "Encontros com propósito" },
            { icon: "link", text: "Conexões que viram contratos" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 px-5 py-3 rounded-xl" style={{
              background: "rgba(212,168,83,0.04)",
              border: "1px solid rgba(212,168,83,0.1)",
            }}>
              <Icon name={item.icon} size={18} />
              <span style={{ fontSize: 15, color: "var(--text-secondary)", fontWeight: 600, whiteSpace: "nowrap" }}>{item.text}</span>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </SlideBase>
  );
}

// ════════════════════════════════════════════════════════════════
// SLIDE 6 — SOLUÇÃO (split: text left + image right)
// ════════════════════════════════════════════════════════════════
function Slide6() {
  const features = [
    { icon: "target", title: "Curadoria", desc: "Cada membro é selecionado por critérios rigorosos de atuação e potencial." },
    { icon: "calendar", title: "Eventos Mensais", desc: "Encontros presenciais estratégicos com agenda focada em resultados." },
    { icon: "link", title: "Matchmaking", desc: "Conexões direcionadas entre membros com sinergia de negócios." },
  ];

  return (
    <SlideBase>
      {/* Background image with heavy overlay */}
      <div className="absolute inset-0">
        <Image src="/images/slides/slide-community.webp" alt="" fill className="object-cover" />
        <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.88)" }} />
      </div>
      <div className="absolute inset-0" style={{
        background: "radial-gradient(ellipse at 30% 40%, rgba(212,168,83,0.04), transparent 50%)"
      }} />
      <CornerAccent position="tl" />
      <CornerAccent position="br" />

      <motion.div className="relative z-10 flex flex-col items-center justify-center h-full px-[6%]"
        variants={stagger} initial="hidden" animate="show"
      >
        {/* Top section — title + description centered */}
        <div className="text-center mb-8">
          <Label>A Solução</Label>
          <motion.h2 variants={fadeUp} style={{
            fontFamily: FONT, fontSize: TYPE.main, fontWeight: 700,
            color: "var(--text-primary)", lineHeight: 1.05, letterSpacing: "-0.03em",
          }}>
            <span className="text-gradient-gold-shine">Rede de Valor</span>
          </motion.h2>
          <motion.p variants={fadeUp} style={{
            fontSize: TYPE.body, color: "var(--text-secondary)",
            lineHeight: 1.7, maxWidth: 520, marginTop: 14, marginLeft: "auto", marginRight: "auto",
          }}>
            Uma comunidade exclusiva onde cada membro foi selecionado
            por seu potencial de gerar valor real.
          </motion.p>
        </div>

        {/* Feature cards — 3 columns */}
        <div className="grid grid-cols-3 gap-5" style={{ maxWidth: 1100, width: "100%" }}>
          {features.map((item, i) => (
            <motion.div key={i} variants={fadeUp}
              className="relative overflow-hidden rounded-2xl p-6"
              style={{
                background: "linear-gradient(160deg, rgba(212,168,83,0.06) 0%, rgba(0,0,0,0.3) 100%)",
                border: "1px solid rgba(212,168,83,0.1)",
                backdropFilter: "blur(12px)",
              }}
              whileHover={{
                borderColor: "rgba(212,168,83,0.25)",
                boxShadow: "0 0 30px rgba(212,168,83,0.06)",
                y: -3,
              }}
            >
              <span className="absolute top-2 right-3 select-none pointer-events-none" style={{
                fontSize: 60, fontWeight: 800, color: "rgba(212,168,83,0.03)", lineHeight: 1,
              }}>0{i + 1}</span>

              <div style={{
                width: 44, height: 44, borderRadius: 10,
                background: "linear-gradient(135deg, rgba(212,168,83,0.15), rgba(212,168,83,0.04))",
                border: "1px solid rgba(212,168,83,0.2)",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 0 20px rgba(212,168,83,0.05)",
                marginBottom: 14,
              }}>
                <Icon name={item.icon} size={22} />
              </div>

              <h3 style={{ fontSize: 20, fontWeight: 700, color: "var(--gold)", marginBottom: 8 }}>{item.title}</h3>
              <p style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.6 }}>{item.desc}</p>

              <div className="absolute bottom-0 left-0 right-0 h-[2px]" style={{
                background: "linear-gradient(to right, transparent, rgba(212,168,83,0.12), transparent)",
              }} />
            </motion.div>
          ))}
        </div>

        {/* Bottom stats bar */}
        <motion.div variants={fadeUp} className="flex items-center justify-center gap-12 mt-8 pt-6" style={{
          borderTop: "1px solid rgba(212,168,83,0.08)", maxWidth: 1100, width: "100%",
        }}>
          {[
            { n: "+500", l: "membros ativos" },
            { n: "12", l: "eventos/ano" },
            { n: "R$2M+", l: "em negócios gerados" },
          ].map((s, i) => (
            <div key={i} className="flex items-center gap-3">
              <span style={{ fontSize: 26, fontWeight: 700, color: "var(--gold)" }}>{s.n}</span>
              <span style={{ fontSize: 12, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 500 }}>{s.l}</span>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </SlideBase>
  );
}

// ════════════════════════════════════════════════════════════════
// SLIDE 7 — PROPOSTA (two-column cards, no image — content-heavy)
// ════════════════════════════════════════════════════════════════
function Slide7() {
  return (
    <SlideBase>
      <div className="absolute inset-0" style={{
        background: "radial-gradient(ellipse at 50% 30%, rgba(212,168,83,0.04), transparent 60%)"
      }} />
      {/* Diamond decoration */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <svg width="500" height="500" viewBox="0 0 500 500" fill="none" style={{ opacity: 0.03 }}>
          <path d="M250 25L475 250L250 475L25 250Z" stroke="var(--gold)" strokeWidth="1.5" />
        </svg>
      </div>
      <CornerAccent position="tl" />
      <CornerAccent position="br" />

      <motion.div className="relative z-10 flex flex-col justify-center h-full px-[6%]"
        variants={stagger} initial="hidden" animate="show"
      >
        {/* Header centered */}
        <div className="text-center mb-12">
          <Label>Nossa Proposta</Label>
          <motion.h2 variants={fadeUp} style={{
            fontFamily: FONT, fontSize: TYPE.hero, fontWeight: 700,
            color: "var(--text-primary)", letterSpacing: "-0.03em",
          }}>
            Dois pilares.{" "}
            <span className="text-gradient-gold-shine">Um ecossistema.</span>
          </motion.h2>
        </div>

        {/* Two cards with + connector */}
        <div className="flex items-stretch justify-center gap-8" style={{ maxWidth: 1100, margin: "0 auto", width: "100%" }}>
          {/* Card Rede de Valor */}
          <motion.div variants={slideL} className="flex-1 relative overflow-hidden rounded-2xl"
            style={{
              background: "linear-gradient(160deg, rgba(212,168,83,0.08) 0%, rgba(0,0,0,0.4) 100%)",
              border: "1px solid rgba(212,168,83,0.15)",
              padding: "36px 32px",
            }}
          >
            <span className="absolute top-4 right-5 select-none pointer-events-none" style={{
              fontSize: 80, fontWeight: 800, color: "rgba(212,168,83,0.03)", lineHeight: 1,
            }}>RV</span>

            <div className="mb-8">
              <Image src="/images/logo-rede-de-valor-branco-v2.png" alt="Rede de Valor" width={180} height={60} className="h-12 w-auto opacity-90" />
            </div>

            <ul className="space-y-5">
              {[
                { icon: "star", text: "Eventos presenciais exclusivos" },
                { icon: "users", text: "Grupo curado de membros" },
                { icon: "target", text: "Conexões que geram negócios" },
              ].map((item, j) => (
                <li key={j} className="flex items-center gap-4">
                  <div style={{
                    width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                    background: "linear-gradient(135deg, rgba(212,168,83,0.12), rgba(212,168,83,0.03))",
                    border: "1px solid rgba(212,168,83,0.15)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <Icon name={item.icon} size={18} />
                  </div>
                  <span style={{ fontSize: 18, color: "var(--text-secondary)", lineHeight: 1.4, fontWeight: 500 }}>{item.text}</span>
                </li>
              ))}
            </ul>

            <div className="absolute bottom-0 left-0 right-0 h-[2px]" style={{
              background: "linear-gradient(to right, rgba(212,168,83,0.2), transparent)",
            }} />
          </motion.div>

          {/* Center connector */}
          <div className="flex items-center justify-center" style={{ width: 50 }}>
            <div className="flex flex-col items-center gap-3">
              <div style={{ width: 1, height: 60, background: "linear-gradient(to bottom, transparent, rgba(212,168,83,0.2))" }} />
              <span style={{ fontSize: 24, fontWeight: 300, color: "rgba(212,168,83,0.4)" }}>+</span>
              <div style={{ width: 1, height: 60, background: "linear-gradient(to top, transparent, rgba(212,168,83,0.2))" }} />
            </div>
          </div>

          {/* Card TIME */}
          <motion.div variants={slideR} className="flex-1 relative overflow-hidden rounded-2xl"
            style={{
              background: "linear-gradient(160deg, rgba(212,168,83,0.05) 0%, rgba(0,0,0,0.4) 100%)",
              border: "1px solid rgba(212,168,83,0.1)",
              padding: "36px 32px",
            }}
          >
            <span className="absolute top-4 right-5 select-none pointer-events-none" style={{
              fontSize: 80, fontWeight: 800, color: "rgba(212,168,83,0.03)", lineHeight: 1,
            }}>TM</span>

            <div className="mb-8">
              <Image src="/images/logo-time-v2.png" alt="TIME" width={160} height={55} className="h-12 w-auto opacity-90" />
            </div>

            <ul className="space-y-5">
              {[
                { icon: "compass", text: "Mentoria e direcionamento" },
                { icon: "link", text: "Matchmaking estratégico" },
                { icon: "shield", text: "Suporte contínuo ao membro" },
              ].map((item, j) => (
                <li key={j} className="flex items-center gap-4">
                  <div style={{
                    width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                    background: "linear-gradient(135deg, rgba(212,168,83,0.08), rgba(212,168,83,0.02))",
                    border: "1px solid rgba(212,168,83,0.1)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <Icon name={item.icon} size={18} color="var(--gold-light)" />
                  </div>
                  <span style={{ fontSize: 18, color: "var(--text-secondary)", lineHeight: 1.4, fontWeight: 500 }}>{item.text}</span>
                </li>
              ))}
            </ul>

            <div className="absolute bottom-0 left-0 right-0 h-[2px]" style={{
              background: "linear-gradient(to left, rgba(212,168,83,0.15), transparent)",
            }} />
          </motion.div>
        </div>

        {/* Bottom tagline */}
        <motion.p variants={fadeUp} className="text-center mt-10" style={{
          fontSize: 16, color: "var(--text-muted)", fontWeight: 500, letterSpacing: "0.05em",
        }}>
          Juntos, criam o ecossistema mais poderoso de networking do Brasil.
        </motion.p>
      </motion.div>
    </SlideBase>
  );
}

// ════════════════════════════════════════════════════════════════
// SLIDE 8 — MARCA REVEAL (cinematic centered)
// ════════════════════════════════════════════════════════════════
function Slide8() {
  return (
    <SlideBase>
      <div className="absolute inset-0" style={{
        background: "radial-gradient(circle at 50% 50%, rgba(212,168,83,0.08), transparent 55%)"
      }} />
      <GoldDust />

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <svg width="500" height="500" viewBox="0 0 400 400" fill="none" style={{ opacity: 0.12 }}>
          <path d="M200 20L380 200L200 380L20 200Z" stroke="var(--gold)" strokeWidth="1.5" />
          <path d="M200 60L340 200L200 340L60 200Z" stroke="var(--gold)" strokeWidth="1" />
          <path d="M200 100L300 200L200 300L100 200Z" stroke="var(--gold)" strokeWidth="0.5" />
        </svg>
      </div>

      <motion.div className="relative z-10 flex flex-col items-center justify-center h-full text-center"
        variants={stagger} initial="hidden" animate="show"
      >
        <motion.div variants={scaleReveal} className="mb-10">
          <Image src="/images/logo-rede-de-valor-branco-v2.png" alt="Rede de Valor" width={320} height={105} />
        </motion.div>
        <motion.div variants={fadeUp} className="mb-8" style={{ width: 70, height: 2, background: "var(--gold)", borderRadius: 1 }} />
        <motion.h2 variants={fadeUp} style={{
          fontFamily: FONT, fontSize: TYPE.center, fontWeight: 700,
          color: "var(--text-primary)", lineHeight: 1.15, letterSpacing: "-0.02em",
        }}>
          Onde <span style={{ color: "var(--gold)", fontWeight: 700 }}>conexões</span> se tornam<br />
          negócios reais.
        </motion.h2>
        <motion.p variants={fadeUp} style={{
          fontSize: TYPE.bodyLg, color: "var(--text-secondary)",
          marginTop: 24, maxWidth: 520, lineHeight: 1.7,
        }}>
          Mais que uma comunidade. Um ecossistema vivo de oportunidades.
        </motion.p>
        <motion.div variants={fadeIn} className="mt-10 flex items-center gap-4">
          <Image src="/images/logo-time-v2.png" alt="TIME" width={36} height={36} style={{ opacity: 0.8 }} />
          <span style={{ color: "var(--text-muted)", fontSize: 14, fontWeight: 500 }}>powered by TIME</span>
        </motion.div>
      </motion.div>
    </SlideBase>
  );
}

// ════════════════════════════════════════════════════════════════
// SLIDE 9 — ECOSSISTEMA (concentric rings + animated pulse)
// ════════════════════════════════════════════════════════════════
function Slide9() {
  return (
    <SlideBase>
      <div className="absolute inset-0" style={{
        background: "radial-gradient(circle at 60% 50%, rgba(212,168,83,0.06), transparent 50%)"
      }} />
      <GoldDust />

      <motion.div className="relative z-10 flex items-center justify-center h-full gap-[5%] px-[5%]"
        variants={stagger} initial="hidden" animate="show"
      >
        {/* Left text */}
        <div className="flex flex-col w-[38%]">
          <Label>O Ecossistema</Label>
          <motion.h2 variants={fadeUp} style={{
            fontFamily: FONT, fontSize: TYPE.main, fontWeight: 700,
            color: "var(--text-primary)", marginBottom: 24, letterSpacing: "-0.02em", lineHeight: 1.1,
          }}>
            Três camadas<br />de{" "}
            <span className="text-gradient-gold-shine">valor</span>
          </motion.h2>
          <motion.p variants={fadeUp} style={{
            fontSize: TYPE.body, color: "var(--text-secondary)", lineHeight: 1.7, maxWidth: 400,
          }}>
            Do acesso amplo ao inner circle exclusivo.
            Cada nível desbloqueia oportunidades maiores.
          </motion.p>
        </div>

        {/* Right rings — improved with connecting lines and icons */}
        <motion.div variants={scaleIn} className="relative" style={{ width: 480, height: 480 }}>
          {/* Radial glow behind */}
          <div className="absolute" style={{
            top: "50%", left: "50%", transform: "translate(-50%, -50%)",
            width: 300, height: 300, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(212,168,83,0.08) 0%, transparent 70%)",
          }} />

          {/* Outer ring */}
          <motion.div className="absolute rounded-full" style={{
            top: 0, left: 0, width: 480, height: 480,
            border: "1px solid rgba(212,168,83,0.12)",
            background: "radial-gradient(circle, transparent 60%, rgba(212,168,83,0.02) 100%)",
          }} animate={{ scale: [1, 1.015, 1] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} />
          <p className="absolute" style={{
            top: 16, left: "50%", transform: "translateX(-50%)",
            fontSize: 13, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.18em", whiteSpace: "nowrap", fontWeight: 600,
          }}>Comunidade Ampliada</p>
          {/* Outer ring small dots */}
          {[45, 135, 225, 315].map((deg, i) => (
            <motion.div key={`dot-o-${i}`} className="absolute rounded-full" style={{
              width: 5, height: 5, background: "rgba(212,168,83,0.2)",
              top: 240 + Math.sin(deg * Math.PI / 180) * 238,
              left: 240 + Math.cos(deg * Math.PI / 180) * 238,
              transform: "translate(-50%, -50%)",
            }} animate={{ opacity: [0.15, 0.5, 0.15] }} transition={{ duration: 3, repeat: Infinity, delay: i * 0.8 }} />
          ))}

          {/* Middle ring */}
          <motion.div className="absolute rounded-full" style={{
            top: 80, left: 80, width: 320, height: 320,
            border: "1.5px solid rgba(212,168,83,0.2)", background: "rgba(212,168,83,0.015)",
          }} animate={{ scale: [1, 1.02, 1] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }} />
          <p className="absolute" style={{
            top: 98, left: "50%", transform: "translateX(-50%)",
            fontSize: 13, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.18em", whiteSpace: "nowrap", fontWeight: 600,
          }}>Membros Ativos</p>

          {/* Inner ring — golden glow */}
          <motion.div className="absolute rounded-full" style={{
            top: 170, left: 170, width: 140, height: 140,
            border: "2px solid rgba(212,168,83,0.4)",
            background: "radial-gradient(circle, rgba(212,168,83,0.08) 0%, rgba(212,168,83,0.02) 100%)",
            boxShadow: "0 0 40px rgba(212,168,83,0.08), inset 0 0 30px rgba(212,168,83,0.04)",
          }} animate={{ scale: [1, 1.04, 1] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }} />
          <div className="absolute text-center" style={{ top: 200, left: 185, width: 110 }}>
            <Icon name="diamond" size={22} color="var(--gold)" />
            <p style={{ fontSize: 15, fontWeight: 700, color: "var(--gold)", lineHeight: 1.2, marginTop: 4 }}>Inner<br />Circle</p>
          </div>

          {/* Satellite labels with icons */}
          <div className="absolute flex items-center gap-2" style={{ top: 230, left: -100 }}>
            <Icon name="star" size={16} color="var(--gold-light)" />
            <p style={{ fontSize: 13, color: "var(--gold-light)", lineHeight: 1.3, fontWeight: 600 }}>Eventos<br />Exclusivos</p>
          </div>
          <div className="absolute flex items-center gap-2" style={{ top: 230, right: -110 }}>
            <p style={{ fontSize: 13, color: "var(--gold-light)", lineHeight: 1.3, fontWeight: 600, textAlign: "right" }}>Matchmaking<br />VIP</p>
            <Icon name="link" size={16} color="var(--gold-light)" />
          </div>
          <div className="absolute flex items-center gap-2" style={{ bottom: 30, left: "50%", transform: "translateX(-50%)" }}>
            <Icon name="users" size={16} color="var(--gold-light)" />
            <p style={{ fontSize: 13, color: "var(--gold-light)", whiteSpace: "nowrap", fontWeight: 600 }}>Networking Curado</p>
          </div>
        </motion.div>
      </motion.div>
    </SlideBase>
  );
}

// ════════════════════════════════════════════════════════════════
// SLIDE 10 — BENEFÍCIOS (fullscreen photo bg + grid overlay)
// ════════════════════════════════════════════════════════════════
function Slide10() {
  const benefits = [
    { icon: "target", t: "Networking Curado", d: "Membros selecionados por critérios rigorosos" },
    { icon: "brain", t: "Mentoria", d: "Acesso a mentores e especialistas do mercado" },
    { icon: "star", t: "Eventos Exclusivos", d: "Encontros mensais presenciais premium" },
    { icon: "book", t: "Conteúdo VIP", d: "Material exclusivo e insights de mercado" },
    { icon: "link", t: "Matchmaking", d: "Conexões estratégicas direcionadas por AI" },
    { icon: "briefcase", t: "Acesso Direto", d: "Contato direto com decisores de alto nível" },
  ];

  return (
    <SlideBase>
      <div className="absolute inset-0">
        <Image src="/images/benefits-bg.jpeg" alt="" fill className="object-cover" style={{ opacity: 0.15 }} />
        <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.88)" }} />
      </div>

      <motion.div className="relative z-10 flex flex-col justify-center h-full px-[6%]"
        variants={stagger} initial="hidden" animate="show"
      >
        <Label>Benefícios</Label>
        <motion.h2 variants={fadeUp} style={{
          fontFamily: FONT, fontSize: TYPE.main, fontWeight: 700,
          color: "var(--text-primary)", marginBottom: 36, letterSpacing: "-0.02em",
        }}>
          O que você{" "}
          <span className="text-gradient-gold-shine">recebe</span>
        </motion.h2>

        <div className="grid grid-cols-3 gap-5" style={{ maxWidth: 1050 }}>
          {benefits.map((b, i) => (
            <motion.div key={i} variants={fadeUp} className="card-premium p-6">
              <div style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(212,168,83,0.08)", border: "1px solid rgba(212,168,83,0.15)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
                <Icon name={b.icon} size={24} />
              </div>
              <h4 style={{ fontSize: TYPE.cardTitle, fontWeight: 700, color: "var(--text-primary)", marginBottom: 8 }}>{b.t}</h4>
              <p style={{ fontSize: TYPE.cardBody, color: "var(--text-muted)", lineHeight: 1.6 }}>{b.d}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </SlideBase>
  );
}

// ════════════════════════════════════════════════════════════════
// SLIDE 11 — IMPACTO (big editorial numbers, centered)
// ════════════════════════════════════════════════════════════════
function Slide11({ active }: { active: boolean }) {
  const c1 = useCounter(500, 1400, active);
  const c2 = useCounter(2, 800, active);
  const c3 = useCounter(48, 1200, active);

  const stats = [
    { v: `+${c1}`, l: "Conexões Estratégicas", icon: "users", desc: "empresários conectados gerando valor mútuo" },
    { v: `R$${c2}M+`, l: "Em Negócios Gerados", icon: "diamond", desc: "em contratos fechados entre membros" },
    { v: String(c3), l: "Eventos Realizados", icon: "calendar", desc: "encontros presenciais com resultado" },
  ];

  return (
    <SlideBase>
      {/* Background with photo + heavy overlay */}
      <div className="absolute inset-0">
        <Image src="/images/hero-bg.jpeg" alt="" fill className="object-cover" style={{ opacity: 0.08 }} />
        <div className="absolute inset-0" style={{
          background: "linear-gradient(160deg, #0a0a0a 0%, #000000 50%, rgba(212,168,83,0.03) 100%)"
        }} />
      </div>

      {/* Radial glow behind stats */}
      <div className="absolute inset-0" style={{
        background: "radial-gradient(ellipse 60% 50% at 50% 55%, rgba(212,168,83,0.06), transparent)"
      }} />

      {/* Diamond decoration */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <svg width="600" height="600" viewBox="0 0 600 600" fill="none" style={{ opacity: 0.03 }}>
          <path d="M300 30L570 300L300 570L30 300Z" stroke="var(--gold)" strokeWidth="1.5" />
          <path d="M300 90L510 300L300 510L90 300Z" stroke="var(--gold)" strokeWidth="0.8" />
        </svg>
      </div>

      <GoldDust />
      <CornerAccent position="tl" />
      <CornerAccent position="br" />

      <motion.div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-[6%]"
        variants={stagger} initial="hidden" animate="show"
      >
        <Label>O Impacto</Label>
        <motion.h2 variants={fadeUp} style={{
          fontFamily: FONT, fontSize: TYPE.hero, fontWeight: 700,
          color: "var(--text-primary)", marginBottom: 16, letterSpacing: "-0.03em",
        }}>
          Quanto vale o acesso às{" "}
          <span className="text-gradient-gold-shine">conexões certas</span>?
        </motion.h2>

        <motion.p variants={fadeUp} style={{
          fontSize: TYPE.body, color: "var(--text-muted)", marginBottom: 48, maxWidth: 480, lineHeight: 1.7,
        }}>
          Os números falam por si. Cada membro que entra na Rede de Valor
          faz um investimento com retorno real.
        </motion.p>

        {/* Stat cards — elevated design */}
        <div className="grid grid-cols-3 gap-5 w-full" style={{ maxWidth: 1000 }}>
          {stats.map((s, i) => (
            <motion.div key={i} variants={fadeUp}
              className="relative overflow-hidden rounded-2xl text-center py-10 px-6"
              style={{
                background: "linear-gradient(160deg, rgba(212,168,83,0.08) 0%, rgba(0,0,0,0.4) 100%)",
                border: "1px solid rgba(212,168,83,0.12)",
                backdropFilter: "blur(12px)",
              }}
              whileHover={{
                borderColor: "rgba(212,168,83,0.3)",
                boxShadow: "0 0 40px rgba(212,168,83,0.08)",
                y: -4,
              }}
            >
              {/* Background number watermark */}
              <span className="absolute top-2 right-4 select-none pointer-events-none" style={{
                fontSize: 80, fontWeight: 800, color: "rgba(212,168,83,0.03)", lineHeight: 1,
              }}>0{i + 1}</span>

              {/* Icon */}
              <div className="mx-auto mb-5" style={{
                width: 48, height: 48, borderRadius: 12,
                background: "linear-gradient(135deg, rgba(212,168,83,0.15), rgba(212,168,83,0.04))",
                border: "1px solid rgba(212,168,83,0.2)",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 0 25px rgba(212,168,83,0.06)",
              }}>
                <Icon name={s.icon} size={22} />
              </div>

              {/* Big number */}
              <p style={{
                fontSize: "clamp(2.4rem, 4.5vw, 3.5rem)", fontWeight: 700,
                color: "var(--gold)", lineHeight: 1, letterSpacing: "-0.03em",
              }}>{s.v}</p>

              {/* Label */}
              <p style={{
                fontSize: 14, color: "var(--gold-light)", marginTop: 10, fontWeight: 700,
                textTransform: "uppercase", letterSpacing: "0.12em",
              }}>{s.l}</p>

              {/* Description */}
              <p style={{
                fontSize: 13, color: "var(--text-muted)", marginTop: 8, lineHeight: 1.5,
              }}>{s.desc}</p>

              {/* Bottom accent */}
              <div className="absolute bottom-0 left-0 right-0 h-[2px]" style={{
                background: "linear-gradient(to right, transparent, rgba(212,168,83,0.2), transparent)",
              }} />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </SlideBase>
  );
}

// ════════════════════════════════════════════════════════════════
// SLIDE 12 — PREÇO (urgency card centered + bg photo)
// ════════════════════════════════════════════════════════════════
function Slide12() {
  return (
    <SlideBase>
      <div className="absolute inset-0">
        <Image src="/images/cta-bg.jpeg" alt="" fill className="object-cover" style={{ opacity: 0.15 }} />
        <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.88)" }} />
      </div>
      <div className="absolute inset-0" style={{
        background: "radial-gradient(ellipse at 50% 50%, rgba(212,168,83,0.1), transparent 50%)"
      }} />

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <svg width="500" height="500" viewBox="0 0 500 500" fill="none" style={{ opacity: 0.1 }}>
          <path d="M250 25L475 250L250 475L25 250Z" stroke="var(--gold)" strokeWidth="1.5" />
          <path d="M250 75L425 250L250 425L75 250Z" stroke="var(--gold)" strokeWidth="1" />
        </svg>
      </div>

      <motion.div className="relative z-10 flex flex-col items-center justify-center h-full"
        variants={stagger} initial="hidden" animate="show"
      >
        <motion.div variants={scaleIn} className="urgency-card px-14 py-16 text-center" style={{ maxWidth: 620 }}>
          <div className="urgency-shimmer" />
          <p style={{ fontSize: 16, color: "var(--text-muted)", marginBottom: 6 }}>Valor normal</p>
          <p style={{ fontSize: 24, color: "var(--text-muted)", marginBottom: 20, textDecoration: "line-through" }}>R$ 4.997</p>
          <p style={{ fontSize: 14, textTransform: "uppercase", letterSpacing: "0.2em", color: "var(--gold)", fontWeight: 700, marginBottom: 10 }}>Investimento Fundador</p>
          <p style={{ fontSize: "clamp(3.5rem, 7vw, 5rem)", fontWeight: 700, lineHeight: 1, letterSpacing: "-0.03em" }}>
            <span className="text-gradient-gold-shine">R$ 1.997</span>
          </p>
          <p style={{ fontSize: 18, color: "var(--text-secondary)", marginTop: 10 }}>por ano · acesso completo</p>
          <div style={{ width: 60, height: 1, background: "rgba(212,168,83,0.3)", margin: "24px auto" }} />
          <p style={{ fontSize: 16, color: "var(--text-muted)", lineHeight: 1.7, maxWidth: 400, margin: "0 auto" }}>
            Todos os eventos · Matchmaking VIP · Mentoria · Grupo exclusivo
          </p>
        </motion.div>
      </motion.div>
    </SlideBase>
  );
}

// ════════════════════════════════════════════════════════════════
// SLIDE 13 — URGÊNCIA (centered layout, counter as hero)
// ════════════════════════════════════════════════════════════════
function Slide13() {
  const filled = 27;
  const total = 50;
  const remaining = total - filled;

  return (
    <SlideBase>
      <div className="absolute inset-0">
        <Image src="/images/cta-bg.jpeg" alt="" fill className="object-cover" />
        <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.9)" }} />
      </div>
      {/* Radial glow centered on counter hero */}
      <div className="absolute inset-0" style={{
        background: "radial-gradient(ellipse 60% 50% at 50% 42%, rgba(212,168,83,0.07), transparent)"
      }} />
      <CornerAccent position="tl" />
      <CornerAccent position="br" />

      <motion.div className="relative z-10 flex flex-col items-center justify-center h-full px-[6%] text-center"
        variants={stagger} initial="hidden" animate="show"
      >
        {/* Label */}
        <motion.div variants={fadeUp}>
          <Label>Urgência</Label>
        </motion.div>

        {/* Title — max 3 lines */}
        <motion.h2 variants={fadeUp} style={{
          fontFamily: FONT, fontSize: TYPE.center, fontWeight: 700,
          color: "var(--text-primary)", lineHeight: 1.15, marginBottom: 12, letterSpacing: "-0.02em",
          maxWidth: 600,
        }}>
          Essa condição tem{" "}
          <span className="text-gradient-gold-shine">prazo.</span>
        </motion.h2>

        <motion.p variants={fadeUp} style={{
          fontSize: TYPE.body, color: "var(--text-secondary)", lineHeight: 1.6, maxWidth: 500, marginBottom: 36,
        }}>
          As vagas de fundador são limitadas. Quem entra agora garante a melhor condição — para sempre.
        </motion.p>

        {/* Hero counter card — centered */}
        <motion.div variants={scaleIn} className="relative mb-10">
          {/* Pulsing glow behind card */}
          <motion.div className="absolute rounded-3xl" style={{
            inset: -30, background: "radial-gradient(circle, rgba(212,168,83,0.12), transparent 70%)",
          }} animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} />

          <div className="relative text-center rounded-2xl overflow-hidden" style={{
            background: "linear-gradient(160deg, rgba(212,168,83,0.1) 0%, rgba(0,0,0,0.5) 100%)",
            border: "1px solid rgba(212,168,83,0.25)",
            padding: "40px 64px",
            minWidth: 320,
            boxShadow: "0 0 80px rgba(212,168,83,0.08), inset 0 1px 0 rgba(212,168,83,0.1)",
          }}>
            {/* Top shimmer line */}
            <div className="absolute top-0 left-0 right-0 h-[1px]" style={{
              background: "linear-gradient(to right, transparent, rgba(212,168,83,0.4), transparent)",
            }} />

            <p style={{
              fontSize: 13, color: "var(--gold)", textTransform: "uppercase",
              letterSpacing: "0.25em", fontWeight: 700, marginBottom: 8,
            }}>Restam apenas</p>

            {/* Big number */}
            <p style={{
              fontSize: "clamp(5rem, 10vw, 7.5rem)", fontWeight: 700,
              lineHeight: 1, letterSpacing: "-0.04em",
              background: "linear-gradient(180deg, var(--gold-light) 0%, var(--gold) 50%, var(--gold-dark) 100%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              filter: "drop-shadow(0 0 30px rgba(212,168,83,0.25))",
            }}>{remaining}</p>

            <p style={{
              fontSize: 18, color: "var(--text-secondary)", marginTop: 8, fontWeight: 500,
            }}>vagas de fundador</p>

            {/* Scarcity progress bar */}
            <div className="mt-7 mx-auto" style={{ maxWidth: 240 }}>
              <div className="flex justify-between mb-2">
                <span style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Preenchidas</span>
                <span style={{ fontSize: 11, color: "var(--gold)", fontWeight: 700 }}>{filled}/{total}</span>
              </div>
              <div className="relative rounded-full overflow-hidden" style={{
                height: 6, background: "rgba(255,255,255,0.06)",
              }}>
                <motion.div className="absolute top-0 left-0 h-full rounded-full" style={{
                  background: "linear-gradient(to right, var(--gold-dark), var(--gold), var(--gold-light))",
                  boxShadow: "0 0 12px rgba(212,168,83,0.4)",
                }}
                  initial={{ width: 0 }}
                  animate={{ width: `${(filled / total) * 100}%` }}
                  transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
                />
              </div>
            </div>

            {/* Bottom accent */}
            <div className="absolute bottom-0 left-0 right-0 h-[2px]" style={{
              background: "linear-gradient(to right, transparent, rgba(212,168,83,0.3), transparent)",
            }} />
          </div>
        </motion.div>

        {/* Bullets — horizontal row below counter */}
        <motion.div variants={fadeUp} className="flex items-center justify-center gap-8 flex-wrap">
          {[
            { icon: "shield", text: "Apenas 50 vagas" },
            { icon: "star", text: "Condição única" },
            { icon: "diamond", text: "Preço vitalício" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <div style={{
                width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                background: "linear-gradient(135deg, rgba(212,168,83,0.12), rgba(212,168,83,0.03))",
                border: "1px solid rgba(212,168,83,0.15)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Icon name={item.icon} size={16} />
              </div>
              <span style={{ fontSize: 15, color: "var(--text-primary)", fontWeight: 600 }}>{item.text}</span>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </SlideBase>
  );
}

// ════════════════════════════════════════════════════════════════
// SLIDE 14 — DECISÃO (comparison split + bg photo)
// ════════════════════════════════════════════════════════════════
function Slide14() {
  const withoutItems = [
    "Networking aleatório sem direção",
    "Horas em eventos genéricos",
    "Contatos que nunca respondem",
    "Crescimento lento e isolado",
    "Oportunidades que passam",
  ];
  const withItems = [
    "Conexões curadas e estratégicas",
    "Eventos exclusivos de alto nível",
    "Matchmaking que gera negócios",
    "Crescimento acelerado pela rede",
    "Oportunidades que chegam até você",
  ];

  return (
    <SlideBase>
      <div className="absolute inset-0">
        <Image src="/images/testimonials-bg.jpeg" alt="" fill className="object-cover" style={{ opacity: 0.1 }} />
        <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.92)" }} />
      </div>
      {/* Subtle glow behind "Com" card */}
      <div className="absolute inset-0" style={{
        background: "radial-gradient(ellipse 35% 50% at 72% 60%, rgba(212,168,83,0.06), transparent)"
      }} />
      {/* Diamond decoration */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <svg width="500" height="500" viewBox="0 0 500 500" fill="none" style={{ opacity: 0.03 }}>
          <path d="M250 25L475 250L250 475L25 250Z" stroke="var(--gold)" strokeWidth="1.5" />
        </svg>
      </div>
      <CornerAccent position="tl" />
      <CornerAccent position="br" />

      <motion.div className="relative z-10 flex flex-col justify-center h-full px-[6%]"
        variants={stagger} initial="hidden" animate="show"
      >
        <div className="text-center mb-10">
          <Label>Sua Decisão</Label>
          <motion.h2 variants={fadeUp} style={{
            fontFamily: FONT, fontSize: TYPE.center, fontWeight: 700,
            color: "var(--text-primary)", letterSpacing: "-0.02em",
          }}>
            Dois caminhos.{" "}
            <span className="text-gradient-gold-shine">Um resultado.</span>
          </motion.h2>
        </div>

        <div className="flex items-stretch justify-center gap-0 mx-auto" style={{ maxWidth: 1050 }}>
          {/* "Sem" card — deliberately muted/depressed */}
          <motion.div variants={slideL} className="flex-1 p-8 rounded-l-2xl relative overflow-hidden" style={{
            background: "linear-gradient(145deg, rgba(15,15,15,0.95), rgba(20,20,20,0.9))",
            border: "1px solid rgba(255,255,255,0.04)",
            borderRight: "none",
          }}>
            {/* Faded watermark */}
            <span className="absolute top-3 right-4 select-none pointer-events-none" style={{
              fontSize: 72, fontWeight: 800, color: "rgba(255,255,255,0.015)", lineHeight: 1,
            }}>X</span>

            <div className="flex items-center gap-3 mb-6">
              <div style={{
                width: 36, height: 36, borderRadius: 8,
                background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M4 4L12 12M12 4L4 12" stroke="rgba(255,255,255,0.25)" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <p style={{ fontSize: 15, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.2em" }}>Sem a Rede</p>
            </div>

            <ul className="space-y-4">
              {withoutItems.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="flex-shrink-0 mt-0.5">
                    <path d="M5 5L13 13M13 5L5 13" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  <span style={{ fontSize: 16, color: "rgba(255,255,255,0.35)", lineHeight: 1.5 }}>{item}</span>
                </li>
              ))}
            </ul>

            {/* Strikethrough overlay effect */}
            <div className="absolute inset-0 pointer-events-none" style={{
              background: "linear-gradient(135deg, transparent 40%, rgba(0,0,0,0.3) 100%)",
            }} />
          </motion.div>

          {/* Center divider with "vs" */}
          <div className="relative z-20 flex items-center" style={{ width: 0 }}>
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2" style={{
              width: 44, height: 44, borderRadius: "50%",
              background: "var(--bg-0)", border: "2px solid rgba(212,168,83,0.3)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 0 20px rgba(0,0,0,0.5)",
              zIndex: 30,
            }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: "var(--gold)", letterSpacing: "0.05em" }}>VS</span>
            </div>
          </div>

          {/* "Com" card — elevated, premium, glowing */}
          <motion.div variants={slideR} className="flex-1 p-8 rounded-r-2xl relative overflow-hidden" style={{
            background: "linear-gradient(160deg, rgba(212,168,83,0.08) 0%, rgba(212,168,83,0.02) 100%)",
            border: "1px solid rgba(212,168,83,0.2)",
            boxShadow: "0 0 50px rgba(212,168,83,0.06), inset 0 1px 0 rgba(212,168,83,0.15)",
          }}>
            {/* Gold shimmer top */}
            <div className="absolute top-0 left-0 right-0 h-[1px]" style={{
              background: "linear-gradient(to right, transparent, rgba(212,168,83,0.4), transparent)",
            }} />

            {/* Watermark */}
            <span className="absolute top-3 right-4 select-none pointer-events-none" style={{
              fontSize: 72, fontWeight: 800, color: "rgba(212,168,83,0.03)", lineHeight: 1,
            }}>RV</span>

            <div className="flex items-center gap-3 mb-6">
              <div style={{
                width: 36, height: 36, borderRadius: 8,
                background: "linear-gradient(135deg, rgba(212,168,83,0.15), rgba(212,168,83,0.05))",
                border: "1px solid rgba(212,168,83,0.2)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Icon name="diamond" size={16} />
              </div>
              <p style={{ fontSize: 15, fontWeight: 700, color: "var(--gold)", textTransform: "uppercase", letterSpacing: "0.2em" }}>Com a Rede de Valor</p>
            </div>

            <ul className="space-y-4">
              {withItems.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="flex-shrink-0 mt-0.5">
                    <circle cx="10" cy="10" r="9" stroke="rgba(212,168,83,0.2)" strokeWidth="1"/>
                    <path d="M6 10L9 13L14 7" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span style={{ fontSize: 16, color: "var(--text-secondary)", lineHeight: 1.5, fontWeight: 500 }}>{item}</span>
                </li>
              ))}
            </ul>

            {/* Bottom accent */}
            <div className="absolute bottom-0 left-0 right-0 h-[2px]" style={{
              background: "linear-gradient(to right, transparent, rgba(212,168,83,0.25), transparent)",
            }} />
          </motion.div>
        </div>

        {/* Bottom CTA hint */}
        <motion.p variants={fadeUp} className="text-center mt-8" style={{
          fontSize: 15, color: "var(--text-muted)", fontWeight: 500,
        }}>
          A escolha é simples. O resultado,{" "}
          <span style={{ color: "var(--gold)", fontWeight: 600 }}>extraordinário.</span>
        </motion.p>
      </motion.div>
    </SlideBase>
  );
}

// ════════════════════════════════════════════════════════════════
// SLIDE 15 — CTA FINAL (photo + diamond + button)
// ════════════════════════════════════════════════════════════════
function Slide15() {
  return (
    <SlideBase>
      <div className="absolute inset-0">
        <Image src="/images/cta-bg.jpeg" alt="" fill className="object-cover" />
        <div className="absolute inset-0" style={{
          background: "linear-gradient(to top, rgba(0,0,0,0.95) 20%, rgba(0,0,0,0.6) 60%, rgba(0,0,0,0.75) 100%)"
        }} />
      </div>

      {/* Radial gold glow — dramatic center */}
      <div className="absolute inset-0" style={{
        background: "radial-gradient(ellipse 45% 40% at 50% 40%, rgba(212,168,83,0.1), transparent)"
      }} />

      <GoldDust />

      {/* Diamond frame — bigger, 3 layers */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <svg width="500" height="500" viewBox="0 0 500 500" fill="none" style={{ opacity: 0.08 }}>
          <path d="M250 15L485 250L250 485L15 250Z" stroke="var(--gold)" strokeWidth="1.5" />
          <path d="M250 55L445 250L250 445L55 250Z" stroke="var(--gold)" strokeWidth="1" />
          <path d="M250 95L405 250L250 405L95 250Z" stroke="var(--gold)" strokeWidth="0.5" />
        </svg>
      </div>

      <CornerAccent position="tl" />
      <CornerAccent position="tr" />
      <CornerAccent position="bl" />
      <CornerAccent position="br" />

      <motion.div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-[6%]"
        variants={stagger} initial="hidden" animate="show"
      >
        {/* Logo with glow */}
        <motion.div variants={scaleReveal} className="mb-6 relative">
          <div className="absolute inset-0" style={{
            filter: "blur(40px)", background: "rgba(212,168,83,0.12)",
            transform: "scale(2)", borderRadius: "50%",
          }} />
          <Image src="/images/logo-rede-de-valor-branco-v2.png" alt="Rede de Valor" width={280} height={90} className="relative" />
        </motion.div>

        {/* Separator */}
        <motion.div variants={fadeUp} style={{ width: 60, height: 2, background: "var(--gold)", borderRadius: 1, marginBottom: 24, opacity: 0.4 }} />

        <motion.h2 variants={fadeUp} style={{
          fontFamily: FONT, fontSize: TYPE.center, fontWeight: 700,
          color: "var(--text-primary)", lineHeight: 1.1, maxWidth: 700, letterSpacing: "-0.02em",
        }}>
          O próximo nível do seu negócio<br />
          começa com a{" "}
          <span className="text-gradient-gold-shine">conexão certa.</span>
        </motion.h2>

        <motion.p variants={fadeUp} style={{
          fontSize: TYPE.bodyLg, color: "var(--text-secondary)",
          marginTop: 20, maxWidth: 480, lineHeight: 1.7,
        }}>
          Garanta sua vaga de fundador. Fale com nosso time.
        </motion.p>

        {/* CTA button with WhatsApp icon */}
        <motion.div variants={fadeUp} className="mt-10">
          <motion.a
            href="https://wa.me/5500000000000?text=Quero%20saber%20mais%20sobre%20a%20Rede%20de%20Valor"
            target="_blank" rel="noopener noreferrer"
            className="btn-hero-cta inline-flex items-center gap-3"
            style={{ fontFamily: FONT, fontSize: 18, padding: "20px 52px" }}
            whileHover={{ scale: 1.03, boxShadow: "0 0 40px rgba(212,168,83,0.25)" }}
            whileTap={{ scale: 0.98 }}
          >
            {/* WhatsApp icon */}
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            QUERO FAZER PARTE
          </motion.a>
        </motion.div>

        {/* Social proof bar */}
        <motion.div variants={fadeUp} className="mt-10 flex items-center gap-8">
          {[
            { n: "+500", l: "membros" },
            { n: "R$2M+", l: "gerados" },
            { n: "48", l: "eventos" },
          ].map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <span style={{ fontSize: 18, fontWeight: 700, color: "var(--gold)" }}>{s.n}</span>
              <span style={{ fontSize: 12, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>{s.l}</span>
            </div>
          ))}
        </motion.div>

        {/* Powered by */}
        <motion.div variants={fadeIn} className="mt-6 flex items-center gap-3" style={{ opacity: 0.6 }}>
          <Image src="/images/logo-time-v2.png" alt="TIME" width={28} height={28} />
          <span style={{ color: "var(--text-muted)", fontSize: 13, fontWeight: 500 }}>powered by TIME</span>
        </motion.div>
      </motion.div>
    </SlideBase>
  );
}

// ════════════════════════════════════════════════════════════════
// SLIDE MAP
// ════════════════════════════════════════════════════════════════
const SLIDES: Record<number, React.FC<{ active: boolean }>> = {
  0: () => <Slide1 />,
  1: () => <Slide2 />,
  2: () => <Slide3 />,
  3: () => <Slide4 />,
  4: () => <Slide5 />,
  5: () => <Slide6 />,
  6: () => <Slide7 />,
  7: () => <Slide8 />,
  8: () => <Slide9 />,
  9: () => <Slide10 />,
  10: ({ active }) => <Slide11 active={active} />,
  11: () => <Slide12 />,
  12: () => <Slide13 />,
  13: () => <Slide14 />,
  14: () => <Slide15 />,
};

// ════════════════════════════════════════════════════════════════
// MAIN — APRESENTAÇÃO
// ════════════════════════════════════════════════════════════════
export default function Apresentacao() {
  const [slide, setSlide] = useState(0);
  const [, setDir] = useState(1);
  const touchRef = useRef<number | null>(null);
  const slideRef = useRef(slide);
  slideRef.current = slide;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        if (slideRef.current < TOTAL - 1) { setDir(1); setSlide(s => s + 1); }
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        if (slideRef.current > 0) { setDir(-1); setSlide(s => s - 1); }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const go = (n: number) => { setDir(n > slide ? 1 : -1); setSlide(n); };
  const next = () => { if (slide < TOTAL - 1) { setDir(1); setSlide(s => s + 1); } };
  const prev = () => { if (slide > 0) { setDir(-1); setSlide(s => s - 1); } };

  const onTouchStart = (e: React.TouchEvent) => { touchRef.current = e.touches[0].clientX; };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchRef.current === null) return;
    const diff = touchRef.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) { diff > 0 ? next() : prev(); }
    touchRef.current = null;
  };

  const CurrentSlide = SLIDES[slide];

  return (
    <div className="relative w-screen h-screen overflow-hidden select-none"
      style={{ background: "var(--bg-0)", fontFamily: FONT }}
      onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}
    >
      <AnimatePresence mode="sync" initial={false}>
        <motion.div key={slide} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: "easeInOut" }} className="absolute inset-0"
        >
          <CurrentSlide active={true} />
        </motion.div>
      </AnimatePresence>

      {slide > 0 && (
        <button onClick={prev}
          className="absolute left-5 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(8px)" }}
          aria-label="Slide anterior"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 3L5 8L10 13" stroke="var(--text-secondary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}

      {slide < TOTAL - 1 && (
        <button onClick={next}
          className="absolute right-5 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(8px)" }}
          aria-label="Próximo slide"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M6 3L11 8L6 13" stroke="var(--text-secondary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}

      <div className="absolute bottom-0 left-0 right-0 z-30">
        <div className="w-full h-[2px]" style={{ background: "rgba(255,255,255,0.03)" }}>
          <motion.div className="h-full" style={{ background: "var(--gold)" }}
            animate={{ width: `${((slide + 1) / TOTAL) * 100}%` }} transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>
        <div className="flex items-center justify-center gap-2 py-4"
          style={{ background: "linear-gradient(to top, rgba(0,0,0,0.6), transparent)" }}
        >
          {Array.from({ length: TOTAL }).map((_, i) => (
            <button key={i} onClick={() => go(i)}
              className="transition-all duration-300 cursor-pointer"
              style={{ width: i === slide ? 24 : 6, height: 6, borderRadius: 3, background: i === slide ? "var(--gold)" : "rgba(255,255,255,0.15)" }}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
          <span className="ml-4" style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 500 }}>
            {String(slide + 1).padStart(2, "0")}/{TOTAL}
          </span>
        </div>
      </div>
    </div>
  );
}
