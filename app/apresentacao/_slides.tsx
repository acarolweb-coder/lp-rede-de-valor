"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

// ─── CONSTANTS ───
const TOTAL = 17;
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

      <motion.div className="relative z-10 flex flex-col justify-center h-full px-[8%] max-w-[65%] pt-10 pb-24"
        variants={stagger} initial="hidden" animate="show"
      >
        {/* LOGOS */}
        <motion.div variants={scaleReveal} className="flex items-center gap-8 mb-8" style={{
          filter: "drop-shadow(0 0 30px rgba(212,168,83,0.15))"
        }}>
          <Image src="/images/logo-rede-de-valor-branco-v2.png" alt="Rede de Valor" width={360} height={116} className="h-[90px] w-auto" />
          <span style={{ fontSize: 34, fontWeight: 200, color: "rgba(212,168,83,0.5)" }}>+</span>
          <Image src="/images/logo-time-v2.png" alt="TIME" width={260} height={84} className="h-[70px] w-auto" />
        </motion.div>

        <motion.h1 variants={fadeUp} style={{
          fontFamily: FONT, fontSize: "clamp(2.4rem, 4.5vw, 3.8rem)", fontWeight: 700,
          lineHeight: 1.1, color: "var(--text-primary)", letterSpacing: "-0.03em",
        }}>
          Um novo nível de<br />networking para<br />quem quer{" "}
          <span className="text-gradient-gold-shine">crescer<br />de verdade.</span>
        </motion.h1>

        <motion.p variants={fadeUp} style={{
          fontSize: TYPE.body, color: "var(--text-secondary)",
          marginTop: 28, maxWidth: 540, lineHeight: 1.7, fontWeight: 400,
        }}>
          A união da <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>Rede de Valor</span> com a{" "}
          <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>TIME Escola de Negócios</span> criou um ecossistema
          onde conexões geram oportunidades reais.
        </motion.p>

{/* Stats removidos temporariamente */}
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

      <div className="flex items-center h-full" style={{ marginTop: "-3%" }}>
        <motion.div className="w-[55%] flex flex-col justify-center pl-[8%] pr-[6%] relative z-10"
          variants={stagger} initial="hidden" animate="show"
        >
          <motion.h2 variants={fadeUp} style={{
            fontFamily: FONT, fontSize: TYPE.hero, fontWeight: 700,
            color: "var(--text-primary)", lineHeight: 1.05, letterSpacing: "-0.03em",
          }}>
            O networking<br />tradicional{" "}
            <span className="text-gradient-gold-shine">falhou.</span>
          </motion.h2>

          <motion.p variants={fadeUp} style={{
            fontSize: TYPE.bodyLg, color: "var(--text-secondary)",
            marginTop: 20, maxWidth: 520, lineHeight: 1.7,
          }}>
            Eventos genéricos, contatos que nunca respondem, grupos que não geram valor.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-7 grid grid-cols-3 gap-0">
            {[
              { n: "87%", l: "acham networking ineficiente" },
              { n: "3h", l: "desperdiçadas em eventos sem retorno" },
              { n: "92%", l: "dos cartões nunca viram negócio" },
            ].map((s, i) => (
              <div key={i} style={{
                padding: "22px 24px 22px 0",
                borderLeft: i > 0 ? "1px solid rgba(212,168,83,0.15)" : "none",
                paddingLeft: i > 0 ? 24 : 0,
              }}>
                <p style={{ fontSize: "clamp(2.4rem, 4vw, 3.2rem)", fontWeight: 700, color: "var(--gold)", lineHeight: 1 }}>{s.n}</p>
                <p style={{ fontSize: 14, color: "var(--text-muted)", marginTop: 10, lineHeight: 1.4, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}>{s.l}</p>
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

      <motion.div className="relative z-10 flex items-center h-full px-[5%] gap-[2%]"
        variants={stagger} initial="hidden" animate="show"
      >
        {/* Left — title area */}
        <div className="w-[36%] flex flex-col justify-center">
          <motion.h2 variants={fadeUp} style={{
            fontFamily: FONT, fontSize: TYPE.hero, fontWeight: 700,
            color: "var(--text-primary)", letterSpacing: "-0.03em", lineHeight: 1.05,
          }}>
            O problema<br />não é você,{" "}
            <span className="text-gradient-gold-shine">é<br />o ambiente.</span>
          </motion.h2>
          <motion.div variants={fadeUp} style={{ width: 60, height: 3, background: "var(--gold)", borderRadius: 2, marginTop: 28, opacity: 0.5 }} />
          <motion.p variants={fadeUp} style={{
            fontSize: TYPE.body, color: "var(--text-secondary)", lineHeight: 1.4, marginTop: 20, maxWidth: 360,
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

      <motion.div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-[8%]" style={{ marginTop: "-3%" }}
        variants={stagger} initial="hidden" animate="show"
      >
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
        <motion.div variants={fadeUp} className="flex items-center gap-8">
          {[
            { icon: "target", text: "Curadoria rigorosa" },
            { icon: "star", text: "Encontros com propósito" },
            { icon: "link", text: "Conexões que viram contratos" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-4 px-8 py-5 rounded-2xl" style={{
              background: "rgba(212,168,83,0.04)",
              border: "1px solid rgba(212,168,83,0.1)",
            }}>
              <Icon name={item.icon} size={24} />
              <span style={{ fontSize: 20, color: "var(--text-secondary)", fontWeight: 600, whiteSpace: "nowrap" }}>{item.text}</span>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </SlideBase>
  );
}

// ════════════════════════════════════════════════════════════════
// SLIDE 6 — PALESTRANTE / EXPERT (text left + image right)
// ════════════════════════════════════════════════════════════════
export function SlideExpert() {
  return (
    <SlideBase>
      {/* Background gradient */}
      <div className="absolute inset-0" style={{
        background: "radial-gradient(ellipse at 70% 50%, rgba(212,168,83,0.06), transparent 55%)"
      }} />
      <CornerAccent position="tl" />
      <CornerAccent position="br" />

      <motion.div className="relative z-10 flex items-center h-full px-[6%] gap-[4%]"
        variants={stagger} initial="hidden" animate="show"
      >
        {/* Left — text */}
        <div className="w-[45%] flex flex-col justify-center">
          <Label>Palestrante</Label>
          <motion.h2 variants={fadeUp} style={{
            fontFamily: FONT, fontSize: TYPE.hero, fontWeight: 700,
            color: "var(--text-primary)", lineHeight: 1.05, letterSpacing: "-0.03em",
            marginBottom: 16,
          }}>
            <span className="text-gradient-gold-shine">MALLAS BARBER</span>
          </motion.h2>

          <motion.p variants={fadeUp} style={{
            fontSize: TYPE.bodyLg, color: "var(--text-secondary)",
            lineHeight: 1.7, maxWidth: 520,
          }}>
            Empresário e palestrante.<br />
            Referência em posicionamento e networking.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-col gap-5 mt-10">
            {[
              { icon: "users", text: "+98 mil seguidores" },
              { icon: "star", text: "Presença em mídias (Band e SBT)" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 px-7 py-5 rounded-2xl" style={{
                background: "linear-gradient(160deg, rgba(212,168,83,0.06) 0%, rgba(0,0,0,0.3) 100%)",
                border: "1px solid rgba(212,168,83,0.12)",
                backdropFilter: "blur(12px)",
              }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 12, flexShrink: 0,
                  background: "linear-gradient(135deg, rgba(212,168,83,0.15), rgba(212,168,83,0.04))",
                  border: "1px solid rgba(212,168,83,0.2)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Icon name={item.icon} size={24} />
                </div>
                <span style={{ fontSize: 22, color: "var(--text-secondary)", fontWeight: 600 }}>{item.text}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right — image */}
        <motion.div variants={slideR} className="w-[45%] relative rounded-3xl overflow-hidden"
          style={{
            border: "1px solid rgba(212,168,83,0.12)",
            boxShadow: "0 0 60px rgba(212,168,83,0.06)",
            aspectRatio: "3/4",
          }}
        >
          <Image
            src="/images/expert - Mallas barber _ Carlos camilo2.png"
            alt="Mallas Barber"
            fill
            className="object-cover object-top"
          />
          {/* Gradient overlay bottom */}
          <div className="absolute inset-0" style={{
            background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 40%)",
          }} />
          {/* Gradient overlay left */}
          <div className="absolute inset-0" style={{
            background: "linear-gradient(to right, var(--bg-0) 0%, transparent 20%)",
          }} />
        </motion.div>
      </motion.div>
    </SlideBase>
  );
}

// ════════════════════════════════════════════════════════════════
// SLIDE 7 — SOLUÇÃO (split: text left + image right)
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

      <motion.div className="relative z-10 flex flex-col items-center justify-center h-full px-[4%]"
        variants={stagger} initial="hidden" animate="show"
      >
        {/* Top section — title + description centered */}
        <div className="text-center mb-12">
          <motion.h2 variants={fadeUp} style={{
            fontFamily: FONT, fontSize: TYPE.hero, fontWeight: 700,
            color: "var(--text-primary)", lineHeight: 1.05, letterSpacing: "-0.03em",
          }}>
            <span className="text-gradient-gold-shine">Rede de Valor</span>
          </motion.h2>
          <motion.p variants={fadeUp} style={{
            fontSize: TYPE.bodyLg, color: "var(--text-secondary)",
            lineHeight: 1.7, maxWidth: 640, marginTop: 20, marginLeft: "auto", marginRight: "auto",
          }}>
            Uma comunidade exclusiva onde cada membro foi selecionado
            por seu potencial de gerar valor real.
          </motion.p>
        </div>

        {/* Feature cards — 3 columns */}
        <div className="grid grid-cols-3 gap-7" style={{ maxWidth: 1300, width: "100%" }}>
          {features.map((item, i) => (
            <motion.div key={i} variants={fadeUp}
              className="relative overflow-hidden rounded-2xl p-8"
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
              <span className="absolute top-3 right-4 select-none pointer-events-none" style={{
                fontSize: 80, fontWeight: 800, color: "rgba(212,168,83,0.03)", lineHeight: 1,
              }}>0{i + 1}</span>

              <div style={{
                width: 56, height: 56, borderRadius: 12,
                background: "linear-gradient(135deg, rgba(212,168,83,0.15), rgba(212,168,83,0.04))",
                border: "1px solid rgba(212,168,83,0.2)",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 0 20px rgba(212,168,83,0.05)",
                marginBottom: 18,
              }}>
                <Icon name={item.icon} size={28} />
              </div>

              <h3 style={{ fontSize: 26, fontWeight: 700, color: "var(--gold)", marginBottom: 10 }}>{item.title}</h3>
              <p style={{ fontSize: 18, color: "var(--text-muted)", lineHeight: 1.6 }}>{item.desc}</p>

              <div className="absolute bottom-0 left-0 right-0 h-[2px]" style={{
                background: "linear-gradient(to right, transparent, rgba(212,168,83,0.12), transparent)",
              }} />
            </motion.div>
          ))}
        </div>

{/* Stats removidos */}
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

      <motion.div className="relative z-10 flex flex-col justify-center h-full px-[6%]" style={{ marginTop: "-4%" }}
        variants={stagger} initial="hidden" animate="show"
      >
        {/* Header centered */}
        <div className="text-center mb-10">
          <motion.h2 variants={fadeUp} style={{
            fontFamily: FONT, fontSize: TYPE.hero, fontWeight: 700,
            color: "var(--text-primary)", letterSpacing: "-0.03em",
          }}>
            Dois pilares.{" "}
            <span className="text-gradient-gold-shine">Um ecossistema.</span>
          </motion.h2>
        </div>

        {/* Two cards with + connector */}
        <div className="flex items-stretch justify-center gap-5" style={{ maxWidth: 1100, margin: "0 auto", width: "100%" }}>
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
              <Image src="/images/logo-rede-de-valor-branco-v2.png" alt="Rede de Valor" width={300} height={98} className="h-20 w-auto opacity-90" />
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
const staggerSlow = {
  hidden: {},
  show: { transition: { staggerChildren: 0.2, delayChildren: 0.3 } },
};

function Slide8() {
  return (
    <SlideBase>
      {/* 1. Background com profundidade — gradient mesh multi-layer */}
      <div className="absolute inset-0" style={{
        background: "radial-gradient(ellipse at 50% 40%, rgba(212,168,83,0.1) 0%, transparent 50%), radial-gradient(ellipse at 30% 70%, rgba(212,168,83,0.04) 0%, transparent 40%), radial-gradient(ellipse at 70% 30%, rgba(212,168,83,0.03) 0%, transparent 45%)"
      }} />
      <div className="absolute inset-0" style={{
        background: "radial-gradient(circle at 50% 45%, rgba(212,168,83,0.06), transparent 35%)",
      }} />
      <GoldDust />

      {/* 4. Linhas decorativas gold nos cantos (inspirado peritoempnl) */}
      <div className="absolute top-8 left-8 pointer-events-none" style={{ opacity: 0.15 }}>
        <div style={{ width: 80, height: 1, background: "linear-gradient(to right, var(--gold), transparent)" }} />
        <div style={{ width: 1, height: 80, background: "linear-gradient(to bottom, var(--gold), transparent)" }} />
      </div>
      <div className="absolute top-8 right-8 pointer-events-none" style={{ opacity: 0.15 }}>
        <div style={{ width: 80, height: 1, background: "linear-gradient(to left, var(--gold), transparent)", marginLeft: "auto" }} />
        <div style={{ width: 1, height: 80, background: "linear-gradient(to bottom, var(--gold), transparent)", marginLeft: "auto" }} />
      </div>
      <div className="absolute bottom-8 left-8 pointer-events-none" style={{ opacity: 0.15 }}>
        <div style={{ width: 1, height: 80, background: "linear-gradient(to top, var(--gold), transparent)" }} />
        <div style={{ width: 80, height: 1, background: "linear-gradient(to right, var(--gold), transparent)" }} />
      </div>
      <div className="absolute bottom-8 right-8 pointer-events-none" style={{ opacity: 0.15 }}>
        <div style={{ width: 1, height: 80, background: "linear-gradient(to top, var(--gold), transparent)", marginLeft: "auto" }} />
        <div style={{ width: 80, height: 1, background: "linear-gradient(to left, var(--gold), transparent)", marginLeft: "auto" }} />
      </div>

      <motion.div className="relative z-10 flex flex-col items-center justify-center h-full text-center"
        variants={staggerSlow} initial="hidden" animate="show"
      >
        {/* 2. Logo com halo glow dourado + breathing pulse */}
        <motion.div variants={scaleReveal} className="relative" style={{ marginBottom: -10 }}>
          {/* Halo glow */}
          <motion.div
            className="absolute inset-0"
            style={{
              filter: "blur(50px)",
              background: "rgba(212,168,83,0.15)",
              transform: "scale(2.2)",
              borderRadius: "50%",
            }}
            animate={{
              opacity: [0.5, 1, 0.5],
              scale: [2, 2.4, 2],
            }}
            transition={{
              duration: 4,
              ease: "easeInOut",
              repeat: Infinity,
            }}
          />
          <Image src="/images/logo-rede-de-valor-branco-v2.png" alt="Rede de Valor" width={320} height={105} className="relative" />
        </motion.div>

        {/* 4. Barra separadora animada (expande ao entrar) */}
        <motion.div
          className="mb-3"
          style={{ height: 2, background: "var(--gold)", borderRadius: 1 }}
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 100, opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
        />

        {/* 3. Título com text-shadow glow em "conexões" */}
        <motion.h2 variants={fadeUp} style={{
          fontFamily: FONT, fontSize: TYPE.main, fontWeight: 700,
          color: "var(--text-primary)", lineHeight: 1.15, letterSpacing: "-0.02em",
        }}>
          Onde <span style={{
            color: "var(--gold)",
            fontWeight: 700,
            textShadow: "0 0 30px rgba(212,168,83,0.5), 0 0 60px rgba(212,168,83,0.2)",
          }}>conexões</span> se tornam<br />
          negócios reais.
        </motion.h2>

        {/* Subtítulo maior */}
        <motion.p variants={fadeUp} style={{
          fontSize: "clamp(1.3rem, 2.2vw, 1.6rem)", color: "var(--text-secondary)",
          marginTop: 20, maxWidth: 600, lineHeight: 1.7,
        }}>
          Mais que uma comunidade. Um ecossistema vivo de oportunidades.
        </motion.p>
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
        <div className="flex flex-col w-[35%]">
          <Label>O Ecossistema</Label>
          <motion.h2 variants={fadeUp} style={{
            fontFamily: FONT, fontSize: TYPE.hero, fontWeight: 700,
            color: "var(--text-primary)", marginBottom: 28, letterSpacing: "-0.02em", lineHeight: 1.1,
          }}>
            Três camadas<br />de{" "}
            <span className="text-gradient-gold-shine">valor</span>
          </motion.h2>
          <motion.p variants={fadeUp} style={{
            fontSize: TYPE.bodyLg, color: "var(--text-secondary)", lineHeight: 1.7, maxWidth: 440,
          }}>
            Do acesso amplo ao inner circle exclusivo.
            Cada nível desbloqueia oportunidades maiores.
          </motion.p>
        </div>

        {/* Right rings — improved with connecting lines and icons */}
        <motion.div variants={scaleIn} className="relative" style={{ width: 580, height: 580 }}>
          {/* Radial glow behind */}
          <div className="absolute" style={{
            top: "50%", left: "50%", transform: "translate(-50%, -50%)",
            width: 380, height: 380, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(212,168,83,0.08) 0%, transparent 70%)",
          }} />

          {/* Outer ring */}
          <motion.div className="absolute rounded-full" style={{
            top: 0, left: 0, width: 580, height: 580,
            border: "1px solid rgba(212,168,83,0.12)",
            background: "radial-gradient(circle, transparent 60%, rgba(212,168,83,0.02) 100%)",
          }} animate={{ scale: [1, 1.015, 1] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} />
          <p className="absolute" style={{
            top: 18, left: "50%", transform: "translateX(-50%)",
            fontSize: 16, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.18em", whiteSpace: "nowrap", fontWeight: 600,
          }}>Comunidade Ampliada</p>
          {/* Outer ring small dots */}
          {[45, 135, 225, 315].map((deg, i) => (
            <motion.div key={`dot-o-${i}`} className="absolute rounded-full" style={{
              width: 6, height: 6, background: "rgba(212,168,83,0.2)",
              top: 290 + Math.sin(deg * Math.PI / 180) * 288,
              left: 290 + Math.cos(deg * Math.PI / 180) * 288,
              transform: "translate(-50%, -50%)",
            }} animate={{ opacity: [0.15, 0.5, 0.15] }} transition={{ duration: 3, repeat: Infinity, delay: i * 0.8 }} />
          ))}

          {/* Middle ring */}
          <motion.div className="absolute rounded-full" style={{
            top: 95, left: 95, width: 390, height: 390,
            border: "1.5px solid rgba(212,168,83,0.2)", background: "rgba(212,168,83,0.015)",
          }} animate={{ scale: [1, 1.02, 1] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }} />
          <p className="absolute" style={{
            top: 115, left: "50%", transform: "translateX(-50%)",
            fontSize: 16, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.18em", whiteSpace: "nowrap", fontWeight: 600,
          }}>Membros Ativos</p>

          {/* Inner ring — golden glow */}
          <motion.div className="absolute rounded-full" style={{
            top: 205, left: 205, width: 170, height: 170,
            border: "2px solid rgba(212,168,83,0.4)",
            background: "radial-gradient(circle, rgba(212,168,83,0.08) 0%, rgba(212,168,83,0.02) 100%)",
            boxShadow: "0 0 40px rgba(212,168,83,0.08), inset 0 0 30px rgba(212,168,83,0.04)",
          }} animate={{ scale: [1, 1.04, 1] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }} />
          <div className="absolute flex flex-col items-center justify-center text-center" style={{ top: 205, left: 205, width: 170, height: 170 }}>
            <Icon name="diamond" size={28} color="var(--gold)" />
            <p style={{ fontSize: 20, fontWeight: 700, color: "var(--gold)", lineHeight: 1.2, marginTop: 6 }}>Inner<br />Circle</p>
          </div>

          {/* Satellite labels with icons */}
          <div className="absolute flex items-center gap-3" style={{ top: 280, left: -120 }}>
            <Icon name="star" size={20} color="var(--gold-light)" />
            <p style={{ fontSize: 16, color: "var(--gold-light)", lineHeight: 1.3, fontWeight: 600 }}>Eventos<br />Exclusivos</p>
          </div>
          <div className="absolute flex items-center gap-3" style={{ top: 280, right: -130 }}>
            <p style={{ fontSize: 16, color: "var(--gold-light)", lineHeight: 1.3, fontWeight: 600, textAlign: "right" }}>Matchmaking<br />VIP</p>
            <Icon name="link" size={20} color="var(--gold-light)" />
          </div>
          <div className="absolute flex items-center gap-3" style={{ bottom: 35, left: "50%", transform: "translateX(-50%)" }}>
            <Icon name="users" size={20} color="var(--gold-light)" />
            <p style={{ fontSize: 16, color: "var(--gold-light)", whiteSpace: "nowrap", fontWeight: 600 }}>Networking Curado</p>
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
    { icon: "users", t: "Networking de alto nível" },
    { icon: "compass", t: "Podcast profissional" },
    { icon: "building", t: "Entrevista em rádio" },
    { icon: "book", t: "Cursos e treinamentos" },
    { icon: "calendar", t: "Eventos mensais" },
    { icon: "briefcase", t: "Projetos com investidores" },
    { icon: "rocket", t: "Experiências de negócios" },
  ];

  return (
    <SlideBase>
      <div className="absolute inset-0">
        <Image src="/images/benefits-bg.jpeg" alt="" fill className="object-cover" style={{ opacity: 0.15 }} />
        <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.88)" }} />
      </div>

      <motion.div className="relative z-10 flex flex-col items-center justify-center h-full px-[6%]" style={{ marginTop: "-3%" }}
        variants={stagger} initial="hidden" animate="show"
      >
        <motion.h2 variants={fadeUp} style={{
          fontFamily: FONT, fontSize: TYPE.main, fontWeight: 700,
          color: "var(--text-primary)", marginBottom: 36, letterSpacing: "-0.02em", textAlign: "center",
        }}>
          O que você{" "}
          <span className="text-gradient-gold-shine">recebe</span>
        </motion.h2>

        <div className="grid grid-cols-4 gap-4" style={{ maxWidth: 1100, margin: "0 auto" }}>
          {benefits.map((b, i) => (
            <motion.div key={i} variants={fadeUp}
              className="flex items-center gap-4 rounded-2xl p-5"
              style={{
                background: "linear-gradient(160deg, rgba(212,168,83,0.06) 0%, rgba(0,0,0,0.3) 100%)",
                border: "1px solid rgba(212,168,83,0.1)",
                backdropFilter: "blur(12px)",
                gridColumn: i >= 4 ? "span 1" : undefined,
              }}
              whileHover={{
                borderColor: "rgba(212,168,83,0.25)",
                boxShadow: "0 0 30px rgba(212,168,83,0.06)",
                y: -2,
              }}
            >
              <div style={{
                width: 42, height: 42, borderRadius: 10, flexShrink: 0,
                background: "linear-gradient(135deg, rgba(212,168,83,0.12), rgba(212,168,83,0.03))",
                border: "1px solid rgba(212,168,83,0.15)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Icon name={b.icon} size={20} />
              </div>
              <h4 style={{ fontSize: 17, fontWeight: 600, color: "var(--text-primary)", lineHeight: 1.3 }}>{b.t}</h4>
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
  const cards = [
    { icon: "users", title: "Empresários selecionados", desc: "Conexões com quem está em movimento" },
    { icon: "diamond", title: "Oportunidades reais", desc: "Negócios nascem de conexões certas" },
    { icon: "calendar", title: "Encontros estratégicos", desc: "Ambiente pensado para crescimento" },
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
        <motion.h2 variants={fadeUp} style={{
          fontFamily: FONT, fontSize: TYPE.main, fontWeight: 700,
          color: "var(--text-primary)", marginBottom: 16, letterSpacing: "-0.03em", lineHeight: 1.1,
        }}>
          O valor não está no acesso.<br />
          Está no{" "}<span className="text-gradient-gold-shine">ambiente.</span>
        </motion.h2>

        <motion.p variants={fadeUp} style={{
          fontSize: TYPE.body, color: "var(--text-muted)", marginBottom: 40, maxWidth: 600, lineHeight: 1.6,
        }}>
          Estamos construindo uma rede com foco em conexões reais, crescimento e geração de oportunidades.
        </motion.p>

        {/* Cards */}
        <div className="grid grid-cols-3 gap-5 w-full" style={{ maxWidth: 1000 }}>
          {cards.map((c, i) => (
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
                <Icon name={c.icon} size={22} />
              </div>

              {/* Title */}
              <p style={{
                fontSize: 22, fontWeight: 700,
                color: "var(--gold)", lineHeight: 1.2,
              }}>{c.title}</p>

              {/* Description */}
              <p style={{
                fontSize: 15, color: "var(--text-muted)", marginTop: 10, lineHeight: 1.5,
              }}>{c.desc}</p>

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
// SLIDE 12 — ÂNCORA DE PREÇO (valor separado)
// ════════════════════════════════════════════════════════════════
function SlideAncora() {
  return (
    <SlideBase>
      <div className="absolute inset-0" style={{
        background: "radial-gradient(ellipse 50% 50% at 50% 45%, rgba(212,168,83,0.06), transparent)"
      }} />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <svg width="500" height="500" viewBox="0 0 500 500" fill="none" style={{ opacity: 0.04 }}>
          <path d="M250 25L475 250L250 475L25 250Z" stroke="var(--gold)" strokeWidth="1.5" />
        </svg>
      </div>
      <CornerAccent position="tl" />
      <CornerAccent position="br" />

      <motion.div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-[6%]"
        variants={stagger} initial="hidden" animate="show"
      >
        <motion.h2 variants={fadeUp} style={{
          fontFamily: FONT, fontSize: TYPE.main, fontWeight: 700,
          color: "var(--text-primary)", lineHeight: 1.15, letterSpacing: "-0.02em",
          maxWidth: 800,
        }}>
          Se você fosse pagar por<br />tudo isso{" "}
          <span className="text-gradient-gold-shine">separadamente…</span>
        </motion.h2>

        <motion.div variants={scaleIn} className="mt-10 mb-6">
          <p style={{
            fontSize: "clamp(4rem, 8vw, 6.5rem)", fontWeight: 700,
            lineHeight: 1, letterSpacing: "-0.03em",
            background: "linear-gradient(180deg, var(--gold-light) 0%, var(--gold) 50%, var(--gold-dark) 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            filter: "drop-shadow(0 0 40px rgba(212,168,83,0.2))",
          }}>R$ 15.500</p>
        </motion.div>

        <motion.div variants={fadeUp} style={{ width: 60, height: 2, background: "var(--gold)", borderRadius: 1, opacity: 0.3, marginBottom: 20 }} />

        <motion.p variants={fadeUp} style={{
          fontSize: TYPE.bodyLg, color: "var(--text-muted)",
          lineHeight: 1.7, fontStyle: "italic",
        }}>
          (E isso sem contar o valor das conexões)
        </motion.p>
      </motion.div>
    </SlideBase>
  );
}

// ════════════════════════════════════════════════════════════════
// SLIDE 13 — PREÇO (urgency card centered + bg photo)
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

      <motion.div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-[6%]"
        variants={stagger} initial="hidden" animate="show"
      >
        <motion.h2 variants={fadeUp} style={{
          fontFamily: FONT, fontSize: TYPE.center, fontWeight: 700,
          color: "var(--text-primary)", lineHeight: 1.15, letterSpacing: "-0.02em",
          marginBottom: 8,
        }}>
          Mas você não vai pagar isso.
        </motion.h2>

        <motion.p variants={fadeUp} style={{
          fontSize: TYPE.bodyLg, color: "var(--text-muted)", marginBottom: 32,
        }}>
          Hoje…
        </motion.p>

        <motion.p variants={fadeUp} style={{
          fontSize: TYPE.body, color: "var(--text-secondary)", marginBottom: 16,
        }}>
          Você pode fazer parte por:
        </motion.p>

        <motion.div variants={scaleIn} className="urgency-card px-14 py-12 text-center" style={{ maxWidth: 580 }}>
          <div className="urgency-shimmer" />
          <p style={{ fontSize: "clamp(3.5rem, 7vw, 5rem)", fontWeight: 700, lineHeight: 1, letterSpacing: "-0.03em" }}>
            <span className="text-gradient-gold-shine">R$ 5.000</span>
          </p>

          <div className="flex items-center justify-center gap-6 mt-6">
            <div style={{ width: 40, height: 1, background: "rgba(212,168,83,0.2)" }} />
            <span style={{ fontSize: 14, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.15em", fontWeight: 600 }}>ou</span>
            <div style={{ width: 40, height: 1, background: "rgba(212,168,83,0.2)" }} />
          </div>

          <div className="flex items-center justify-center gap-8 mt-5">
            <div className="flex flex-col items-center">
              <p style={{ fontSize: 28, fontWeight: 700, color: "var(--gold)", lineHeight: 1 }}>12x</p>
              <p style={{ fontSize: 14, color: "var(--text-muted)", marginTop: 4 }}>de <span style={{ color: "var(--text-secondary)", fontWeight: 600 }}>R$ 482</span></p>
            </div>
            <div style={{ width: 1, height: 40, background: "rgba(212,168,83,0.15)" }} />
            <div className="flex flex-col items-center">
              <p style={{ fontSize: 28, fontWeight: 700, color: "var(--gold)", lineHeight: 1 }}>18x</p>
              <p style={{ fontSize: 14, color: "var(--text-muted)", marginTop: 4 }}>de <span style={{ color: "var(--text-secondary)", fontWeight: 600 }}>R$ 342</span></p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </SlideBase>
  );
}

// ════════════════════════════════════════════════════════════════
// SLIDE 13 — URGÊNCIA (centered layout, counter as hero)
// ════════════════════════════════════════════════════════════════
function Slide13() {
  return (
    <SlideBase>
      <div className="absolute inset-0">
        <Image src="/images/cta-bg.jpeg" alt="" fill className="object-cover" />
        <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.9)" }} />
      </div>
      <div className="absolute inset-0" style={{
        background: "radial-gradient(ellipse 50% 50% at 50% 45%, rgba(212,168,83,0.06), transparent)"
      }} />
      <CornerAccent position="tl" />
      <CornerAccent position="br" />

      <motion.div className="relative z-10 flex flex-col items-center justify-center h-full px-[6%] text-center"
        variants={stagger} initial="hidden" animate="show"
      >
        <motion.h2 variants={fadeUp} style={{
          fontFamily: FONT, fontSize: TYPE.main, fontWeight: 700,
          color: "var(--text-primary)", lineHeight: 1.15, letterSpacing: "-0.02em",
          marginBottom: 24,
        }}>
          Mas sendo justo com<br />quem está aqui{" "}
          <span className="text-gradient-gold-shine">hoje…</span>
        </motion.h2>

        <motion.div variants={fadeUp} style={{ width: 60, height: 2, background: "var(--gold)", borderRadius: 1, opacity: 0.3, marginBottom: 28 }} />

        <motion.p variants={fadeUp} style={{
          fontSize: TYPE.bodyLg, color: "var(--text-secondary)",
          lineHeight: 1.7, maxWidth: 500, marginBottom: 12,
        }}>
          Essa condição é{" "}
          <span style={{ color: "var(--gold)", fontWeight: 700 }}>exclusiva.</span>
        </motion.p>

        <motion.p variants={fadeUp} style={{
          fontSize: TYPE.bodyLg, color: "var(--text-muted)",
          lineHeight: 1.7, maxWidth: 500, marginBottom: 8,
        }}>
          Depois desse evento…
        </motion.p>

        <motion.p variants={fadeUp} style={{
          fontSize: TYPE.center, fontWeight: 700,
          color: "var(--text-primary)", letterSpacing: "-0.02em",
        }}>
          isso{" "}
          <span style={{ color: "var(--gold)", fontWeight: 700 }}>muda.</span>
        </motion.p>
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

      <motion.div className="relative z-10 flex flex-col justify-center h-full px-[6%]" style={{ marginTop: "-3%" }}
        variants={stagger} initial="hidden" animate="show"
      >
        <div className="text-center mb-10">
          <motion.h2 variants={fadeUp} style={{
            fontFamily: FONT, fontSize: TYPE.center, fontWeight: 700,
            color: "var(--text-primary)", letterSpacing: "-0.02em",
          }}>
            Dois caminhos.{" "}
            <span className="text-gradient-gold-shine">Um resultado.</span>
          </motion.h2>
        </div>

        <div className="flex items-stretch justify-center gap-0 mx-auto" style={{ maxWidth: 950 }}>
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

          {/* Center divider with "VS" — larger, more prominent */}
          <div className="relative z-20 flex items-center" style={{ width: 0 }}>
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2" style={{
              width: 52, height: 52, borderRadius: "50%",
              background: "linear-gradient(135deg, rgba(212,168,83,0.15), var(--bg-0))",
              border: "2px solid rgba(212,168,83,0.4)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 0 30px rgba(212,168,83,0.12), 0 0 60px rgba(0,0,0,0.5)",
              zIndex: 30,
            }}>
              <span style={{ fontSize: 13, fontWeight: 800, color: "var(--gold)", letterSpacing: "0.08em" }}>VS</span>
            </div>
          </div>

          {/* "Com" card — elevated, premium, glowing */}
          <motion.div variants={slideR} className="flex-1 p-8 rounded-r-2xl relative overflow-hidden" style={{
            background: "linear-gradient(160deg, rgba(212,168,83,0.1) 0%, rgba(212,168,83,0.02) 100%)",
            border: "1px solid rgba(212,168,83,0.25)",
            boxShadow: "0 0 60px rgba(212,168,83,0.08), inset 0 1px 0 rgba(212,168,83,0.2)",
          }}>
            {/* Gold shimmer top */}
            <div className="absolute top-0 left-0 right-0 h-[1px]" style={{
              background: "linear-gradient(to right, transparent, rgba(212,168,83,0.5), transparent)",
            }} />

            {/* Watermark */}
            <span className="absolute top-3 right-4 select-none pointer-events-none" style={{
              fontSize: 72, fontWeight: 800, color: "rgba(212,168,83,0.04)", lineHeight: 1,
            }}>RV</span>

            <div className="flex items-center gap-3 mb-6">
              <div style={{
                width: 36, height: 36, borderRadius: 8,
                background: "linear-gradient(135deg, rgba(212,168,83,0.2), rgba(212,168,83,0.08))",
                border: "1px solid rgba(212,168,83,0.25)",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 0 15px rgba(212,168,83,0.08)",
              }}>
                <Icon name="diamond" size={16} />
              </div>
              <p style={{ fontSize: 15, fontWeight: 700, color: "var(--gold)", textTransform: "uppercase", letterSpacing: "0.2em" }}>Com a Rede de Valor</p>
            </div>

            <ul className="space-y-4">
              {withItems.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="flex-shrink-0 mt-0.5">
                    <circle cx="10" cy="10" r="9" stroke="rgba(212,168,83,0.25)" strokeWidth="1"/>
                    <path d="M6 10L9 13L14 7" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span style={{ fontSize: 16, color: "var(--text-secondary)", lineHeight: 1.5, fontWeight: 500 }}>{item}</span>
                </li>
              ))}
            </ul>

            {/* Bottom accent */}
            <div className="absolute bottom-0 left-0 right-0 h-[2px]" style={{
              background: "linear-gradient(to right, transparent, rgba(212,168,83,0.3), transparent)",
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
// SLIDE — PERGUNTA FINAL (breathing slide antes do CTA)
// ════════════════════════════════════════════════════════════════
function SlidePergunta() {
  return (
    <SlideBase>
      <div className="absolute inset-0" style={{
        background: "radial-gradient(ellipse 50% 50% at 50% 45%, rgba(212,168,83,0.05), transparent)"
      }} />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <svg width="500" height="500" viewBox="0 0 500 500" fill="none" style={{ opacity: 0.03 }}>
          <path d="M250 25L475 250L250 475L25 250Z" stroke="var(--gold)" strokeWidth="1.5" />
          <path d="M250 75L425 250L250 425L75 250Z" stroke="var(--gold)" strokeWidth="0.8" />
        </svg>
      </div>
      <CornerAccent position="tl" />
      <CornerAccent position="br" />

      <motion.div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-[8%]"
        variants={stagger} initial="hidden" animate="show"
      >
        <motion.p variants={fadeUp} style={{
          fontSize: TYPE.bodyLg, color: "var(--text-muted)",
          marginBottom: 20,
        }}>
          A pergunta não é o valor.
        </motion.p>

        <motion.h2 variants={fadeUp} style={{
          fontFamily: FONT, fontSize: TYPE.main, fontWeight: 700,
          color: "var(--text-primary)", lineHeight: 1.15, letterSpacing: "-0.02em",
          maxWidth: 800,
        }}>
          É: Você quer continuar{" "}
          <span style={{ color: "var(--text-muted)", fontWeight: 700 }}>sozinho…</span><br />
          ou crescer com as{" "}
          <span className="text-gradient-gold-shine">pessoas certas?</span>
        </motion.h2>
      </motion.div>
    </SlideBase>
  );
}

// ════════════════════════════════════════════════════════════════
// SLIDE — CTA FINAL (photo + diamond + button)
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

      <motion.div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-[6%]" style={{ marginTop: "-3%" }}
        variants={stagger} initial="hidden" animate="show"
      >
        {/* Logo with glow */}
        <motion.div variants={scaleReveal} className="mb-2 relative">
          <div className="absolute inset-0" style={{
            filter: "blur(40px)", background: "rgba(212,168,83,0.12)",
            transform: "scale(2)", borderRadius: "50%",
          }} />
          <Image src="/images/logo-rede-de-valor-branco-v2.png" alt="Rede de Valor" width={240} height={78} className="relative h-[70px] w-auto" />
        </motion.div>

        {/* Separator */}
        <motion.div variants={fadeUp} style={{ width: 60, height: 2, background: "var(--gold)", borderRadius: 1, marginBottom: 10, opacity: 0.4 }} />

        <motion.h2 variants={fadeUp} style={{
          fontFamily: FONT, fontSize: TYPE.main, fontWeight: 700,
          color: "var(--text-primary)", lineHeight: 1.15, letterSpacing: "-0.02em",
          marginBottom: 32,
        }}>
          Agora é o{" "}
          <span className="text-gradient-gold-shine">momento.</span>
        </motion.h2>

        <motion.div variants={fadeUp} className="flex flex-col gap-5">
          {[
            "Faça seu cadastro",
            "Fale com o time",
            "Garanta sua vaga",
          ].map((text, i) => (
            <div key={i} className="flex items-center gap-4">
              <div style={{
                width: 40, height: 40, borderRadius: 10,
                background: "linear-gradient(135deg, rgba(212,168,83,0.15), rgba(212,168,83,0.05))",
                border: "1px solid rgba(212,168,83,0.2)",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 0 20px rgba(212,168,83,0.06)",
              }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8L7 12L13 4" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span style={{ fontSize: 22, color: "var(--text-primary)", fontWeight: 600 }}>{text}</span>
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
  8: () => <Slide9 />,
  9: () => <Slide10 />,
  10: ({ active }) => <Slide11 active={active} />,
  11: () => <SlideAncora />,
  12: () => <Slide12 />,
  13: () => <Slide13 />,
  14: () => <Slide14 />,
  15: () => <SlidePergunta />,
  16: () => <Slide15 />,
};

// ════════════════════════════════════════════════════════════════
// MAIN — APRESENTAÇÃO
// ════════════════════════════════════════════════════════════════
export default function Apresentacao() {
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
          <button onClick={toggleFullscreen}
            className="ml-4 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
            aria-label={isFullscreen ? "Sair da tela cheia" : "Tela cheia"}
            title={isFullscreen ? "Sair da tela cheia (F)" : "Tela cheia (F)"}
          >
            {isFullscreen ? (
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M5 1v3H1M9 1v3h4M5 13v-3H1M9 13v-3h4" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M1 5V1h4M9 1h4v4M1 9v4h4M13 9v4H9" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
