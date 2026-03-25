"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

// ─── CONSTANTS ───
const TOTAL = 17;
const FONT = "var(--font-jakarta), 'Plus Jakarta Sans', system-ui, sans-serif";

// ─── COLOR PALETTE — TIME (Purple / Cyan) ───
const C = {
  accent: "#A855F7",
  accentLight: "#C084FC",
  accentDark: "#8B5CF6",
  accentDeep: "#7C3AED",
  cyan: "#06B6D4",
  cyanLight: "#22D3EE",
  bg0: "#030303",
  textPrimary: "#f5f0e8",
  textSecondary: "#9a9185",
  textMuted: "#8a8278",
  accentSoft: "rgba(168, 85, 247, 0.08)",
  accentGlow: "rgba(168, 85, 247, 0.15)",
  borderCard: "rgba(168, 85, 247, 0.1)",
  borderHover: "rgba(168, 85, 247, 0.3)",
};

// ─── TYPE SCALES ───
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

// ─── GRADIENT TEXT STYLE (purple) ───
const gradientTextPurple: React.CSSProperties = {
  background: `linear-gradient(135deg, ${C.accentLight}, ${C.accent}, ${C.accentDark})`,
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
};

const gradientTextShine: React.CSSProperties = {
  background: `linear-gradient(135deg, ${C.accentDark} 0%, ${C.accentLight} 30%, #e8d5ff 50%, ${C.accentLight} 70%, ${C.accentDark} 100%)`,
  backgroundSize: "200% auto",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
  animation: "purpleShine 4s ease-in-out infinite",
};

const gradientTextCyan: React.CSSProperties = {
  background: `linear-gradient(135deg, ${C.cyan}, ${C.cyanLight}, ${C.accent})`,
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
};

// ─── DECORATIVE: PURPLE PARTICLES ───
function PurpleDust() {
  const dots = [
    { x: "10%", y: "15%", s: 3, d: 0 }, { x: "88%", y: "20%", s: 2, d: 1 },
    { x: "5%", y: "75%", s: 3, d: 2 }, { x: "93%", y: "68%", s: 2, d: 0.5 },
    { x: "50%", y: "6%", s: 2, d: 2.8 }, { x: "70%", y: "90%", s: 3, d: 1.5 },
  ];
  return (
    <>
      {dots.map((p, i) => (
        <motion.div key={i} className="absolute rounded-full pointer-events-none"
          style={{ left: p.x, top: p.y, width: p.s, height: p.s, background: C.accent }}
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
        <path d="M0 0L40 0" stroke={C.accent} strokeWidth="1" opacity="0.3" />
        <path d="M0 0L0 40" stroke={C.accent} strokeWidth="1" opacity="0.3" />
      </svg>
    </div>
  );
}

// ─── ICON COMPONENT ───
function Icon({ name, size = 28, color = C.accent }: { name: string; size?: number; color?: string }) {
  const icons: Record<string, React.ReactNode> = {
    users: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
        <path d="M22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
      </svg>
    ),
    star: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    ),
    target: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
      </svg>
    ),
    rocket: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 00-2.91-.09z"/>
        <path d="M12 15l-3-3a22 22 0 012-3.95A12.88 12.88 0 0122 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 01-4 2z"/>
        <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 3 0 3 0M12 15v5s3.03-.55 4-2c1.08-1.62 0-3 0-3"/>
      </svg>
    ),
    book: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
        <path d="M8 7h8M8 11h6"/>
      </svg>
    ),
    briefcase: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/>
        <path d="M12 12v.01"/>
      </svg>
    ),
    shield: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/>
      </svg>
    ),
    heart: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
      </svg>
    ),
    compass: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>
      </svg>
    ),
    mic: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/>
        <path d="M19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8"/>
      </svg>
    ),
    radio: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="2"/><path d="M16.24 7.76a6 6 0 010 8.49m-8.48-.01a6 6 0 010-8.49m11.31-2.82a10 10 0 010 14.14m-14.14 0a10 10 0 010-14.14"/>
      </svg>
    ),
    calendar: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
      </svg>
    ),
    globe: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
      </svg>
    ),
    handshake: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 11H4a2 2 0 00-2 2v1a2 2 0 002 2h2l3 3 3-3h2l3 3 3-3h0a2 2 0 002-2v-1a2 2 0 00-2-2z"/>
        <path d="M7 11V7a2 2 0 012-2h6a2 2 0 012 2v4"/>
      </svg>
    ),
    play: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke="none">
        <path d="M8 5v14l11-7z"/>
      </svg>
    ),
    brain: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a5 5 0 015 5c0 1.3-.5 2.4-1.3 3.3A5 5 0 0119 15a5 5 0 01-3 4.6V22h-4v-2.4A5 5 0 019 15a5 5 0 013.3-4.7A5 5 0 0112 2z"/>
        <path d="M12 2a5 5 0 00-5 5c0 1.3.5 2.4 1.3 3.3"/>
      </svg>
    ),
    trending: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
      </svg>
    ),
    award: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>
      </svg>
    ),
    cross: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v20M9 2h6v5H9zM4 9h16v3H4z"/>
      </svg>
    ),
    autism: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a3 3 0 00-3 3v1a3 3 0 006 0V5a3 3 0 00-3-3z"/>
        <path d="M19 13a7 7 0 01-14 0"/>
        <path d="M9 17l-2 4M15 17l2 4"/>
        <circle cx="9" cy="10" r="1" fill={color} stroke="none"/>
        <circle cx="15" cy="10" r="1" fill={color} stroke="none"/>
        <path d="M4.5 8.5C3 7 3 4 5 3M19.5 8.5C21 7 21 4 19 3"/>
        <path d="M8 2c1-1 3-1 4 0M12 2c1-1 3-1 4 0"/>
      </svg>
    ),
    puzzle: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 17V7a2 2 0 00-2-2h-3a2 2 0 01-2-2 2 2 0 00-2 2H8a2 2 0 00-2 2v3a2 2 0 01-2 2 2 2 0 002 2v3a2 2 0 002 2h3a2 2 0 012 2 2 2 0 002-2h3a2 2 0 002-2z"/>
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
      color: C.accent, fontWeight: 700, marginBottom: 20,
    }}>{children}</motion.p>
  );
}

// ─── SLIDE WRAPPER ───
function SlideBase({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative w-full h-full overflow-hidden noise ${className}`}
      style={{ fontFamily: FONT, background: C.bg0 }}
    >{children}</div>
  );
}

// ─── KEYFRAMES (injected once) ───
function StyleInjector() {
  return (
    <style dangerouslySetInnerHTML={{ __html: `
      @keyframes purpleShine {
        0%, 100% { background-position: 0% center; }
        50% { background-position: 200% center; }
      }
    `}} />
  );
}


// ════════════════════════════════════════════════════════════════
// SLIDE 1 — ABERTURA
// ════════════════════════════════════════════════════════════════
function Slide1() {
  return (
    <SlideBase>
      <StyleInjector />
      {/* Background gradient */}
      <div className="absolute inset-0" style={{
        background: `radial-gradient(ellipse at 50% 40%, rgba(168,85,247,0.08), transparent 60%), radial-gradient(ellipse at 80% 80%, rgba(6,182,212,0.05), transparent 50%)`
      }} />

      {/* Hourglass decoration */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <svg width="500" height="500" viewBox="0 0 500 500" fill="none" style={{ opacity: 0.04 }}>
          <path d="M150 50h200v100L250 250 150 150V50z" stroke={C.accent} strokeWidth="1.5"/>
          <path d="M150 450h200V350L250 250 150 350v100z" stroke={C.cyan} strokeWidth="1.5"/>
          <ellipse cx="250" cy="50" rx="100" ry="10" stroke={C.accent} strokeWidth="1"/>
          <ellipse cx="250" cy="450" rx="100" ry="10" stroke={C.cyan} strokeWidth="1"/>
        </svg>
      </div>

      <PurpleDust />
      <CornerAccent position="tl" />
      <CornerAccent position="br" />

      <motion.div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-[8%]"
        variants={stagger} initial="hidden" animate="show"
      >
        {/* Logo */}
        <motion.div variants={scaleReveal} className="mb-10 relative">
          <div className="absolute inset-0" style={{
            filter: "blur(50px)", background: `rgba(168,85,247,0.15)`,
            transform: "scale(2.5)", borderRadius: "50%",
          }} />
          <Image src="/images/logo-time-v2.png" alt="TIME Escola de Negócios" width={360} height={116} className="relative h-[100px] w-auto" />
        </motion.div>

        <motion.h1 variants={fadeUp} style={{
          fontFamily: FONT, fontSize: TYPE.hero, fontWeight: 700,
          lineHeight: 1.1, color: C.textPrimary, letterSpacing: "-0.03em",
        }}>
          TIME{" "}
          <span style={gradientTextShine}>Escola de Negócios</span>
        </motion.h1>

        <motion.div variants={fadeUp} className="w-20 h-[2px] mt-8 mb-8" style={{ background: C.accent, opacity: 0.4 }} />

        <motion.p variants={fadeUp} style={{
          fontSize: TYPE.bodyLg, color: C.textSecondary,
          maxWidth: 700, lineHeight: 1.7, fontStyle: "italic",
        }}>
          &ldquo;Estrutura, conhecimento e desenvolvimento para acelerar resultados.
          A fusão entre networking estratégico e educação empresarial de alto nível.&rdquo;
        </motion.p>
      </motion.div>

      <motion.div className="absolute bottom-8 right-8 z-10 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2, duration: 0.8 }}
      >
        <span style={{ color: C.textMuted, fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase" }}>próximo</span>
        <motion.svg width="20" height="20" viewBox="0 0 20 20" fill="none"
          animate={{ y: [0, 6, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <path d="M4 7L10 13L16 7" stroke={C.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </motion.svg>
      </motion.div>
    </SlideBase>
  );
}


// ════════════════════════════════════════════════════════════════
// SLIDE 2 — CONHEÇA NOSSOS SÓCIOS
// ════════════════════════════════════════════════════════════════
function Slide2() {
  return (
    <SlideBase>
      <div className="absolute inset-0" style={{
        background: `radial-gradient(ellipse 50% 50% at 50% 50%, rgba(168,85,247,0.06), transparent)`
      }} />

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <svg width="600" height="600" viewBox="0 0 600 600" fill="none" style={{ opacity: 0.04 }}>
          <circle cx="300" cy="300" r="250" stroke={C.accent} strokeWidth="1"/>
          <circle cx="300" cy="300" r="180" stroke={C.accentDark} strokeWidth="0.8"/>
          <circle cx="300" cy="300" r="110" stroke={C.cyan} strokeWidth="0.5"/>
        </svg>
      </div>

      <PurpleDust />
      <CornerAccent position="tl" />
      <CornerAccent position="br" />

      <motion.div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-[10%]"
        variants={stagger} initial="hidden" animate="show"
      >
        <Label>Quem somos</Label>

        <motion.h2 variants={fadeUp} style={{
          fontFamily: FONT, fontSize: TYPE.hero, fontWeight: 700,
          color: C.textPrimary, lineHeight: 1.1, letterSpacing: "-0.03em",
        }}>
          Conheça nossos{" "}
          <span style={gradientTextShine}>sócios.</span>
        </motion.h2>

        <motion.div variants={fadeUp} className="w-20 h-[2px] mt-8 mb-8" style={{ background: C.accent, opacity: 0.4 }} />

        <motion.p variants={fadeUp} style={{
          fontSize: TYPE.bodyLg, color: C.textSecondary,
          maxWidth: 600, lineHeight: 1.7,
        }}>
          Uma equipe de líderes, empreendedores e especialistas
          unidos por um propósito: transformar vidas através dos negócios.
        </motion.p>
      </motion.div>
    </SlideBase>
  );
}


// ════════════════════════════════════════════════════════════════
// SLIDE 3 — IGOR FERREIRA
// ════════════════════════════════════════════════════════════════
function Slide3() {
  return (
    <SlideBase>
      <div className="absolute inset-0" style={{
        background: `radial-gradient(ellipse at 25% 50%, rgba(168,85,247,0.04), transparent 60%)`
      }} />
      <CornerAccent position="tl" />
      <CornerAccent position="br" />

      <motion.div className="relative z-10 flex items-center h-full px-[6%] gap-[4%]" style={{ marginTop: "-3%" }}
        variants={stagger} initial="hidden" animate="show"
      >
        {/* Left — text */}
        <div className="w-[50%] flex flex-col justify-center">
          <Label>Sócio</Label>
          <motion.h2 variants={fadeUp} style={{
            fontFamily: FONT, fontSize: TYPE.hero, fontWeight: 700,
            color: C.textPrimary, lineHeight: 1.05, letterSpacing: "-0.03em",
            marginBottom: 16,
          }}>
            <span style={gradientTextShine}>Igor Ferreira</span>
          </motion.h2>

          <motion.p variants={fadeUp} style={{
            fontSize: TYPE.bodyLg, color: C.textSecondary,
            lineHeight: 1.7, maxWidth: 520,
          }}>
            Empresário, fundador da ICF Group e referência nacional em
            liderança, gestão e desenvolvimento corporativo.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-col gap-4 mt-8">
            {[
              { icon: "briefcase", text: "Fundador da ICF Group" },
              { icon: "target", text: "Referência em Gestão Corporativa" },
              { icon: "trending", text: "Empreendedor e Líder" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 px-6 py-4 rounded-2xl" style={{
                background: `linear-gradient(160deg, rgba(168,85,247,0.06) 0%, rgba(0,0,0,0.3) 100%)`,
                border: `1px solid ${C.borderCard}`,
                backdropFilter: "blur(12px)",
              }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                  background: `linear-gradient(135deg, rgba(168,85,247,0.15), rgba(168,85,247,0.04))`,
                  border: `1px solid rgba(168,85,247,0.2)`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Icon name={item.icon} size={22} />
                </div>
                <span style={{ fontSize: 18, color: C.textSecondary, fontWeight: 600 }}>{item.text}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right — photo */}
        <motion.div variants={slideR} className="w-[40%] relative rounded-3xl overflow-hidden"
          style={{
            border: `1px solid ${C.borderCard}`,
            boxShadow: `0 0 60px rgba(168,85,247,0.06)`,
            aspectRatio: "3/4",
          }}
        >
          <Image
            src="/images/expert-igor-ferreira.jpg"
            alt="Igor Ferreira"
            fill
            className="object-cover object-top"
          />
          <div className="absolute inset-0" style={{
            background: `linear-gradient(to top, rgba(3,3,3,0.6) 0%, transparent 40%)`,
          }} />
          <div className="absolute inset-0" style={{
            background: `linear-gradient(to right, ${C.bg0} 0%, transparent 20%)`,
          }} />
        </motion.div>
      </motion.div>
    </SlideBase>
  );
}


// ════════════════════════════════════════════════════════════════
// SLIDE 4 — JESUS (Nosso primeiro sócio)
// ════════════════════════════════════════════════════════════════
function Slide4() {
  return (
    <SlideBase>
      {/* Jesus background photo */}
      <div className="absolute inset-0">
        <Image
          src="/images/jesus-bg.jpg"
          alt=""
          fill
          className="object-cover"
          style={{ opacity: 0.25 }}
        />
      </div>

      {/* Dark overlay */}
      <div className="absolute inset-0" style={{
        background: `linear-gradient(to bottom, rgba(3,3,3,0.6) 0%, rgba(3,3,3,0.75) 50%, rgba(3,3,3,0.85) 100%)`
      }} />

      {/* Purple tint overlay */}
      <div className="absolute inset-0" style={{
        background: `radial-gradient(ellipse 60% 60% at 50% 40%, rgba(168,85,247,0.12), transparent)`
      }} />

      <CornerAccent position="tl" />
      <CornerAccent position="tr" />
      <CornerAccent position="bl" />
      <CornerAccent position="br" />

      <motion.div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-[10%]"
        variants={stagger} initial="hidden" animate="show"
      >
        <motion.div variants={scaleReveal} className="mb-8">
          <Icon name="cross" size={60} color={C.accentLight} />
        </motion.div>

        <Label>Nosso primeiro sócio</Label>

        <motion.h2 variants={fadeUp} style={{
          fontFamily: FONT, fontSize: TYPE.hero, fontWeight: 700,
          color: C.textPrimary, lineHeight: 1.1, letterSpacing: "-0.03em",
        }}>
          <span style={gradientTextShine}>Jesus</span>
        </motion.h2>

        <motion.div variants={fadeUp} className="w-20 h-[2px] mt-8 mb-8" style={{ background: C.accent, opacity: 0.3 }} />

        <motion.p variants={fadeUp} style={{
          fontSize: TYPE.bodyLg, color: C.textSecondary,
          maxWidth: 600, lineHeight: 1.8, fontStyle: "italic",
        }}>
          &ldquo;Porque onde estiverem dois ou três reunidos em meu nome,
          ali estou no meio deles.&rdquo;
          <span style={{ display: "block", marginTop: 12, fontSize: 14, color: C.textMuted, fontStyle: "normal" }}>
            Mateus 18:20
          </span>
        </motion.p>
      </motion.div>
    </SlideBase>
  );
}


// ════════════════════════════════════════════════════════════════
// SLIDE 5 — MISSÃO, VISÃO E VALORES
// ════════════════════════════════════════════════════════════════
function Slide5() {
  const cards = [
    {
      title: "Missão",
      icon: "target",
      content: "Ajudar nossos alunos a alcançarem seus objetivos pessoais e profissionais.",
    },
    {
      title: "Visão",
      icon: "compass",
      content: "Ser referência na sociedade em ambiente e ambiência, proporcionando bons relacionamentos e acesso a network.",
    },
    {
      title: "Valores",
      icon: "heart",
      items: ["Amor a Deus", "Lealdade", "Amor à família", "Senso de justiça"],
    },
  ];

  return (
    <SlideBase>
      <div className="absolute inset-0" style={{
        background: `radial-gradient(ellipse at 50% 30%, rgba(168,85,247,0.05), transparent 55%)`
      }} />
      <CornerAccent position="tl" />
      <CornerAccent position="br" />

      <motion.div className="relative z-10 flex flex-col items-center justify-center h-full px-[6%]"
        variants={stagger} initial="hidden" animate="show"
      >
        <Label>Quem somos</Label>
        <motion.h2 variants={fadeUp} style={{
          fontFamily: FONT, fontSize: TYPE.main, fontWeight: 700,
          color: C.textPrimary, lineHeight: 1.1, letterSpacing: "-0.03em",
          marginBottom: 48, textAlign: "center",
        }}>
          Missão, Visão e{" "}
          <span style={gradientTextShine}>Valores</span>
        </motion.h2>

        <div className="grid grid-cols-3 gap-6 w-full max-w-[1100px]">
          {cards.map((card, i) => (
            <motion.div key={i} variants={fadeUp}
              className="relative overflow-hidden rounded-2xl p-8 group"
              style={{
                background: `linear-gradient(160deg, rgba(168,85,247,0.06) 0%, rgba(0,0,0,0.4) 100%)`,
                border: `1px solid ${C.borderCard}`,
                backdropFilter: "blur(12px)",
              }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div style={{
                  width: 48, height: 48, borderRadius: 14,
                  background: `linear-gradient(135deg, rgba(168,85,247,0.15), rgba(168,85,247,0.04))`,
                  border: `1px solid rgba(168,85,247,0.2)`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Icon name={card.icon} size={24} />
                </div>
                <h3 style={{
                  fontSize: 24, fontWeight: 700, color: C.textPrimary,
                  fontFamily: FONT,
                }}>{card.title}</h3>
              </div>

              {"content" in card && (
                <p style={{ fontSize: 17, color: C.textSecondary, lineHeight: 1.7 }}>
                  {card.content}
                </p>
              )}
              {"items" in card && card.items && (
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {card.items.map((item, j) => (
                    <li key={j} className="flex items-center gap-3" style={{
                      fontSize: 17, color: C.textSecondary, lineHeight: 1.7,
                      padding: "6px 0",
                    }}>
                      <div style={{
                        width: 8, height: 8, borderRadius: "50%",
                        background: C.accent,
                        flexShrink: 0,
                      }} />
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </SlideBase>
  );
}


// ════════════════════════════════════════════════════════════════
// SLIDE 6 — MAMÁ BRITO
// ════════════════════════════════════════════════════════════════
function Slide6() {
  return (
    <SlideBase>
      <div className="absolute inset-0" style={{
        background: `radial-gradient(ellipse at 70% 50%, rgba(168,85,247,0.04), transparent 60%)`
      }} />
      <CornerAccent position="tl" />
      <CornerAccent position="br" />

      <motion.div className="relative z-10 flex items-center h-full px-[6%] gap-[4%]" style={{ marginTop: "-3%" }}
        variants={stagger} initial="hidden" animate="show"
      >
        {/* Left — text */}
        <div className="w-[50%] flex flex-col justify-center">
          <Label>Sócio</Label>
          <motion.h2 variants={fadeUp} style={{
            fontFamily: FONT, fontSize: TYPE.hero, fontWeight: 700,
            color: C.textPrimary, lineHeight: 1.05, letterSpacing: "-0.03em",
            marginBottom: 16,
          }}>
            <span style={gradientTextShine}>Mamá Brito</span>
          </motion.h2>

          <motion.p variants={fadeUp} style={{
            fontSize: TYPE.bodyLg, color: C.textSecondary,
            lineHeight: 1.7, maxWidth: 520,
          }}>
            Empresário multisegmento com forte visão de crescimento
            e geração de oportunidades no mercado.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-col gap-4 mt-8">
            {[
              { icon: "briefcase", text: "Empresário Multisegmento" },
              { icon: "trending", text: "Visão de Crescimento" },
              { icon: "handshake", text: "Geração de Oportunidades" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 px-6 py-4 rounded-2xl" style={{
                background: `linear-gradient(160deg, rgba(168,85,247,0.06) 0%, rgba(0,0,0,0.3) 100%)`,
                border: `1px solid ${C.borderCard}`,
                backdropFilter: "blur(12px)",
              }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                  background: `linear-gradient(135deg, rgba(168,85,247,0.15), rgba(168,85,247,0.04))`,
                  border: `1px solid rgba(168,85,247,0.2)`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Icon name={item.icon} size={22} />
                </div>
                <span style={{ fontSize: 18, color: C.textSecondary, fontWeight: 600 }}>{item.text}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right — photo */}
        <motion.div variants={slideR} className="w-[40%] relative rounded-3xl overflow-hidden"
          style={{
            border: `1px solid ${C.borderCard}`,
            boxShadow: `0 0 60px rgba(168,85,247,0.06)`,
            aspectRatio: "3/4",
          }}
        >
          <Image
            src="/images/expert-mama-brito.webp"
            alt="Mamá Brito"
            fill
            className="object-cover object-top"
          />
          <div className="absolute inset-0" style={{
            background: `linear-gradient(to top, rgba(3,3,3,0.6) 0%, transparent 40%)`,
          }} />
          <div className="absolute inset-0" style={{
            background: `linear-gradient(to right, ${C.bg0} 0%, transparent 20%)`,
          }} />
        </motion.div>
      </motion.div>
    </SlideBase>
  );
}


// ════════════════════════════════════════════════════════════════
// SLIDE 7 — DEIVISON FERREIRA
// ════════════════════════════════════════════════════════════════
function Slide7() {
  return (
    <SlideBase>
      <div className="absolute inset-0" style={{
        background: `radial-gradient(ellipse at 70% 50%, rgba(6,182,212,0.04), transparent 60%)`
      }} />
      <CornerAccent position="tl" />
      <CornerAccent position="br" />

      <motion.div className="relative z-10 flex items-center h-full px-[6%] gap-[4%]" style={{ marginTop: "-3%" }}
        variants={stagger} initial="hidden" animate="show"
      >
        {/* Left — text */}
        <div className="w-[50%] flex flex-col justify-center">
          <Label>Sócio</Label>
          <motion.h2 variants={fadeUp} style={{
            fontFamily: FONT, fontSize: TYPE.hero, fontWeight: 700,
            color: C.textPrimary, lineHeight: 1.05, letterSpacing: "-0.03em",
            marginBottom: 16,
          }}>
            <span style={gradientTextShine}>Deivison Ferreira</span>
          </motion.h2>

          <motion.p variants={fadeUp} style={{
            fontSize: TYPE.bodyLg, color: C.textSecondary,
            lineHeight: 1.7, maxWidth: 520,
          }}>
            Especialista em liderança e comportamento humano, com mais de 30 anos de
            experiência e impacto em milhares de alunos e empresas.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-col gap-4 mt-8">
            {[
              { icon: "brain", text: "Liderança e Comportamento Humano" },
              { icon: "award", text: "+30 anos de experiência" },
              { icon: "users", text: "Milhares de alunos impactados" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 px-6 py-4 rounded-2xl" style={{
                background: `linear-gradient(160deg, rgba(168,85,247,0.06) 0%, rgba(0,0,0,0.3) 100%)`,
                border: `1px solid ${C.borderCard}`,
                backdropFilter: "blur(12px)",
              }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                  background: `linear-gradient(135deg, rgba(168,85,247,0.15), rgba(168,85,247,0.04))`,
                  border: `1px solid rgba(168,85,247,0.2)`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Icon name={item.icon} size={22} />
                </div>
                <span style={{ fontSize: 18, color: C.textSecondary, fontWeight: 600 }}>{item.text}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right — photo */}
        <motion.div variants={slideR} className="w-[40%] relative rounded-3xl overflow-hidden"
          style={{
            border: `1px solid ${C.borderCard}`,
            boxShadow: `0 0 60px rgba(168,85,247,0.06)`,
            aspectRatio: "3/4",
          }}
        >
          <Image
            src="/images/expert-deivison-ferreira.webp"
            alt="Deivison Ferreira"
            fill
            className="object-cover object-top"
          />
          <div className="absolute inset-0" style={{
            background: `linear-gradient(to top, rgba(3,3,3,0.6) 0%, transparent 40%)`,
          }} />
          <div className="absolute inset-0" style={{
            background: `linear-gradient(to right, ${C.bg0} 0%, transparent 20%)`,
          }} />
        </motion.div>
      </motion.div>
    </SlideBase>
  );
}


// ════════════════════════════════════════════════════════════════
// SLIDE 8 — MALLAS BARBER (Palestrante)
// ════════════════════════════════════════════════════════════════
function Slide8() {
  return (
    <SlideBase>
      <div className="absolute inset-0" style={{
        background: `radial-gradient(ellipse at 70% 50%, rgba(168,85,247,0.06), transparent 55%)`
      }} />
      <CornerAccent position="tl" />
      <CornerAccent position="br" />

      <motion.div className="relative z-10 flex items-center h-full px-[6%] gap-[4%]"
        variants={stagger} initial="hidden" animate="show"
      >
        {/* Left — text */}
        <div className="w-[45%] flex flex-col justify-center">
          <Label>Palestrante</Label>
          <motion.h2 variants={fadeUp} className="flex items-center gap-4" style={{
            fontFamily: FONT, fontSize: TYPE.hero, fontWeight: 700,
            color: C.textPrimary, lineHeight: 1.05, letterSpacing: "-0.03em",
            marginBottom: 16,
          }}>
            <span style={gradientTextShine}>Mallas Barber</span>
            <Icon name="puzzle" size={36} color={C.accentLight} />
          </motion.h2>

          <motion.p variants={fadeUp} style={{
            fontSize: TYPE.bodyLg, color: C.textSecondary,
            lineHeight: 1.7, maxWidth: 520,
          }}>
            Empresário e palestrante.<br />
            Referência em posicionamento e networking.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-col gap-4 mt-8">
            {[
              { icon: "users", text: "+98 mil seguidores" },
              { icon: "star", text: "Presença em mídias (Band e SBT)" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 px-6 py-4 rounded-2xl" style={{
                background: `linear-gradient(160deg, rgba(168,85,247,0.06) 0%, rgba(0,0,0,0.3) 100%)`,
                border: `1px solid ${C.borderCard}`,
                backdropFilter: "blur(12px)",
              }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 12, flexShrink: 0,
                  background: `linear-gradient(135deg, rgba(168,85,247,0.15), rgba(168,85,247,0.04))`,
                  border: `1px solid rgba(168,85,247,0.2)`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Icon name={item.icon} size={24} />
                </div>
                <span style={{ fontSize: 22, color: C.textSecondary, fontWeight: 600 }}>{item.text}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right — image */}
        <motion.div variants={slideR} className="w-[45%] relative rounded-3xl overflow-hidden"
          style={{
            border: `1px solid ${C.borderCard}`,
            boxShadow: `0 0 60px rgba(168,85,247,0.06)`,
            aspectRatio: "3/4",
          }}
        >
          <Image
            src="/images/expert - Mallas barber _ Carlos camilo2.png"
            alt="Mallas Barber"
            fill
            className="object-cover object-top"
          />
          <div className="absolute inset-0" style={{
            background: `linear-gradient(to top, rgba(3,3,3,0.6) 0%, transparent 40%)`,
          }} />
          <div className="absolute inset-0" style={{
            background: `linear-gradient(to right, ${C.bg0} 0%, transparent 20%)`,
          }} />
        </motion.div>
      </motion.div>
    </SlideBase>
  );
}



// ════════════════════════════════════════════════════════════════
// SLIDE 10 — NOSSO CLUBE DE BENEFÍCIOS
// ════════════════════════════════════════════════════════════════
function Slide10() {
  const benefits = [
    { image: "/images/benefit-networking.jpg", title: "Networking e Conexão de Elite" },
    { image: "/images/benefit-educacao.jpg", title: "Educação e Capacitação" },
    { image: "/images/benefit-expansao.jpg", title: "Expansão e Investimento" },
    { image: "/images/benefit-autoridade.jpg", title: "Autoridade e Exposição" },
    { image: "/images/benefit-internacionalizacao.jpg", title: "Internacionalização" },
    { image: "/images/benefit-mentoria.jpg", title: "Mentoria e Plano Prático" },
  ];

  return (
    <SlideBase>
      <div className="absolute inset-0" style={{
        background: `radial-gradient(ellipse at 50% 30%, rgba(168,85,247,0.05), transparent 55%)`
      }} />
      <CornerAccent position="tl" />
      <CornerAccent position="br" />

      <motion.div className="relative z-10 flex flex-col items-center justify-center h-full px-[5%]"
        variants={stagger} initial="hidden" animate="show"
      >
        <Label>Benefícios</Label>
        <motion.h2 variants={fadeUp} style={{
          fontFamily: FONT, fontSize: TYPE.main, fontWeight: 700,
          color: C.textPrimary, lineHeight: 1.1, letterSpacing: "-0.03em",
          marginBottom: 36, textAlign: "center",
        }}>
          Nosso Clube de{" "}
          <span style={gradientTextShine}>Benefícios</span>
        </motion.h2>

        <div className="grid grid-cols-3 gap-5 w-full max-w-[1100px]">
          {benefits.map((b, i) => (
            <motion.div key={i} variants={fadeUp}
              className="relative overflow-hidden rounded-2xl group"
              style={{
                border: `1px solid ${C.borderCard}`,
                aspectRatio: "4/3",
              }}
            >
              <Image
                src={b.image}
                alt={b.title}
                fill
                className="object-cover"
              />
              {/* Dark gradient overlay */}
              <div className="absolute inset-0" style={{
                background: `linear-gradient(to top, rgba(3,3,3,0.85) 0%, rgba(3,3,3,0.3) 50%, rgba(3,3,3,0.1) 100%)`,
              }} />
              {/* Purple tint */}
              <div className="absolute inset-0" style={{
                background: `linear-gradient(135deg, rgba(168,85,247,0.1) 0%, transparent 60%)`,
              }} />
              {/* Title */}
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <h3 style={{
                  fontSize: 17, fontWeight: 700, color: C.textPrimary,
                  lineHeight: 1.3, textShadow: "0 2px 8px rgba(0,0,0,0.5)",
                }}>{b.title}</h3>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </SlideBase>
  );
}


// ════════════════════════════════════════════════════════════════
// SLIDE 11 — NOSSOS CURSOS
// ════════════════════════════════════════════════════════════════
function Slide11() {
  const courses = [
    { icon: "briefcase", title: "Empreendedorismo", desc: "Estruturação de Negócios" },
    { icon: "brain", title: "Gestão e Liderança", desc: "de Elite" },
    { icon: "target", title: "Marketing e Prospecção", desc: "360º" },
    { icon: "trending", title: "Marketing e Vendas", desc: "Conversão Máxima" },
    { icon: "rocket", title: "Vendas Automotiva", desc: "Profissionalizante" },
    { icon: "shield", title: "Criptoativos", desc: "nos Negócios" },
    { icon: "compass", title: "Inteligência Artificial", desc: "na Prática" },
    { icon: "mic", title: "Comunicação e Oratória", desc: "de Alto Impacto" },
    { icon: "book", title: "Gestão Tributária", desc: "e Orçamentária" },
  ];

  return (
    <SlideBase>
      <div className="absolute inset-0" style={{
        background: `radial-gradient(ellipse at 50% 40%, rgba(6,182,212,0.05), transparent 55%)`
      }} />
      <CornerAccent position="tl" />
      <CornerAccent position="br" />

      <motion.div className="relative z-10 flex flex-col items-center justify-center h-full px-[5%]" style={{ marginTop: "-2%" }}
        variants={stagger} initial="hidden" animate="show"
      >
        <motion.h2 variants={fadeUp} style={{
          fontFamily: FONT, fontSize: TYPE.main, fontWeight: 700,
          color: C.textPrimary, lineHeight: 1.1, letterSpacing: "-0.03em",
          marginBottom: 36, textAlign: "center",
        }}>
          Nossos{" "}
          <span style={gradientTextShine}>Cursos</span>
        </motion.h2>

        <div className="grid grid-cols-3 gap-4 w-full max-w-[1000px]">
          {courses.map((c, i) => (
            <motion.div key={i} variants={fadeUp}
              className="flex items-center gap-4 rounded-2xl p-5"
              style={{
                background: `linear-gradient(160deg, rgba(168,85,247,0.06) 0%, rgba(0,0,0,0.4) 100%)`,
                border: `1px solid ${C.borderCard}`,
                backdropFilter: "blur(12px)",
              }}
            >
              <div style={{
                width: 46, height: 46, borderRadius: 14, flexShrink: 0,
                background: `linear-gradient(135deg, rgba(168,85,247,0.15), rgba(6,182,212,0.08))`,
                border: `1px solid rgba(168,85,247,0.2)`,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Icon name={c.icon} size={22} />
              </div>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: C.textPrimary, lineHeight: 1.2 }}>{c.title}</h3>
                <p style={{ fontSize: 13, color: C.textSecondary, marginTop: 2 }}>{c.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </SlideBase>
  );
}


// ════════════════════════════════════════════════════════════════
// SLIDE 12 — PREÇO ÂNCORA (pergunta)
// ════════════════════════════════════════════════════════════════
function Slide12() {
  return (
    <SlideBase>
      <div className="absolute inset-0" style={{
        background: `radial-gradient(ellipse at 50% 50%, rgba(168,85,247,0.06), transparent 55%)`
      }} />
      <PurpleDust />
      <CornerAccent position="tl" />
      <CornerAccent position="br" />

      <motion.div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-[10%]"
        variants={stagger} initial="hidden" animate="show"
      >
        <motion.h2 variants={fadeUp} style={{
          fontFamily: FONT, fontSize: TYPE.center, fontWeight: 700,
          color: C.textPrimary, lineHeight: 1.2, letterSpacing: "-0.02em",
          maxWidth: 800,
        }}>
          Se você fosse pagar por{" "}
          <span style={gradientTextShine}>tudo isso</span>{" "}
          separadamente,<br />
          quanto seria?
        </motion.h2>
      </motion.div>
    </SlideBase>
  );
}


// ════════════════════════════════════════════════════════════════
// SLIDE 13 — R$ 9.900,00
// ════════════════════════════════════════════════════════════════
function Slide13() {
  return (
    <SlideBase>
      <div className="absolute inset-0" style={{
        background: `radial-gradient(ellipse at 50% 50%, rgba(168,85,247,0.08), transparent 55%)`
      }} />
      <PurpleDust />
      <CornerAccent position="tl" />
      <CornerAccent position="tr" />
      <CornerAccent position="bl" />
      <CornerAccent position="br" />

      <motion.div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-[10%]"
        variants={stagger} initial="hidden" animate="show"
      >
        <motion.div variants={scaleReveal} style={{
          fontFamily: FONT, fontSize: "clamp(4rem, 8vw, 7rem)", fontWeight: 800,
          lineHeight: 1,
        }}>
          <span style={gradientTextShine}>R$ 9.900,00</span>
        </motion.div>
      </motion.div>
    </SlideBase>
  );
}


// ════════════════════════════════════════════════════════════════
// SLIDE 14 — MAS VOCÊ NÃO VAI PAGAR
// ════════════════════════════════════════════════════════════════
function Slide14() {
  return (
    <SlideBase>
      <div className="absolute inset-0" style={{
        background: `radial-gradient(ellipse at 50% 50%, rgba(168,85,247,0.05), transparent 55%)`
      }} />
      <PurpleDust />
      <CornerAccent position="tl" />
      <CornerAccent position="br" />

      <motion.div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-[10%]"
        variants={stagger} initial="hidden" animate="show"
      >
        <motion.h2 variants={fadeUp} style={{
          fontFamily: FONT, fontSize: TYPE.center, fontWeight: 700,
          color: C.textPrimary, lineHeight: 1.3, letterSpacing: "-0.02em",
          maxWidth: 800,
        }}>
          Mas você <span style={{ color: C.accent }}>não</span> vai pagar<br />
          por isso hoje.
        </motion.h2>

        <motion.div variants={fadeUp} className="w-20 h-[2px] mt-10 mb-10" style={{ background: C.accent, opacity: 0.4 }} />

        <motion.p variants={fadeUp} style={{
          fontSize: TYPE.bodyLg, color: C.textSecondary,
          maxWidth: 600, lineHeight: 1.7,
        }}>
          Você vai fazer parte de tudo isso por apenas&hellip;
        </motion.p>
      </motion.div>
    </SlideBase>
  );
}


// ════════════════════════════════════════════════════════════════
// SLIDE 15 — PREÇO ESPECIAL
// ════════════════════════════════════════════════════════════════
function Slide15() {
  return (
    <SlideBase>
      <div className="absolute inset-0" style={{
        background: `radial-gradient(ellipse at 50% 40%, rgba(168,85,247,0.08), transparent 55%)`
      }} />
      <PurpleDust />
      <CornerAccent position="tl" />
      <CornerAccent position="tr" />
      <CornerAccent position="bl" />
      <CornerAccent position="br" />

      <motion.div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-[10%]"
        variants={stagger} initial="hidden" animate="show"
      >
        <motion.p variants={fadeUp} style={{
          fontSize: 18, color: C.textMuted, textDecoration: "line-through",
          marginBottom: 16,
        }}>
          R$ 9.900,00
        </motion.p>

        <motion.div variants={scaleReveal} style={{
          fontFamily: FONT, fontSize: "clamp(3.5rem, 7vw, 6rem)", fontWeight: 800,
          lineHeight: 1, marginBottom: 20,
        }}>
          <span style={gradientTextShine}>R$ 4.950,00</span>
        </motion.div>

        <motion.p variants={fadeUp} style={{
          fontSize: TYPE.bodyLg, color: C.textPrimary, fontWeight: 600,
          marginBottom: 8,
        }}>
          à vista
        </motion.p>

        <motion.div variants={fadeUp} className="flex items-center gap-4 my-4">
          <div style={{ width: 40, height: 1, background: C.textMuted, opacity: 0.3 }} />
          <span style={{ fontSize: 16, color: C.textMuted }}>ou</span>
          <div style={{ width: 40, height: 1, background: C.textMuted, opacity: 0.3 }} />
        </motion.div>

        <motion.div variants={fadeUp}>
          <span style={{
            fontFamily: FONT, fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 700,
            color: C.textPrimary,
          }}>
            12x de{" "}
            <span style={gradientTextPurple}>R$ 473,60</span>
          </span>
        </motion.div>
      </motion.div>
    </SlideBase>
  );
}


// ════════════════════════════════════════════════════════════════
// SLIDE 16 — EXCLUSIVIDADE
// ════════════════════════════════════════════════════════════════
function Slide16() {
  return (
    <SlideBase>
      <div className="absolute inset-0" style={{
        background: `radial-gradient(ellipse at 50% 50%, rgba(168,85,247,0.05), transparent 55%)`
      }} />

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <svg width="500" height="500" viewBox="0 0 500 500" fill="none" style={{ opacity: 0.03 }}>
          <path d="M250 30L470 250L250 470L30 250Z" stroke={C.accent} strokeWidth="1.5"/>
          <path d="M250 80L420 250L250 420L80 250Z" stroke={C.accent} strokeWidth="0.8"/>
        </svg>
      </div>

      <PurpleDust />
      <CornerAccent position="tl" />
      <CornerAccent position="br" />

      <motion.div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-[10%]"
        variants={stagger} initial="hidden" animate="show"
      >
        <motion.h2 variants={fadeUp} style={{
          fontFamily: FONT, fontSize: TYPE.center, fontWeight: 700,
          color: C.textPrimary, lineHeight: 1.3, letterSpacing: "-0.02em",
          maxWidth: 800,
        }}>
          Mas sendo justo com quem<br />
          está aqui <span style={gradientTextShine}>hoje,</span>
        </motion.h2>

        <motion.div variants={fadeUp} className="w-20 h-[2px] mt-8 mb-8" style={{ background: C.accent, opacity: 0.4 }} />

        <motion.p variants={fadeUp} style={{
          fontSize: TYPE.bodyLg, color: C.textSecondary,
          maxWidth: 600, lineHeight: 1.7,
        }}>
          essa condição é <span style={{ color: C.accent, fontWeight: 700 }}>exclusiva</span>.<br />
          Depois desse evento, isso muda.
        </motion.p>
      </motion.div>
    </SlideBase>
  );
}


// ════════════════════════════════════════════════════════════════
// SLIDE 17 — PROFESSORES E MENTORES
// ════════════════════════════════════════════════════════════════
function Slide17() {
  const mentors = [
    { name: "Tony Granado", image: "/images/expert-tony-granado.webp" },
    { name: "Apollo", image: "/images/expert-apollo.jpeg" },
    { name: "Igor Ferreira", image: "/images/expert-igor-ferreira.jpg" },
    { name: "Deivison Ferreira", image: "/images/expert-deivison-ferreira.webp" },
    { name: "Danilo Trevisan", image: "/images/expert-danilo-trevisan.jpeg" },
    { name: "Mamá Brito", image: "/images/expert-mama-brito.webp" },
    { name: "Jeziel Roza", image: "/images/expert-jeziel-roza.jpg" },
    { name: "Guilherme Rivaroli", image: "/images/expert-guilherme-rivaroli.jpg" },
  ];

  return (
    <SlideBase>
      <div className="absolute inset-0" style={{
        background: `radial-gradient(ellipse at 50% 30%, rgba(168,85,247,0.06), transparent 55%)`
      }} />
      <CornerAccent position="tl" />
      <CornerAccent position="br" />

      <motion.div className="relative z-10 flex flex-col items-center justify-center h-full px-[5%]" style={{ marginTop: "-3%" }}
        variants={stagger} initial="hidden" animate="show"
      >
        <Label>Nosso time</Label>
        <motion.h2 variants={fadeUp} style={{
          fontFamily: FONT, fontSize: TYPE.main, fontWeight: 700,
          color: C.textPrimary, lineHeight: 1.1, letterSpacing: "-0.03em",
          marginBottom: 32, textAlign: "center",
        }}>
          Professores e{" "}
          <span style={gradientTextShine}>Mentores</span>
        </motion.h2>

        <div className="grid grid-cols-4 gap-4 w-full max-w-[1000px]">
          {mentors.map((m, i) => (
            <motion.div key={i} variants={fadeUp}
              className="flex flex-col items-center gap-3"
            >
              <div className="relative rounded-2xl overflow-hidden" style={{
                width: "100%", aspectRatio: "1/1",
                border: `1px solid ${C.borderCard}`,
                boxShadow: `0 0 30px rgba(168,85,247,0.04)`,
              }}>
                <Image
                  src={m.image}
                  alt={m.name}
                  fill
                  className="object-cover object-top"
                />
                <div className="absolute inset-0" style={{
                  background: `linear-gradient(to top, rgba(3,3,3,0.7) 0%, transparent 50%)`,
                }} />
              </div>
              <p style={{
                fontSize: 15, fontWeight: 700, color: C.textPrimary,
                textAlign: "center", lineHeight: 1.2,
              }}>{m.name}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </SlideBase>
  );
}


// ════════════════════════════════════════════════════════════════
// SLIDE 18 — CTA FINAL
// ════════════════════════════════════════════════════════════════
function Slide18() {
  return (
    <SlideBase>
      <div className="absolute inset-0" style={{
        background: `radial-gradient(ellipse at 50% 40%, rgba(168,85,247,0.08), transparent 55%)`
      }} />

      <PurpleDust />
      <CornerAccent position="tl" />
      <CornerAccent position="tr" />
      <CornerAccent position="bl" />
      <CornerAccent position="br" />

      <motion.div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-[6%]" style={{ marginTop: "-3%" }}
        variants={stagger} initial="hidden" animate="show"
      >
        {/* Logo with glow */}
        <motion.div variants={scaleReveal} className="mb-2 relative">
          <div className="absolute inset-0" style={{
            filter: "blur(40px)", background: `rgba(168,85,247,0.12)`,
            transform: "scale(2)", borderRadius: "50%",
          }} />
          <Image src="/images/logo-time-v2.png" alt="TIME" width={240} height={78} className="relative h-[70px] w-auto" />
        </motion.div>

        {/* Separator */}
        <motion.div variants={fadeUp} style={{ width: 60, height: 2, background: C.accent, borderRadius: 1, marginBottom: 10, opacity: 0.4 }} />

        <motion.h2 variants={fadeUp} style={{
          fontFamily: FONT, fontSize: TYPE.main, fontWeight: 700,
          color: C.textPrimary, lineHeight: 1.15, letterSpacing: "-0.02em",
          marginBottom: 32,
        }}>
          Agora é o{" "}
          <span style={gradientTextShine}>momento.</span>
        </motion.h2>

        <motion.div variants={fadeUp} className="flex flex-col gap-5">
          {[
            "Faça seu cadastro",
            "Fale com o time",
            "Garanta a sua vaga",
          ].map((text, i) => (
            <div key={i} className="flex items-center gap-4">
              <div style={{
                width: 40, height: 40, borderRadius: 10,
                background: `linear-gradient(135deg, rgba(168,85,247,0.15), rgba(168,85,247,0.05))`,
                border: `1px solid rgba(168,85,247,0.2)`,
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: `0 0 20px rgba(168,85,247,0.06)`,
              }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8L7 12L13 4" stroke={C.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span style={{ fontSize: 22, color: C.textPrimary, fontWeight: 600 }}>{text}</span>
            </div>
          ))}
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
  8: () => <Slide10 />,
  9: () => <Slide11 />,
  10: () => <Slide12 />,
  11: () => <Slide13 />,
  12: () => <Slide14 />,
  13: () => <Slide15 />,
  14: () => <Slide16 />,
  15: () => <Slide17 />,
  16: () => <Slide18 />,
};


// ════════════════════════════════════════════════════════════════
// MAIN — APRESENTAÇÃO TIME
// ════════════════════════════════════════════════════════════════
export default function ApresentacaoTIME() {
  const [slide, setSlide] = useState(0);
  const [, setDir] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const touchRef = useRef<number | null>(null);
  const slideRef = useRef(slide);
  const containerRef = useRef<HTMLDivElement>(null);
  slideRef.current = slide;

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  };

  useEffect(() => {
    const onFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

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
      if (e.key === "f" || e.key === "F") {
        e.preventDefault();
        toggleFullscreen();
      }
      if (e.key === "Escape" && document.fullscreenElement) {
        document.exitFullscreen?.();
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
    <div ref={containerRef} className="relative w-screen h-screen overflow-hidden select-none"
      style={{ background: C.bg0, fontFamily: FONT }}
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
            <path d="M10 3L5 8L10 13" stroke={C.textSecondary} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
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
            <path d="M6 3L11 8L6 13" stroke={C.textSecondary} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}

      <div className="absolute bottom-0 left-0 right-0 z-30">
        <div className="w-full h-[2px]" style={{ background: "rgba(255,255,255,0.03)" }}>
          <motion.div className="h-full" style={{ background: C.accent }}
            animate={{ width: `${((slide + 1) / TOTAL) * 100}%` }} transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>
        <div className="flex items-center justify-center gap-2 py-4"
          style={{ background: "linear-gradient(to top, rgba(0,0,0,0.6), transparent)" }}
        >
          {Array.from({ length: TOTAL }).map((_, i) => (
            <button key={i} onClick={() => go(i)}
              className="transition-all duration-300 cursor-pointer"
              style={{ width: i === slide ? 24 : 6, height: 6, borderRadius: 3, background: i === slide ? C.accent : "rgba(255,255,255,0.15)" }}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
          <span className="ml-4" style={{ fontSize: 11, color: C.textMuted, fontWeight: 500 }}>
            {String(slide + 1).padStart(2, "0")}/{TOTAL}
          </span>
          <button onClick={toggleFullscreen}
            className="ml-4 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
            aria-label={isFullscreen ? "Sair da tela cheia" : "Tela cheia"}
            title={isFullscreen ? "Sair da tela cheia (F)" : "Tela cheia (F)"}
          >
            {isFullscreen ? (
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M5 1v3H1M9 1v3h4M5 13v-3H1M9 13v-3h4" stroke={C.textMuted} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M1 5V1h4M9 1h4v4M1 9v4h4M13 9v4H9" stroke={C.textMuted} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
