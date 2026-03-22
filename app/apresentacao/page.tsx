"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

// ─── CONSTANTS ───
const TOTAL = 15;
const GOLD = "#D4A853";
const GOLD_L = "#E8C97A";
const GOLD_D = "#B8903A";

// ─── ANIMATION VARIANTS ───
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.13, delayChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 28, filter: "blur(4px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.7, ease: "easeOut" } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

// ─── HOOKS ───
function useAnimatedCounter(target: number, duration = 1800, active = true) {
  const [val, setVal] = useState(0);
  const ref = useRef<number | null>(null);

  useEffect(() => {
    if (!active) { setVal(0); return; }
    const start = performance.now();
    const animate = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setVal(Math.round(eased * target));
      if (t < 1) ref.current = requestAnimationFrame(animate);
    };
    ref.current = requestAnimationFrame(animate);
    return () => { if (ref.current) cancelAnimationFrame(ref.current); };
  }, [target, duration, active]);

  return val;
}

// ─── DECORATIVE COMPONENTS ───

function Particles() {
  const particles = [
    { x: "12%", y: "18%", s: 4, d: 0 }, { x: "85%", y: "22%", s: 3, d: 1.2 },
    { x: "7%", y: "72%", s: 3, d: 2.1 }, { x: "92%", y: "65%", s: 4, d: 0.6 },
    { x: "45%", y: "8%", s: 2, d: 3.0 }, { x: "68%", y: "88%", s: 3, d: 1.8 },
    { x: "25%", y: "45%", s: 2, d: 2.5 }, { x: "78%", y: "40%", s: 3, d: 0.3 },
  ];
  return (
    <>
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: p.x, top: p.y, width: p.s, height: p.s,
            background: `radial-gradient(circle, ${GOLD}, transparent)`,
          }}
          animate={{ opacity: [0.15, 0.6, 0.15], y: [0, -12, 0], x: [0, 4, 0] }}
          transition={{ duration: 5 + p.d, repeat: Infinity, ease: "easeInOut", delay: p.d }}
        />
      ))}
    </>
  );
}

function MeshGradient() {
  return (
    <motion.div
      className="absolute inset-0 pointer-events-none opacity-40"
      animate={{
        background: [
          "radial-gradient(ellipse 60% 50% at 30% 40%, rgba(212,168,83,0.04) 0%, transparent 70%)",
          "radial-gradient(ellipse 60% 50% at 70% 60%, rgba(212,168,83,0.06) 0%, transparent 70%)",
          "radial-gradient(ellipse 60% 50% at 30% 40%, rgba(212,168,83,0.04) 0%, transparent 70%)",
        ],
      }}
      transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

function SubtleRing({ size = 300, opacity = 0.06, cx = "50%", cy = "50%" }: { size?: number; opacity?: number; cx?: string; cy?: string }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: size, height: size, left: cx, top: cy,
        transform: "translate(-50%, -50%)",
        border: `1px solid rgba(212, 168, 83, ${opacity})`,
      }}
      animate={{ scale: [1, 1.03, 1], opacity: [opacity, opacity * 1.4, opacity] }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

function DiamondShape({ size = 200, opacity = 0.06, cx = "30%", cy = "30%" }: { size?: number; opacity?: number; cx?: string; cy?: string }) {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        width: size, height: size, left: cx, top: cy,
        transform: "translate(-50%, -50%) rotate(45deg)",
        border: `1px solid rgba(212, 168, 83, ${opacity})`,
      }}
      animate={{ rotate: [45, 47, 45], scale: [1, 1.02, 1] }}
      transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

function GoldDiamond() {
  return (
    <motion.div
      style={{ width: 12, height: 12, background: `linear-gradient(135deg, ${GOLD_L}, ${GOLD}, ${GOLD_D})`, transform: "rotate(45deg)" }}
      animate={{ scale: [1, 1.15, 1], opacity: [0.8, 1, 0.8] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

function DiamondDivider() {
  return (
    <motion.div className="flex items-center justify-center gap-3" variants={fadeIn}>
      <div className="w-16 h-[1px] bg-gradient-to-r from-transparent to-[#D4A853]/50" />
      <GoldDiamond />
      <div className="w-16 h-[1px] bg-gradient-to-l from-transparent to-[#D4A853]/50" />
    </motion.div>
  );
}

function LineDivider({ width = "w-20" }: { width?: string }) {
  return (
    <motion.div className="flex justify-center" variants={fadeIn}>
      <div
        className={`${width} h-[2px] rounded-full`}
        style={{ background: `linear-gradient(90deg, ${GOLD}33, ${GOLD}, ${GOLD}33)` }}
      />
    </motion.div>
  );
}

function GlowCard({ children, className = "", glow = false }: { children: React.ReactNode; className?: string; glow?: boolean }) {
  return (
    <motion.div
      className={`relative rounded-2xl overflow-hidden ${className}`}
      variants={scaleIn}
      style={{
        background: "linear-gradient(160deg, rgba(18,17,14,0.9), rgba(10,10,8,0.95))",
        boxShadow: glow
          ? `0 0 60px rgba(212,168,83,0.06), 0 0 120px rgba(212,168,83,0.03), inset 0 1px 0 rgba(212,168,83,0.08)`
          : `inset 0 1px 0 rgba(212,168,83,0.06)`,
      }}
    >
      {/* Animated border */}
      <div className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{ border: "1px solid rgba(212,168,83,0.1)" }} />
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#D4A853]/20 to-transparent" />
      {children}
    </motion.div>
  );
}

function ShimmerText({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.span
      className={className}
      style={{
        background: `linear-gradient(135deg, ${GOLD_D} 0%, ${GOLD_L} 25%, #fff8e7 50%, ${GOLD_L} 75%, ${GOLD_D} 100%)`,
        backgroundSize: "300% auto",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        animation: "shine 5s ease-in-out infinite",
      }}
      variants={fadeUp}
    >
      {children}
    </motion.span>
  );
}

function Badge({ text }: { text: string }) {
  return (
    <motion.div
      className="inline-block px-5 py-2 rounded-full"
      style={{ border: "1px solid rgba(212,168,83,0.25)", background: "rgba(212,168,83,0.04)" }}
      variants={fadeUp}
    >
      <span className="text-[11px] tracking-[0.25em] text-[#D4A853] font-semibold uppercase">{text}</span>
    </motion.div>
  );
}

function LabelDivider({ text }: { text: string }) {
  return (
    <motion.div className="flex items-center justify-center gap-3" variants={fadeUp}>
      <div className="w-12 h-[1px] bg-[#D4A853]/30" />
      <span className="text-[11px] tracking-[0.3em] text-[#D4A853]/70 font-semibold uppercase">{text}</span>
      <div className="w-12 h-[1px] bg-[#D4A853]/30" />
    </motion.div>
  );
}

// ─── SLIDES ───

function Slide1() {
  return (
    <div className="flex flex-col items-center justify-center h-full relative overflow-hidden">
      {/* ── Background layers ── */}
      <Particles />
      <MeshGradient />

      {/* Vignette */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 80% 70% at 50% 50%, transparent 40%, rgba(0,0,0,0.5) 100%)" }} />

      {/* Gold aura behind title */}
      <div className="absolute pointer-events-none animate-pulse"
        style={{
          width: "60%", height: "40%", left: "20%", top: "28%",
          background: "radial-gradient(ellipse at center, rgba(212,168,83,0.08) 0%, rgba(212,168,83,0.02) 50%, transparent 75%)",
          animationDuration: "6s",
        }} />

      {/* Subtle grid pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(212,168,83,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(212,168,83,0.3) 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
        }} />

      {/* ── Corner accents ── */}
      <div className="absolute top-5 left-5 pointer-events-none">
        <div className="w-16 h-[1px]" style={{ background: "linear-gradient(90deg, rgba(212,168,83,0.35), transparent)" }} />
        <div className="h-16 w-[1px]" style={{ background: "linear-gradient(180deg, rgba(212,168,83,0.35), transparent)" }} />
      </div>
      <div className="absolute top-5 right-5 pointer-events-none flex flex-col items-end">
        <div className="w-16 h-[1px]" style={{ background: "linear-gradient(270deg, rgba(212,168,83,0.35), transparent)" }} />
        <div className="h-16 w-[1px] self-end" style={{ background: "linear-gradient(180deg, rgba(212,168,83,0.35), transparent)" }} />
      </div>
      <div className="absolute bottom-5 left-5 pointer-events-none">
        <div className="h-16 w-[1px]" style={{ background: "linear-gradient(0deg, rgba(212,168,83,0.35), transparent)" }} />
        <div className="w-16 h-[1px] absolute bottom-0" style={{ background: "linear-gradient(90deg, rgba(212,168,83,0.35), transparent)" }} />
      </div>
      <div className="absolute bottom-5 right-5 pointer-events-none flex flex-col items-end">
        <div className="h-16 w-[1px] self-end" style={{ background: "linear-gradient(0deg, rgba(212,168,83,0.35), transparent)" }} />
        <div className="w-16 h-[1px] absolute bottom-0 right-0" style={{ background: "linear-gradient(270deg, rgba(212,168,83,0.35), transparent)" }} />
      </div>

      {/* ── Content — centered block with consistent 24px rhythm ── */}
      <div className="relative z-10 flex flex-col items-center justify-center gap-6">
        {/* Logos */}
        <div className="flex items-center gap-4">
          <img src="/images/logo-rede-de-valor-branco-v2.png" alt="Rede de Valor" className="h-10 sm:h-12 w-auto object-contain opacity-70" />
          <span className="text-white/30 text-lg font-light">+</span>
          <img src="/images/logo-time-v2.png" alt="TIME" className="h-7 sm:h-8 w-auto object-contain opacity-70" />
        </div>

        {/* Label */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-[1px]" style={{ background: "linear-gradient(90deg, transparent, rgba(212,168,83,0.4))" }} />
          <span className="text-[10px] tracking-[0.45em] font-semibold uppercase" style={{ color: "rgba(212,168,83,0.45)" }}>
            Apresenta&#231;&#227;o Exclusiva
          </span>
          <div className="w-8 h-[1px]" style={{ background: "linear-gradient(270deg, transparent, rgba(212,168,83,0.4))" }} />
        </div>

        {/* Title */}
        <h1 className="text-center leading-[0.88]">
          <ShimmerText className="block text-[clamp(52px,9.5vw,104px)] font-extrabold tracking-[-0.03em]">
            REDE DE VALOR
          </ShimmerText>
          <span className="block text-[clamp(36px,6vw,72px)] font-bold text-white/90 mt-1">
            + TIME
          </span>
        </h1>

        {/* Line divider */}
        <div className="w-20 h-[1px]" style={{ background: "linear-gradient(90deg, transparent, rgba(212,168,83,0.4), transparent)" }} />

        {/* Subtitle */}
        <p className="text-[clamp(15px,1.8vw,21px)] font-light tracking-[0.04em]" style={{ color: "rgba(154,145,133,0.8)" }}>
          Um novo n&#237;vel de networking
        </p>
      </div>

    </div>
  );
}

function Slide2() {
  return (
    <motion.div className="flex items-center justify-center h-full relative overflow-hidden" variants={stagger} initial="hidden" animate="show">
      {/* ── Background: spotlight from top ── */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 40% 55% at 50% 0%, rgba(212,168,83,0.07) 0%, transparent 100%)" }} />
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 80% 80% at 50% 100%, rgba(0,0,0,0.6) 0%, transparent 60%)" }} />

      {/* Vertical gold line — left accent */}
      <motion.div
        className="absolute left-[12%] top-[15%] bottom-[15%] w-[1px] pointer-events-none"
        style={{ background: "linear-gradient(180deg, transparent, rgba(212,168,83,0.2) 30%, rgba(212,168,83,0.2) 70%, transparent)" }}
        variants={fadeIn}
      />

      {/* ── Content: left-aligned, centered in slide ── */}
      <div className="relative z-10 flex flex-col gap-8 px-12 sm:px-20 max-w-4xl w-full">
        {/* Intro */}
        <motion.p
          className="text-[clamp(15px,1.8vw,21px)] font-light italic"
          style={{ color: "rgba(154,145,133,0.7)" }}
          variants={fadeUp}
        >
          Se voc&#234; est&#225; aqui...
        </motion.p>

        {/* Main statement */}
        <motion.h2 className="leading-[1.0]" variants={fadeUp}>
          <span className="block text-[clamp(44px,7.5vw,88px)] font-extrabold text-white tracking-[-0.02em]">
            Voc&#234; n&#227;o est&#225;
          </span>
          <span className="block text-[clamp(44px,7.5vw,88px)] font-extrabold tracking-[-0.02em]" style={{ color: GOLD }}>
            aqui por acaso.
          </span>
        </motion.h2>

        {/* Gold accent line */}
        <motion.div className="flex items-center gap-0" variants={fadeIn}>
          <div className="w-20 h-[2px]" style={{ background: `linear-gradient(90deg, ${GOLD}, transparent)` }} />
        </motion.div>

        {/* Closing */}
        <motion.p
          className="text-[clamp(18px,2.2vw,26px)] font-medium leading-relaxed max-w-lg"
          style={{ color: "rgba(232,201,122,0.8)" }}
          variants={fadeUp}
        >
          &#201; porque voc&#234; sabe que pode ir<br />
          <span className="font-bold text-white">muito al&#233;m.</span>
        </motion.p>
      </div>

      {/* Right decorative diamond shape */}
      <DiamondShape size={180} opacity={0.04} cx="85%" cy="55%" />
      <DiamondShape size={100} opacity={0.03} cx="90%" cy="35%" />
    </motion.div>
  );
}

function Slide3() {
  return (
    <motion.div className="flex flex-col items-center justify-center h-full relative overflow-hidden" variants={stagger} initial="hidden" animate="show">
      {/* ── Background: dark, heavy vignette — oppressive mood ── */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 60% 50% at 50% 50%, transparent 20%, rgba(0,0,0,0.7) 100%)" }} />

      {/* Giant "TRAVA" watermark behind content */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none -mt-16"
        variants={fadeIn}
      >
        <span
          className="text-[clamp(100px,19vw,230px)] font-black uppercase tracking-[-0.04em]"
          style={{ color: "rgba(255,255,255,0.02)" }}
        >
          TRAVA
        </span>
      </motion.div>

      {/* Concentric rings — "trapped" metaphor */}
      <SubtleRing size={420} opacity={0.04} cx="50%" cy="50%" />
      <SubtleRing size={280} opacity={0.05} cx="50%" cy="50%" />
      <SubtleRing size={140} opacity={0.06} cx="50%" cy="50%" />

      {/* ── Content ── */}
      <div className="relative z-10 flex flex-col items-center justify-center gap-7 px-8">
        {/* Title */}
        <motion.h2 className="text-center leading-[1.0]" variants={fadeUp}>
          <span className="block text-[clamp(20px,2.5vw,30px)] font-light text-[#9A9185] tracking-wide mb-3">
            A maioria dos empres&#225;rios
          </span>
          <span className="block text-[clamp(64px,12vw,140px)] font-black text-white tracking-[-0.04em]">
            trava.
          </span>
        </motion.h2>

        {/* Explanation — two lines with contrast */}
        <motion.div className="text-center space-y-2 mt-6" variants={fadeUp}>
          <p className="text-[clamp(16px,2vw,24px)] text-[#5A544C] font-light">
            N&#227;o por falta de esfor&#231;o.
          </p>
          <p className="text-[clamp(18px,2.2vw,26px)] font-semibold" style={{ color: GOLD }}>
            Por falta de ambiente.
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}

function Slide4() {
  return (
    <motion.div className="flex flex-col items-center justify-center h-full relative overflow-hidden" variants={stagger} initial="hidden" animate="show">
      {/* ── Background: soft centered glow ── */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 70% 60% at 50% 40%, rgba(212,168,83,0.04) 0%, transparent 100%)" }} />

      {/* ── Content ── */}
      <div className="relative z-10 flex flex-col items-center gap-10 px-8 w-full max-w-4xl">
        {/* Title */}
        <motion.h2 className="text-center" variants={fadeUp}>
          <span className="text-[clamp(38px,6.5vw,72px)] font-bold text-white">Voc&#234; se </span>
          <span className="text-[clamp(38px,6.5vw,72px)] font-bold" style={{ color: GOLD }}>identifica?</span>
        </motion.h2>

        {/* Three columns */}
        <motion.div className="grid grid-cols-3 gap-5 w-full" variants={stagger}>
          {[
            { title: "Esfor\u00E7o sem retorno", text: "Trabalha muito, mas n\u00E3o cresce como poderia",
              svg: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="19" x2="12" y2="9" /><polyline points="8 13 12 9 16 13" /><line x1="5" y1="5" x2="19" y2="5" /></svg> },
            { title: "Rede limitada", text: "Conhece poucas pessoas estrat\u00E9gicas",
              svg: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg> },
            { title: "Potencial travado", text: "Sente que poderia estar em outro n\u00EDvel",
              svg: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg> },
          ].map((item, i) => (
            <motion.div
              key={i}
              className="flex flex-col items-center text-center gap-4 px-5 py-8 rounded-2xl"
              style={{
                background: "rgba(15,15,12,0.6)",
                border: "1px solid rgba(212,168,83,0.08)",
              }}
              variants={fadeUp}
            >
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: "rgba(212,168,83,0.08)", border: "1px solid rgba(212,168,83,0.15)" }}>
                {item.svg}
              </div>
              <span className="text-[13px] tracking-[0.2em] font-semibold uppercase" style={{ color: GOLD }}>
                {item.title}
              </span>
              <div className="w-6 h-[1px]" style={{ background: "rgba(212,168,83,0.2)" }} />
              <span className="text-[clamp(14px,1.4vw,17px)] text-[#9A9185] font-light leading-relaxed">
                {item.text}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}

function Slide5() {
  return (
    <motion.div className="flex flex-col items-center justify-center h-full relative overflow-hidden" variants={stagger} initial="hidden" animate="show">
      {/* ── Background layers ── */}
      <Particles />

      {/* Dual glow: cold top, warm bottom — visual shift metaphor */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 70% 50% at 50% 15%, rgba(100,100,120,0.06) 0%, transparent 100%)" }} />
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 60% 50% at 50% 85%, rgba(212,168,83,0.08) 0%, transparent 100%)" }} />

      {/* Vignette */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 75% 65% at 50% 50%, transparent 30%, rgba(0,0,0,0.55) 100%)" }} />

      {/* ── Content ── */}
      <div className="relative z-10 flex flex-col items-center gap-8">
        {/* Top phrase — muted, smaller */}
        <motion.p
          className="text-[clamp(24px,3.8vw,46px)] font-light text-center tracking-wide"
          style={{ color: "rgba(154,145,133,0.35)" }}
          variants={fadeUp}
        >
          O problema n&#227;o &#233; voc&#234;.
        </motion.p>

        {/* Simple line divider */}
        <motion.div variants={fadeIn}>
          <div className="w-24 h-[1px]" style={{ background: "linear-gradient(90deg, transparent, rgba(212,168,83,0.4), transparent)" }} />
        </motion.div>

        {/* Hero phrase — big, golden, powerful */}
        <motion.h2 className="text-center leading-[0.95]" variants={fadeUp}>
          <ShimmerText className="text-[clamp(56px,10.5vw,124px)] font-black tracking-[-0.03em]">
            &#201; o ambiente.
          </ShimmerText>
        </motion.h2>

      </div>
    </motion.div>
  );
}

function Slide6() {
  return (
    <motion.div className="flex flex-col items-center justify-center h-full relative overflow-hidden" variants={stagger} initial="hidden" animate="show">
      {/* ── Background ── */}
      <Particles />

      {/* Warm glow center */}
      <div className="absolute pointer-events-none animate-pulse"
        style={{
          width: "55%", height: "50%", left: "22.5%", top: "25%",
          background: "radial-gradient(ellipse at center, rgba(212,168,83,0.06) 0%, transparent 70%)",
          animationDuration: "6s",
        }} />

      {/* Vignette */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 75% 65% at 50% 50%, transparent 35%, rgba(0,0,0,0.55) 100%)" }} />

      {/* Watermark */}
      <motion.div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none -mt-8" variants={fadeIn}>
        <span className="text-[clamp(70px,14vw,180px)] font-black uppercase tracking-[-0.04em]"
          style={{ color: "rgba(212,168,83,0.03)" }}>
          CONEX&#213;ES
        </span>
      </motion.div>

      {/* ── Content — shifted up to align with watermark ── */}
      <div className="relative z-10 flex flex-col items-center justify-center gap-7 text-center px-8 -mt-10">
        {/* Top phrase inside subtle card */}
        <motion.div variants={fadeUp}>
          <GlowCard className="px-10 py-6 backdrop-blur-md text-center">
            <p className="text-[clamp(18px,2.5vw,30px)] font-light leading-[1.5]" style={{ color: "rgba(154,145,133,0.7)" }}>
              O que muda o jogo<br />
              <span className="text-white/80 font-medium">n&#227;o &#233; s&#243; esfor&#231;o.</span>
            </p>
          </GlowCard>
        </motion.div>

        {/* Divider */}
        <motion.div variants={fadeIn}>
          <div className="w-20 h-[1px]" style={{ background: "linear-gradient(90deg, transparent, rgba(212,168,83,0.4), transparent)" }} />
        </motion.div>

        {/* Hero phrase — single line over watermark */}
        <motion.h2 className="leading-[0.95]" variants={fadeUp}>
          <span className="block text-[clamp(18px,2vw,24px)] font-light text-white/50 tracking-wide mb-3">S&#227;o as</span>
          <ShimmerText className="block text-[clamp(46px,8.5vw,100px)] font-black tracking-[-0.03em]">
            conex&#245;es certas.
          </ShimmerText>
        </motion.h2>
      </div>
    </motion.div>
  );
}

function Slide7() {
  return (
    <motion.div className="flex flex-col items-center justify-center h-full relative" variants={stagger} initial="hidden" animate="show">
      <DiamondShape size={240} opacity={0.05} cx="30%" cy="32%" />
      <DiamondShape size={140} opacity={0.04} cx="74%" cy="68%" />

      <motion.p className="text-[clamp(16px,2vw,24px)] text-[#9A9185] font-light mb-8 relative z-10" variants={fadeUp}>
        Agora imagine unir:
      </motion.p>

      <motion.div className="flex items-center gap-5 sm:gap-7 relative z-10" variants={stagger}>
        <motion.div variants={scaleIn}>
          <GlowCard className="px-8 sm:px-12 py-7 sm:py-9 backdrop-blur-sm">
            <span className="text-[clamp(26px,3.8vw,42px)] font-bold text-[#D4A853]">Conex&#245;es</span>
          </GlowCard>
        </motion.div>

        <motion.span className="text-[clamp(24px,3vw,38px)] text-[#D4A853]/40 font-light" variants={fadeIn}>+</motion.span>

        <motion.div variants={scaleIn}>
          <GlowCard className="px-8 sm:px-12 py-7 sm:py-9 backdrop-blur-sm">
            <span className="text-[clamp(26px,3.8vw,42px)] font-bold text-[#D4A853]">Conhecimento</span>
          </GlowCard>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

function Slide8() {
  return (
    <motion.div className="flex flex-col items-center justify-center h-full relative" variants={stagger} initial="hidden" animate="show">
      <MeshGradient />

      <motion.h1 className="text-center leading-[0.92] relative z-10" variants={fadeUp}>
        <ShimmerText className="block text-[clamp(52px,9vw,100px)] font-extrabold tracking-[-0.02em]">
          REDE DE VALOR
        </ShimmerText>
        <motion.span className="block text-[clamp(38px,6vw,68px)] font-bold text-white mt-1" variants={fadeUp}>
          + TIME
        </motion.span>
      </motion.h1>

      <div className="mt-7 mb-7 relative z-10">
        <DiamondDivider />
      </div>

      <motion.p className="text-[clamp(16px,2vw,24px)] text-[#9A9185] font-light relative z-10" variants={fadeUp}>
        Conex&#227;o + Crescimento no mesmo ambiente
      </motion.p>
    </motion.div>
  );
}

function Slide9() {
  return (
    <motion.div className="flex flex-col items-center justify-center h-full relative" variants={stagger} initial="hidden" animate="show">
      <SubtleRing size={480} opacity={0.05} cx="50%" cy="44%" />
      <SubtleRing size={360} opacity={0.04} cx="50%" cy="44%" />
      <SubtleRing size={240} opacity={0.03} cx="50%" cy="44%" />

      <motion.p className="text-[clamp(20px,2.8vw,34px)] text-[#9A9185] font-light relative z-10" variants={fadeUp}>
        Voc&#234; n&#227;o entra em um grupo.
      </motion.p>

      <motion.h2 className="mt-4 leading-[1.12] text-center relative z-10" variants={fadeUp}>
        <span className="block text-[clamp(34px,5.5vw,68px)] font-bold text-white">Voc&#234; entra em um</span>
        <ShimmerText className="block text-[clamp(40px,7vw,80px)] font-extrabold">ecossistema.</ShimmerText>
      </motion.h2>
    </motion.div>
  );
}

function Slide10() {
  return (
    <motion.div className="flex flex-col items-center justify-center h-full relative px-6" variants={stagger} initial="hidden" animate="show">
      <motion.h2 className="text-[clamp(30px,4.5vw,52px)] font-semibold text-[#D4A853] text-center mb-8" variants={fadeUp}>
        O que voc&#234; recebe
      </motion.h2>

      <motion.div className="grid grid-cols-4 gap-3 sm:gap-4 w-full max-w-4xl" variants={stagger}>
        {[
          { emoji: "\uD83E\uDD1D", title: "Networking", sub: "de alto n\u00EDvel" },
          { emoji: "\uD83C\uDF99\uFE0F", title: "Podcast", sub: "profissional" },
          { emoji: "\uD83D\uDCFB", title: "Entrevista", sub: "em r\u00E1dio" },
          { emoji: "\uD83D\uDCDA", title: "Cursos", sub: "e treinamentos" },
          { emoji: "\uD83D\uDCC5", title: "Eventos", sub: "mensais" },
          { emoji: "\uD83D\uDCBC", title: "Projetos", sub: "com investidores" },
          { emoji: "\uD83D\uDE80", title: "Experi\u00EAncias", sub: "de neg\u00F3cios" },
          { emoji: "\u2728", title: "E muito", sub: "mais..." },
        ].map((item, i) => (
          <motion.div key={i} variants={fadeUp}>
            <GlowCard className="flex flex-col items-center gap-2 py-4 sm:py-5 px-2">
              <span className="text-2xl sm:text-3xl">{item.emoji}</span>
              <span className="text-[clamp(12px,1.3vw,16px)] font-semibold text-white text-center">{item.title}</span>
              <span className="text-[clamp(10px,1vw,13px)] text-[#9A9185] text-center font-light">{item.sub}</span>
            </GlowCard>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}

function Slide11({ active }: { active: boolean }) {
  const count = useAnimatedCounter(15500, 2000, active);
  return (
    <motion.div className="flex flex-col items-center justify-center h-full relative" variants={stagger} initial="hidden" animate="show">
      <MeshGradient />

      <motion.p className="text-[clamp(16px,2vw,24px)] text-[#5A544C] font-light relative z-10" variants={fadeUp}>
        Se voc&#234; fosse pagar
      </motion.p>
      <motion.p className="text-[clamp(18px,2.2vw,26px)] text-white font-medium mt-2 relative z-10" variants={fadeUp}>
        por tudo isso separadamente...
      </motion.p>

      <motion.h2
        className="text-[clamp(60px,11vw,130px)] font-extrabold leading-[1] italic mt-6 relative z-10"
        style={{
          background: `linear-gradient(135deg, ${GOLD_D} 0%, ${GOLD_L} 25%, #fff8e7 50%, ${GOLD_L} 75%, ${GOLD_D} 100%)`,
          backgroundSize: "300% auto",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          animation: "shine 5s ease-in-out infinite",
        }}
        variants={fadeUp}
      >
        R$ {count.toLocaleString("pt-BR")}
      </motion.h2>

      <motion.p className="text-[clamp(14px,1.5vw,18px)] text-[#9A9185] font-light mt-6 relative z-10" variants={fadeUp}>
        (E isso sem contar o valor das conex&#245;es)
      </motion.p>
    </motion.div>
  );
}

function Slide12({ active }: { active: boolean }) {
  const count = useAnimatedCounter(5000, 1500, active);
  return (
    <motion.div className="flex flex-col items-center justify-center h-full relative" variants={stagger} initial="hidden" animate="show">
      <MeshGradient />

      <motion.p className="text-[clamp(16px,1.8vw,22px)] text-[#5A544C] font-light italic relative z-10" variants={fadeUp}>
        Mas voc&#234; n&#227;o vai pagar isso.
      </motion.p>
      <motion.p className="text-[clamp(18px,2vw,24px)] text-white font-medium mt-2 relative z-10" variants={fadeUp}>
        Hoje... Voc&#234; pode fazer parte por:
      </motion.p>

      <motion.div className="relative z-10 mt-8" variants={scaleIn}>
        <GlowCard className="px-12 sm:px-20 py-9 backdrop-blur-md" glow>
          <motion.h2
            className="text-[clamp(56px,9vw,104px)] font-extrabold leading-[1] italic text-center"
            style={{
              background: `linear-gradient(135deg, ${GOLD_D} 0%, ${GOLD_L} 25%, #fff8e7 50%, ${GOLD_L} 75%, ${GOLD_D} 100%)`,
              backgroundSize: "300% auto",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              animation: "shine 5s ease-in-out infinite",
            }}
          >
            R$ {count.toLocaleString("pt-BR")}
          </motion.h2>
        </GlowCard>
      </motion.div>

      <motion.div className="flex items-center justify-center gap-3 mt-7 flex-wrap relative z-10" variants={fadeUp}>
        <span className="px-5 py-2.5 rounded-full text-[clamp(13px,1.4vw,17px)] text-[#E8E0D4] font-medium"
          style={{ border: "1px solid rgba(212,168,83,0.12)", background: "rgba(17,17,17,0.6)" }}>
          12x de R$ 482
        </span>
        <span className="text-[#D4A853]/30">&#x2022;</span>
        <span className="px-5 py-2.5 rounded-full text-[clamp(13px,1.4vw,17px)] text-[#E8E0D4] font-medium"
          style={{ border: "1px solid rgba(212,168,83,0.12)", background: "rgba(17,17,17,0.6)" }}>
          18x de R$ 342
        </span>
      </motion.div>
    </motion.div>
  );
}

function Slide13() {
  return (
    <motion.div className="flex flex-col items-center justify-center h-full relative px-6 sm:px-10" variants={stagger} initial="hidden" animate="show">
      <motion.div variants={scaleIn}>
        <GlowCard className="w-full max-w-3xl py-12 px-8 sm:px-14 text-center backdrop-blur-md" glow>
          <motion.p className="text-[clamp(16px,1.8vw,22px)] text-[#5A544C] font-light italic" variants={fadeUp}>
            Mas sendo justo com
          </motion.p>
          <motion.p className="text-[clamp(16px,1.8vw,22px)] text-white font-medium mt-1" variants={fadeUp}>
            quem est&#225; aqui hoje...
          </motion.p>

          <motion.h2 className="text-[clamp(34px,5.5vw,64px)] font-bold text-[#D4A853] mt-6 leading-[1.1]" variants={fadeUp}>
            Essa condi&#231;&#227;o &#233;<br />exclusiva.
          </motion.h2>

          <motion.div className="mt-8 inline-block" variants={scaleIn}>
            <GlowCard className="px-8 py-4">
              <p className="text-[clamp(14px,1.5vw,18px)] text-[#5A544C] font-light">Depois desse evento...</p>
              <p className="text-[clamp(15px,1.6vw,19px)] text-white font-semibold mt-1">isso muda.</p>
            </GlowCard>
          </motion.div>
        </GlowCard>
      </motion.div>
    </motion.div>
  );
}

function Slide14() {
  return (
    <motion.div className="flex flex-col items-center justify-center h-full relative" variants={stagger} initial="hidden" animate="show">
      <MeshGradient />

      <motion.p className="text-[clamp(16px,2vw,24px)] text-[#5A544C] font-light relative z-10" variants={fadeUp}>
        A pergunta n&#227;o &#233; o valor.
      </motion.p>

      <motion.h2 className="mt-6 leading-[1.12] text-center relative z-10" variants={fadeUp}>
        <span className="block text-[clamp(28px,4.2vw,54px)] font-bold text-white">
          &#201;: Voc&#234; quer continuar sozinho...
        </span>
        <motion.span className="block mt-2" variants={fadeUp}>
          <ShimmerText className="text-[clamp(32px,5.5vw,64px)] font-extrabold">
            ou crescer com as pessoas certas?
          </ShimmerText>
        </motion.span>
      </motion.h2>
    </motion.div>
  );
}

function Slide15() {
  return (
    <motion.div className="flex flex-col items-center justify-center h-full relative" variants={stagger} initial="hidden" animate="show">
      <Particles />

      <motion.h2 variants={fadeUp}>
        <ShimmerText className="text-[clamp(44px,8vw,92px)] font-extrabold text-center leading-[1.05] italic block">
          Agora &#233; o<br />momento.
        </ShimmerText>
      </motion.h2>

      <motion.div className="mt-8 space-y-3 text-center" variants={stagger}>
        {["Fa\u00E7a seu cadastro", "Fale com o time", "Garanta sua vaga"].map((cta, i) => (
          <motion.div key={i} className="flex items-center justify-center gap-3" variants={fadeUp}>
            <span className="text-[#D4A853]/50 text-lg">&rarr;</span>
            <span className="text-[clamp(16px,1.8vw,22px)] text-white font-semibold">{cta}</span>
          </motion.div>
        ))}
      </motion.div>

      <div className="mt-10 relative z-10">
        <LineDivider width="w-48" />
      </div>

      <motion.div className="mt-6 text-center relative z-10" variants={fadeUp}>
        <ShimmerText className="text-[clamp(14px,1.6vw,20px)] font-bold tracking-wide">
          REDE DE VALOR
        </ShimmerText>
        <p className="text-[10px] tracking-[0.3em] text-[#5A544C] font-medium mt-1 uppercase">
          Um Novo N&#237;vel de Networking
        </p>
      </motion.div>
    </motion.div>
  );
}

// ─── PPTX DOWNLOAD ───

async function generatePPTX() {
  // Load pptxgenjs from CDN to avoid Node.js module issues in static build
  let PptxGenJS: new () => any; // eslint-disable-line @typescript-eslint/no-explicit-any
  if ((window as any).PptxGenJS) {
    PptxGenJS = (window as any).PptxGenJS;
  } else {
    await new Promise<void>((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/gh/gitbrent/PptxGenJS@3.12.0/dist/pptxgen.bundle.js";
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Failed to load PptxGenJS"));
      document.head.appendChild(script);
    });
    PptxGenJS = (window as any).PptxGenJS;
  }
  const pptx = new PptxGenJS();

  pptx.defineLayout({ name: "WIDE", width: 13.333, height: 7.5 });
  pptx.layout = "WIDE";

  const BG = "080808";
  const GOLD_HEX = "D4A853";
  const GOLD_L_HEX = "E8C97A";
  const WHITE_HEX = "F5F0E8";
  const GRAY_HEX = "9A9185";
  const MUTED_HEX = "5A544C";
  const FONT = "Plus Jakarta Sans";

  const footerOpts = { x: 0, y: 6.9, w: 13.333, h: 0.35, fontSize: 8, color: MUTED_HEX, align: "center" as const, fontFace: FONT };
  const numOpts = { x: 11.8, y: 6.9, w: 1.2, h: 0.35, fontSize: 10, color: MUTED_HEX, align: "right" as const, fontFace: FONT };

  function addFooter(s: ReturnType<typeof pptx.addSlide>, n: number) {
    s.addText("REDE DE VALOR  \u2022  UM NOVO N\u00CDVEL DE NETWORKING", footerOpts);
    s.addText(`${n}/${TOTAL}`, numOpts);
  }

  // Slide 1
  let s = pptx.addSlide(); s.background = { color: "000000" };
  s.addText("APRESENTA\u00C7\u00C3O EXCLUSIVA", { x: 0, y: 1.5, w: 13.333, h: 0.4, fontSize: 11, color: MUTED_HEX, align: "center", fontFace: FONT, charSpacing: 8 });
  s.addText("REDE DE VALOR", { x: 0, y: 2.2, w: 13.333, h: 1.5, fontSize: 72, color: GOLD_L_HEX, bold: true, align: "center", fontFace: FONT });
  s.addText("+ TIME", { x: 0, y: 3.5, w: 13.333, h: 1.0, fontSize: 54, color: WHITE_HEX, bold: true, align: "center", fontFace: FONT });
  s.addText("Um novo n\u00EDvel de networking", { x: 0, y: 5.0, w: 13.333, h: 0.6, fontSize: 20, color: GRAY_HEX, align: "center", fontFace: FONT });
  addFooter(s, 1);

  // Slide 2
  s = pptx.addSlide(); s.background = { color: BG };
  s.addText("IDENTIFICA\u00C7\u00C3O", { x: 0, y: 1.5, w: 13.333, h: 0.4, fontSize: 11, color: GOLD_HEX, align: "center", fontFace: FONT, charSpacing: 6 });
  s.addText("Voc\u00EA n\u00E3o est\u00E1 aqui\npor acaso.", { x: 1, y: 2.2, w: 11.333, h: 2.0, fontSize: 54, color: GOLD_HEX, bold: true, align: "center", fontFace: FONT, lineSpacingMultiple: 1.1 });
  s.addText([{ text: "Se voc\u00EA est\u00E1 aqui...\n", options: { color: GRAY_HEX } }, { text: "\u00E9 porque sabe que pode ir al\u00E9m.", options: { color: GOLD_HEX, bold: true } }], { x: 1, y: 4.6, w: 11.333, h: 1.2, fontSize: 22, align: "center", fontFace: FONT, lineSpacingMultiple: 1.6 });
  addFooter(s, 2);

  // Slide 3
  s = pptx.addSlide(); s.background = { color: BG };
  s.addText("O PROBLEMA", { x: 0, y: 1.3, w: 13.333, h: 0.4, fontSize: 11, color: GOLD_HEX, align: "center", fontFace: FONT, charSpacing: 8 });
  s.addText([{ text: "A maioria dos empres\u00E1rios\n", options: { color: WHITE_HEX } }, { text: "trava.", options: { color: GOLD_HEX } }], { x: 1, y: 1.9, w: 11.333, h: 2.4, fontSize: 58, bold: true, align: "center", fontFace: FONT, lineSpacingMultiple: 1.1 });
  s.addShape("roundRect" as never, { x: 3.5, y: 4.5, w: 6.333, h: 1.5, fill: { color: "111111" }, line: { color: "2A2418", width: 0.5 }, rectRadius: 0.15 });
  s.addText([{ text: "N\u00E3o por falta de esfor\u00E7o.\n", options: { color: MUTED_HEX } }, { text: "Mas por falta de ambiente.", options: { color: WHITE_HEX, bold: true } }], { x: 3.5, y: 4.6, w: 6.333, h: 1.3, fontSize: 20, align: "center", fontFace: FONT, lineSpacingMultiple: 1.6 });
  addFooter(s, 3);

  // Slide 4
  s = pptx.addSlide(); s.background = { color: BG };
  s.addText("Voc\u00EA se identifica?", { x: 1, y: 1.2, w: 11.333, h: 1.0, fontSize: 48, color: GOLD_HEX, bold: true, align: "center", fontFace: FONT });
  const items4 = ["\u26A1  Trabalha muito, mas n\u00E3o cresce como poderia", "\uD83D\uDD17  Conhece poucas pessoas estrat\u00E9gicas", "\uD83D\uDCC8  Sente que poderia estar em outro n\u00EDvel"];
  items4.forEach((t, i) => {
    const y = 2.6 + i * 1.3;
    s.addShape("roundRect" as never, { x: 3, y, w: 7.333, h: 0.95, fill: { color: "111111" }, line: { color: "2A2418", width: 0.5 }, rectRadius: 0.15 });
    s.addText(t, { x: 3.2, y: y + 0.1, w: 6.9, h: 0.75, fontSize: 18, color: WHITE_HEX, fontFace: FONT, valign: "middle" });
  });
  addFooter(s, 4);

  // Slide 5
  s = pptx.addSlide(); s.background = { color: "000000" };
  s.addText("O problema n\u00E3o \u00E9 voc\u00EA.", { x: 0, y: 2.2, w: 13.333, h: 0.8, fontSize: 38, color: GRAY_HEX, align: "center", fontFace: FONT });
  s.addText("\u00C9 o ambiente.", { x: 0, y: 3.2, w: 13.333, h: 1.5, fontSize: 84, color: GOLD_L_HEX, bold: true, align: "center", fontFace: FONT });
  addFooter(s, 5);

  // Slide 6
  s = pptx.addSlide(); s.background = { color: BG };
  s.addText("O que muda o jogo\nn\u00E3o \u00E9 s\u00F3 esfor\u00E7o.", { x: 1, y: 2.0, w: 11.333, h: 1.6, fontSize: 32, color: GRAY_HEX, align: "center", fontFace: FONT, lineSpacingMultiple: 1.3 });
  s.addText("S\u00E3o as conex\u00F5es certas.", { x: 1, y: 3.8, w: 11.333, h: 1.2, fontSize: 56, color: GOLD_HEX, bold: true, align: "center", fontFace: FONT });
  addFooter(s, 6);

  // Slide 7
  s = pptx.addSlide(); s.background = { color: BG };
  s.addText("Agora imagine unir:", { x: 0, y: 2.0, w: 13.333, h: 0.6, fontSize: 22, color: GRAY_HEX, align: "center", fontFace: FONT });
  s.addShape("roundRect" as never, { x: 2.5, y: 3.2, w: 3.5, h: 1.5, fill: { color: "111111" }, line: { color: "2A2418", width: 0.5 }, rectRadius: 0.1 });
  s.addText("Conex\u00F5es", { x: 2.5, y: 3.2, w: 3.5, h: 1.5, fontSize: 34, color: GOLD_HEX, bold: true, align: "center", fontFace: FONT, valign: "middle" });
  s.addText("+", { x: 6, y: 3.2, w: 1.333, h: 1.5, fontSize: 36, color: MUTED_HEX, align: "center", fontFace: FONT, valign: "middle" });
  s.addShape("roundRect" as never, { x: 7.333, y: 3.2, w: 3.5, h: 1.5, fill: { color: "111111" }, line: { color: "2A2418", width: 0.5 }, rectRadius: 0.1 });
  s.addText("Conhecimento", { x: 7.333, y: 3.2, w: 3.5, h: 1.5, fontSize: 34, color: GOLD_HEX, bold: true, align: "center", fontFace: FONT, valign: "middle" });
  addFooter(s, 7);

  // Slide 8
  s = pptx.addSlide(); s.background = { color: "000000" };
  s.addText("REDE DE VALOR", { x: 0, y: 1.8, w: 13.333, h: 1.5, fontSize: 76, color: GOLD_L_HEX, bold: true, align: "center", fontFace: FONT });
  s.addText("+ TIME", { x: 0, y: 3.2, w: 13.333, h: 1.0, fontSize: 52, color: WHITE_HEX, bold: true, align: "center", fontFace: FONT });
  s.addText("Conex\u00E3o + Crescimento no mesmo ambiente", { x: 0, y: 4.6, w: 13.333, h: 0.6, fontSize: 22, color: GRAY_HEX, align: "center", fontFace: FONT });
  addFooter(s, 8);

  // Slide 9
  s = pptx.addSlide(); s.background = { color: BG };
  s.addText("Voc\u00EA n\u00E3o entra em um grupo.", { x: 0, y: 2.2, w: 13.333, h: 0.8, fontSize: 30, color: GRAY_HEX, align: "center", fontFace: FONT });
  s.addText([{ text: "Voc\u00EA entra em um\n", options: { color: WHITE_HEX } }, { text: "ecossistema.", options: { color: GOLD_HEX } }], { x: 1, y: 3.2, w: 11.333, h: 2.2, fontSize: 58, bold: true, align: "center", fontFace: FONT, lineSpacingMultiple: 1.15 });
  addFooter(s, 9);

  // Slide 10
  s = pptx.addSlide(); s.background = { color: BG };
  s.addText("O que voc\u00EA recebe", { x: 0, y: 0.8, w: 13.333, h: 0.8, fontSize: 40, color: GOLD_HEX, fontFace: FONT, align: "center" });
  const benefits = [
    ["\uD83E\uDD1D", "Networking", "de alto n\u00EDvel"], ["\uD83C\uDF99\uFE0F", "Podcast", "profissional"],
    ["\uD83D\uDCFB", "Entrevista", "em r\u00E1dio"], ["\uD83D\uDCDA", "Cursos", "e treinamentos"],
    ["\uD83D\uDCC5", "Eventos", "mensais"], ["\uD83D\uDCBC", "Projetos", "com investidores"],
    ["\uD83D\uDE80", "Experi\u00EAncias", "de neg\u00F3cios"], ["\u2728", "E muito", "mais..."],
  ];
  benefits.forEach(([emoji, title, sub], i) => {
    const col = i % 4;
    const row = Math.floor(i / 4);
    const x = 1.2 + col * 2.9;
    const y = 2.2 + row * 2.4;
    s.addShape("roundRect" as never, { x, y, w: 2.6, h: 2.0, fill: { color: "111111" }, line: { color: "2A2418", width: 0.5 }, rectRadius: 0.1 });
    s.addText(emoji!, { x, y: y + 0.15, w: 2.6, h: 0.6, fontSize: 28, align: "center", fontFace: FONT });
    s.addText(title!, { x, y: y + 0.8, w: 2.6, h: 0.45, fontSize: 15, color: WHITE_HEX, bold: true, align: "center", fontFace: FONT });
    s.addText(sub!, { x, y: y + 1.25, w: 2.6, h: 0.4, fontSize: 12, color: GRAY_HEX, align: "center", fontFace: FONT });
  });
  addFooter(s, 10);

  // Slide 11
  s = pptx.addSlide(); s.background = { color: "000000" };
  s.addText("Se voc\u00EA fosse pagar", { x: 0, y: 1.5, w: 13.333, h: 0.5, fontSize: 22, color: MUTED_HEX, align: "center", fontFace: FONT });
  s.addText("por tudo isso separadamente...", { x: 0, y: 2.1, w: 13.333, h: 0.5, fontSize: 24, color: WHITE_HEX, align: "center", fontFace: FONT });
  s.addText("R$ 15.500", { x: 0, y: 2.8, w: 13.333, h: 2.0, fontSize: 96, color: GOLD_L_HEX, bold: true, italic: true, align: "center", fontFace: FONT });
  s.addText("(E isso sem contar o valor das conex\u00F5es)", { x: 0, y: 5.0, w: 13.333, h: 0.5, fontSize: 16, color: GRAY_HEX, align: "center", fontFace: FONT });
  addFooter(s, 11);

  // Slide 12
  s = pptx.addSlide(); s.background = { color: BG };
  s.addText("Mas voc\u00EA n\u00E3o vai pagar isso.", { x: 0, y: 1.2, w: 13.333, h: 0.5, fontSize: 20, color: MUTED_HEX, align: "center", fontFace: FONT });
  s.addText("Hoje... Voc\u00EA pode fazer parte por:", { x: 0, y: 1.8, w: 13.333, h: 0.5, fontSize: 22, color: WHITE_HEX, align: "center", fontFace: FONT });
  s.addShape("roundRect" as never, { x: 3.5, y: 2.6, w: 6.333, h: 2.5, fill: { color: "0A0A0A" }, line: { color: "2A2418", width: 1 }, rectRadius: 0.15 });
  s.addText("R$ 5.000", { x: 3.5, y: 2.8, w: 6.333, h: 2.0, fontSize: 80, color: GOLD_L_HEX, bold: true, italic: true, align: "center", fontFace: FONT });
  s.addText("12x de R$ 482   \u2022   18x de R$ 342", { x: 0, y: 5.4, w: 13.333, h: 0.5, fontSize: 17, color: WHITE_HEX, align: "center", fontFace: FONT });
  addFooter(s, 12);

  // Slide 13
  s = pptx.addSlide(); s.background = { color: BG };
  s.addShape("roundRect" as never, { x: 2.0, y: 0.8, w: 9.333, h: 5.5, fill: { color: "0A0A0A" }, line: { color: "2A2418", width: 1 }, rectRadius: 0.15 });
  s.addText([{ text: "Mas sendo justo com\n", options: { color: MUTED_HEX, italic: true } }, { text: "quem est\u00E1 aqui hoje...", options: { color: WHITE_HEX } }], { x: 2.5, y: 1.3, w: 8.333, h: 1.2, fontSize: 20, align: "center", fontFace: FONT, lineSpacingMultiple: 1.5 });
  s.addText("Essa condi\u00E7\u00E3o \u00E9\nexclusiva.", { x: 2.5, y: 2.6, w: 8.333, h: 1.8, fontSize: 48, color: GOLD_HEX, bold: true, align: "center", fontFace: FONT, lineSpacingMultiple: 1.1 });
  s.addShape("roundRect" as never, { x: 4.5, y: 4.5, w: 4.333, h: 1.2, fill: { color: "111111" }, line: { color: "1A1714", width: 0.5 }, rectRadius: 0.1 });
  s.addText([{ text: "Depois desse evento...\n", options: { color: MUTED_HEX } }, { text: "isso muda.", options: { color: WHITE_HEX, bold: true } }], { x: 4.5, y: 4.55, w: 4.333, h: 1.1, fontSize: 16, align: "center", fontFace: FONT, lineSpacingMultiple: 1.5 });
  addFooter(s, 13);

  // Slide 14
  s = pptx.addSlide(); s.background = { color: "000000" };
  s.addText("A pergunta n\u00E3o \u00E9 o valor.", { x: 0, y: 1.8, w: 13.333, h: 0.6, fontSize: 22, color: MUTED_HEX, align: "center", fontFace: FONT });
  s.addText([{ text: "\u00C9: Voc\u00EA quer continuar sozinho...\n", options: { color: WHITE_HEX } }, { text: "ou crescer com as pessoas certas?", options: { color: GOLD_HEX } }], { x: 0.5, y: 2.8, w: 12.333, h: 2.8, fontSize: 48, bold: true, align: "center", fontFace: FONT, lineSpacingMultiple: 1.2 });
  addFooter(s, 14);

  // Slide 15
  s = pptx.addSlide(); s.background = { color: "000000" };
  s.addText("Agora \u00E9 o\nmomento.", { x: 0, y: 0.8, w: 13.333, h: 2.5, fontSize: 68, color: GOLD_L_HEX, bold: true, italic: true, align: "center", fontFace: FONT, lineSpacingMultiple: 1.05 });
  const ctas = ["\u2192  Fa\u00E7a seu cadastro", "\u2192  Fale com o time", "\u2192  Garanta sua vaga"];
  ctas.forEach((t, i) => {
    s.addText(t, { x: 0, y: 3.5 + i * 0.6, w: 13.333, h: 0.5, fontSize: 20, color: WHITE_HEX, bold: true, align: "center", fontFace: FONT });
  });
  s.addText("REDE DE VALOR", { x: 0, y: 5.4, w: 13.333, h: 0.5, fontSize: 20, color: GOLD_HEX, bold: true, align: "center", fontFace: FONT });
  s.addText("UM NOVO N\u00CDVEL DE NETWORKING", { x: 0, y: 5.9, w: 13.333, h: 0.4, fontSize: 10, color: MUTED_HEX, align: "center", fontFace: FONT, charSpacing: 6 });
  addFooter(s, 15);

  pptx.writeFile({ fileName: "Rede_de_Valor_TIME_Apresentacao.pptx" });
}

// ─── NAV ───

function NavArrow({ direction, onClick }: { direction: "left" | "right"; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer hover:scale-110"
      style={{
        border: "1px solid rgba(212,168,83,0.2)",
        background: "rgba(10,10,10,0.5)",
        backdropFilter: "blur(8px)",
      }}
      aria-label={direction === "left" ? "Slide anterior" : "Pr\u00F3ximo slide"}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        className="text-[#D4A853]/60 group-hover:text-[#D4A853] transition-colors">
        {direction === "left" ? <polyline points="15 18 9 12 15 6" /> : <polyline points="9 6 15 12 9 18" />}
      </svg>
    </button>
  );
}

// ─── MAIN ───

export default function Apresentacao() {
  const [current, setCurrent] = useState(0);
  const [dir, setDir] = useState(0);
  const reduced = useReducedMotion();

  const goTo = useCallback((i: number) => {
    if (i < 0 || i >= TOTAL) return;
    setDir(i > current ? 1 : -1);
    setCurrent(i);
  }, [current]);

  const next = useCallback(() => goTo(Math.min(current + 1, TOTAL - 1)), [current, goTo]);
  const prev = useCallback(() => goTo(Math.max(current - 1, 0)), [current, goTo]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); next(); }
      if (e.key === "ArrowLeft") { e.preventDefault(); prev(); }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [next, prev]);

  useEffect(() => {
    let sx = 0;
    const s = (e: TouchEvent) => { sx = e.touches[0].clientX; };
    const end = (e: TouchEvent) => {
      const d = sx - e.changedTouches[0].clientX;
      if (Math.abs(d) > 50) { d > 0 ? next() : prev(); }
    };
    window.addEventListener("touchstart", s, { passive: true });
    window.addEventListener("touchend", end, { passive: true });
    return () => { window.removeEventListener("touchstart", s); window.removeEventListener("touchend", end); };
  }, [next, prev]);


  const slideVariants = {
    enter: (d: number) => reduced ? { opacity: 0 } : { opacity: 0, scale: 0.96, filter: "blur(6px)" },
    center: reduced ? { opacity: 1 } : { opacity: 1, scale: 1, filter: "blur(0px)" },
    exit: (d: number) => reduced ? { opacity: 0 } : { opacity: 0, scale: 1.02, filter: "blur(4px)" },
  };

  const SlideComponent = [
    Slide1, Slide2, Slide3, Slide4, Slide5,
    Slide6, Slide7, Slide8, Slide9, Slide10,
    () => <Slide11 active={current === 10} />,
    () => <Slide12 active={current === 11} />,
    Slide13, Slide14, Slide15,
  ][current];

  return (
    <div
      className="w-screen h-screen overflow-hidden flex items-center justify-center select-none"
      style={{ fontFamily: "var(--font-jakarta), 'Plus Jakarta Sans', system-ui, sans-serif", background: "#080808" }}
    >
      <div className="relative w-full h-full max-w-[1200px] max-h-[720px] flex items-center">

        {/* Slide container */}
        <div
          className="relative w-full h-full rounded-[20px] overflow-hidden noise"
          style={{
            background: "#080808",
            boxShadow: "0 40px 120px rgba(0,0,0,0.6)",
          }}
        >
          {/* Progress bar */}
          <motion.div
            className="absolute top-0 left-0 h-[2px] z-30"
            style={{ background: `linear-gradient(90deg, ${GOLD_D}, ${GOLD_L}, ${GOLD})` }}
            animate={{ width: `${((current + 1) / TOTAL) * 100}%` }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          />

          {/* Subtle border glow top */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#D4A853]/8 to-transparent z-20" />

          {/* Slide */}
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={current}
              custom={dir}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0"
            >
              <SlideComponent />
            </motion.div>
          </AnimatePresence>

          {/* Footer */}
          <div className="absolute bottom-0 left-0 right-0 h-12 flex items-center justify-between px-6 sm:px-10 z-30">
            <div />
            <span className="text-[9px] sm:text-[10px] tracking-[0.2em] text-[#5A544C]/50 font-medium uppercase">
              Rede de Valor &bull; Um Novo N&#237;vel de Networking
            </span>
            <div />
          </div>

        </div>

        {/* Nav arrows */}
        <div className="absolute left-0 sm:-left-2 top-1/2 -translate-y-1/2 z-40 -translate-x-1/2">
          <NavArrow direction="left" onClick={prev} />
        </div>
        <div className="absolute right-0 sm:-right-2 top-1/2 -translate-y-1/2 z-40 translate-x-1/2">
          <NavArrow direction="right" onClick={next} />
        </div>

        {/* Download button */}
        <button
          onClick={generatePPTX}
          className="absolute -top-1 sm:-top-4 right-0 sm:-right-2 z-40 flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-300 cursor-pointer hover:scale-105 group"
          style={{
            border: "1px solid rgba(212,168,83,0.15)",
            background: "rgba(10,10,10,0.6)",
            backdropFilter: "blur(8px)",
          }}
          title="Baixar como PowerPoint"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            className="text-[#D4A853]/50 group-hover:text-[#D4A853] transition-colors">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          <span className="text-[10px] text-[#D4A853]/50 group-hover:text-[#D4A853] font-medium transition-colors hidden sm:inline">.pptx</span>
        </button>

        {/* Dot indicators */}
        <div className="absolute -bottom-4 sm:-bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5 z-40">
          {Array.from({ length: TOTAL }).map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`rounded-full transition-all duration-300 cursor-pointer ${
                i === current ? "w-6 h-1.5 bg-[#D4A853]" : "w-1.5 h-1.5 bg-[#D4A853]/15 hover:bg-[#D4A853]/35"
              }`}
              aria-label={`Ir para slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
