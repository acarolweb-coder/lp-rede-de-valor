"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";


// ─── CONSTANTS ───
const TOTAL = 15;
const FONT = "var(--font-jakarta), 'Plus Jakarta Sans', system-ui, sans-serif";

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

// Slide transition
const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? "100%" : "-100%", opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? "-100%" : "100%", opacity: 0 }),
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
        <motion.div
          key={i}
          className="absolute rounded-full pointer-events-none"
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
  const pos = {
    tl: { top: 0, left: 0 },
    tr: { top: 0, right: 0 },
    bl: { bottom: 0, left: 0 },
    br: { bottom: 0, right: 0 },
  }[position];
  const rot = { tl: 0, tr: 90, bl: -90, br: 180 }[position];
  return (
    <div className="absolute pointer-events-none" style={{ ...pos, width: 80, height: 80 }}>
      <svg width="80" height="80" viewBox="0 0 80 80" style={{ transform: `rotate(${rot}deg)` }}>
        <path d="M0 0L40 0" stroke="var(--gold)" strokeWidth="1" opacity="0.3" />
        <path d="M0 0L0 40" stroke="var(--gold)" strokeWidth="1" opacity="0.3" />
      </svg>
    </div>
  );
}

// ─── SLIDE WRAPPER ───
function SlideBase({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`relative w-full h-full overflow-hidden ${className}`}
      style={{ fontFamily: FONT, background: "var(--bg-0)" }}
    >
      {children}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// SLIDE 1 — HERO CINEMATIC
// ════════════════════════════════════════════════════════════════
function Slide1() {
  return (
    <SlideBase>
      {/* Background photo */}
      <div className="absolute inset-0">
        <Image src="/images/hero-bg.jpeg" alt="" fill className="object-cover" priority />
        <div className="absolute inset-0" style={{
          background: "linear-gradient(to right, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.3) 100%)"
        }} />
      </div>

      <CornerAccent position="tl" />
      <CornerAccent position="br" />

      <motion.div
        className="relative z-10 flex flex-col justify-center h-full px-[8%] max-w-[65%]"
        variants={stagger} initial="hidden" animate="show"
      >
        <motion.div variants={fadeUp} className="mb-6">
          <Image src="/images/logo-rede-de-valor-branco-v2.png" alt="Rede de Valor" width={180} height={60} />
        </motion.div>

        <motion.div variants={fadeUp}
          className="inline-block px-4 py-1.5 rounded-full mb-6 text-xs tracking-[0.25em] uppercase"
          style={{
            border: "1px solid var(--border-hover)",
            color: "var(--gold)",
            background: "rgba(212,168,83,0.06)",
            fontWeight: 600,
            letterSpacing: "0.25em",
          }}
        >
          Apresentação Comercial 2025
        </motion.div>

        <motion.h1 variants={fadeUp} style={{
          fontSize: "clamp(2.4rem, 5vw, 4rem)",
          fontWeight: 800,
          lineHeight: 1.05,
          color: "var(--text-primary)",
          letterSpacing: "-0.02em",
        }}>
          Um novo nível de{" "}
          <span className="text-gradient-gold-shine">networking</span>
          <br />para quem joga pra valer.
        </motion.h1>

        <motion.p variants={fadeUp} style={{
          fontSize: "clamp(1rem, 1.4vw, 1.2rem)",
          color: "var(--text-secondary)",
          marginTop: 24,
          maxWidth: 520,
          lineHeight: 1.7,
          fontWeight: 400,
        }}>
          Conexões estratégicas, eventos exclusivos e uma comunidade que acelera
          negócios de verdade.
        </motion.p>

        <motion.div variants={fadeUp} className="mt-10 flex items-center gap-6">
          <div className="flex items-center gap-3">
            <Image src="/images/logo-time-v2.png" alt="TIME" width={40} height={40} />
            <span style={{ color: "var(--text-muted)", fontSize: 13, fontWeight: 500 }}>powered by TIME</span>
          </div>
        </motion.div>
      </motion.div>

      {/* Bottom progress line */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px]"
        style={{ background: "linear-gradient(90deg, var(--gold), var(--gold-dark), transparent)" }} />
    </SlideBase>
  );
}

// ════════════════════════════════════════════════════════════════
// SLIDE 2 — HOOK / RESPIRO
// ════════════════════════════════════════════════════════════════
function Slide2() {
  return (
    <SlideBase>
      <div className="absolute inset-0" style={{
        background: "radial-gradient(ellipse 60% 50% at 20% 50%, rgba(212,168,83,0.04), transparent)"
      }} />
      <GoldDust />
      <CornerAccent position="bl" />

      <motion.div
        className="relative z-10 flex flex-col justify-center h-full px-[10%]"
        variants={stagger} initial="hidden" animate="show"
      >
        <motion.div variants={fadeUp}
          className="w-12 h-[2px] mb-8"
          style={{ background: "var(--gold)" }}
        />

        <motion.h2 variants={fadeUp} style={{
          fontSize: "clamp(1.6rem, 3.5vw, 2.8rem)",
          fontWeight: 700,
          color: "var(--text-primary)",
          lineHeight: 1.25,
          maxWidth: 700,
          letterSpacing: "-0.01em",
        }}>
          E se o seu próximo grande negócio
          <br />
          <span style={{ color: "var(--gold)" }}>viesse de uma conexão</span>
          <br />
          que você ainda não fez?
        </motion.h2>

        <motion.p variants={fadeUp} style={{
          fontSize: "clamp(0.95rem, 1.3vw, 1.1rem)",
          color: "var(--text-secondary)",
          marginTop: 28,
          maxWidth: 500,
          lineHeight: 1.7,
        }}>
          A maioria dos empresários está tentando crescer sozinho.
          Os melhores sabem que crescimento real vem de quem está ao seu lado.
        </motion.p>
      </motion.div>
    </SlideBase>
  );
}

// ════════════════════════════════════════════════════════════════
// SLIDE 3 — PROBLEMA (Typography as visual)
// ════════════════════════════════════════════════════════════════
function Slide3() {
  return (
    <SlideBase>
      <div className="absolute inset-0" style={{
        background: "radial-gradient(circle at 50% 50%, rgba(212,168,83,0.03), transparent 60%)"
      }} />

      <motion.div
        className="relative z-10 flex flex-col items-center justify-center h-full text-center px-[6%]"
        variants={stagger} initial="hidden" animate="show"
      >
        <motion.p variants={fadeIn} style={{
          fontSize: "clamp(0.85rem, 1.1vw, 1rem)",
          color: "var(--text-muted)",
          textTransform: "uppercase",
          letterSpacing: "0.3em",
          fontWeight: 600,
          marginBottom: 20,
        }}>
          O problema
        </motion.p>

        <motion.h2 variants={scaleReveal} style={{
          fontSize: "clamp(4rem, 12vw, 9rem)",
          fontWeight: 800,
          color: "var(--text-primary)",
          lineHeight: 0.9,
          letterSpacing: "-0.04em",
        }}>
          trava.
        </motion.h2>

        <motion.div variants={fadeUp} className="mt-8" style={{
          width: 60, height: 1, background: "var(--gold)", opacity: 0.5
        }} />

        <motion.p variants={fadeUp} style={{
          fontSize: "clamp(1rem, 1.5vw, 1.2rem)",
          color: "var(--text-secondary)",
          marginTop: 28,
          maxWidth: 560,
          lineHeight: 1.7,
        }}>
          Você cresce, mas chega num ponto onde
          esforço sozinho não move mais o ponteiro.
          Falta rede. Falta troca. Falta ecossistema.
        </motion.p>
      </motion.div>
    </SlideBase>
  );
}

// ════════════════════════════════════════════════════════════════
// SLIDE 4 — DOR (Bento Grid)
// ════════════════════════════════════════════════════════════════
function Slide4() {
  const pains = [
    { icon: "🔒", title: "Isolamento", desc: "Decisões solitárias, sem mentoria ou troca de alto nível com quem entende seu momento." },
    { icon: "🔄", title: "Networking raso", desc: "Eventos genéricos que não geram negócios reais. Troca de cartões que não vira contrato." },
    { icon: "📉", title: "Crescimento estagnado", desc: "Faturamento travado porque as mesmas estratégias já não funcionam no próximo nível." },
  ];

  return (
    <SlideBase>
      <CornerAccent position="tr" />

      <motion.div
        className="relative z-10 flex flex-col justify-center h-full px-[8%]"
        variants={stagger} initial="hidden" animate="show"
      >
        <motion.p variants={fadeUp} style={{
          fontSize: 12, textTransform: "uppercase", letterSpacing: "0.3em",
          color: "var(--gold)", fontWeight: 600, marginBottom: 12,
        }}>
          Dores reais
        </motion.p>

        <motion.h2 variants={fadeUp} style={{
          fontSize: "clamp(1.8rem, 3vw, 2.4rem)",
          fontWeight: 700,
          color: "var(--text-primary)",
          marginBottom: 40,
          letterSpacing: "-0.01em",
        }}>
          Sons familiares?
        </motion.h2>

        <div className="grid grid-cols-3 gap-5" style={{ maxWidth: 1000 }}>
          {pains.map((p, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              className="card-premium card-gold-accent p-7 flex flex-col"
            >
              <span className="text-3xl mb-4">{p.icon}</span>
              <h3 style={{
                fontSize: 18, fontWeight: 700,
                color: "var(--text-primary)", marginBottom: 10,
              }}>{p.title}</h3>
              <p style={{
                fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.65,
              }}>{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </SlideBase>
  );
}

// ════════════════════════════════════════════════════════════════
// SLIDE 5 — VIRADA (Split diagonal)
// ════════════════════════════════════════════════════════════════
function Slide5() {
  return (
    <SlideBase>
      {/* Diagonal split */}
      <div className="absolute inset-0" style={{
        background: "linear-gradient(135deg, var(--bg-0) 50%, var(--bg-3) 50%)"
      }} />

      <div className="absolute inset-0" style={{
        background: "radial-gradient(ellipse at 70% 50%, rgba(212,168,83,0.06), transparent 60%)"
      }} />

      <motion.div
        className="relative z-10 flex items-center justify-between h-full px-[8%]"
        variants={stagger} initial="hidden" animate="show"
      >
        <motion.div variants={slideL} className="max-w-[45%]">
          <p style={{
            fontSize: 12, textTransform: "uppercase", letterSpacing: "0.3em",
            color: "var(--gold)", fontWeight: 600, marginBottom: 16,
          }}>A virada</p>

          <h2 style={{
            fontSize: "clamp(2rem, 3.5vw, 3rem)",
            fontWeight: 800,
            color: "var(--text-primary)",
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
          }}>
            E se existisse um<br />
            <span className="text-gradient-gold">caminho diferente?</span>
          </h2>
        </motion.div>

        <motion.div variants={slideR} className="max-w-[40%]">
          <p style={{
            fontSize: "clamp(1rem, 1.4vw, 1.15rem)",
            color: "var(--text-secondary)",
            lineHeight: 1.75,
          }}>
            Uma comunidade onde cada encontro gera negócios.
            Onde mentores já passaram pelos mesmos desafios que você
            e podem encurtar seu caminho.
          </p>

          <div className="mt-6 flex items-center gap-3">
            <div style={{
              width: 40, height: 1, background: "var(--gold)", opacity: 0.5,
            }} />
            <span style={{
              color: "var(--gold)", fontSize: 13, fontWeight: 600,
              textTransform: "uppercase", letterSpacing: "0.15em",
            }}>Existe.</span>
          </div>
        </motion.div>
      </motion.div>
    </SlideBase>
  );
}

// ════════════════════════════════════════════════════════════════
// SLIDE 6 — SOLUÇÃO (Split 60/40 + photo)
// ════════════════════════════════════════════════════════════════
function Slide6() {
  return (
    <SlideBase>
      <div className="flex h-full">
        {/* Left — text 60% */}
        <motion.div
          className="w-[58%] flex flex-col justify-center px-[6%]"
          variants={stagger} initial="hidden" animate="show"
        >
          <motion.p variants={fadeUp} style={{
            fontSize: 12, textTransform: "uppercase", letterSpacing: "0.3em",
            color: "var(--gold)", fontWeight: 600, marginBottom: 16,
          }}>A solução</motion.p>

          <motion.h2 variants={fadeUp} style={{
            fontSize: "clamp(1.8rem, 3vw, 2.6rem)",
            fontWeight: 800,
            color: "var(--text-primary)",
            lineHeight: 1.15,
            letterSpacing: "-0.01em",
          }}>
            Networking que<br />
            <span className="text-gradient-gold-shine">gera resultado.</span>
          </motion.h2>

          <motion.p variants={fadeUp} style={{
            fontSize: "clamp(0.95rem, 1.2vw, 1.05rem)",
            color: "var(--text-secondary)",
            marginTop: 24,
            lineHeight: 1.7,
            maxWidth: 460,
          }}>
            Eventos presenciais com curadoria. Rodadas de negócio
            facilitadas. Mentorias com quem já fez. Tudo pensado para
            transformar conexão em faturamento.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-8 flex gap-8">
            {[
              { n: "12", l: "Eventos/ano" },
              { n: "150+", l: "Empresários" },
              { n: "R$2M+", l: "Em negócios" },
            ].map((s, i) => (
              <div key={i}>
                <p style={{ fontSize: 28, fontWeight: 800, color: "var(--gold)" }}>{s.n}</p>
                <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2, fontWeight: 500 }}>{s.l}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Right — photo 42% */}
        <motion.div
          className="w-[42%] relative"
          variants={fadeIn} initial="hidden" animate="show"
        >
          <Image src="/images/benefits-bg.jpeg" alt="" fill className="object-cover" />
          <div className="absolute inset-0" style={{
            background: "linear-gradient(to right, var(--bg-0) 0%, transparent 30%)"
          }} />
          <div className="absolute inset-0" style={{
            background: "linear-gradient(to top, var(--bg-0) 0%, transparent 20%)"
          }} />
        </motion.div>
      </div>
    </SlideBase>
  );
}

// ════════════════════════════════════════════════════════════════
// SLIDE 7 — PROPOSTA (Two-column cards)
// ════════════════════════════════════════════════════════════════
function Slide7() {
  const pillars = [
    {
      title: "Rede de Valor",
      items: ["Encontros mensais presenciais", "Rodadas de negócio facilitadas", "Networking com curadoria", "Acesso a comunidade exclusiva"],
      accent: "var(--gold)",
    },
    {
      title: "TIME",
      items: ["Mentorias com especialistas", "Conteúdo estratégico semanal", "Grupo de accountability", "Eventos especiais trimestrais"],
      accent: "var(--gold-light)",
    },
  ];

  return (
    <SlideBase>
      <CornerAccent position="tl" />
      <CornerAccent position="br" />

      <motion.div
        className="relative z-10 flex flex-col justify-center h-full px-[8%]"
        variants={stagger} initial="hidden" animate="show"
      >
        <motion.p variants={fadeUp} style={{
          fontSize: 12, textTransform: "uppercase", letterSpacing: "0.3em",
          color: "var(--gold)", fontWeight: 600, marginBottom: 12,
        }}>O que você recebe</motion.p>

        <motion.h2 variants={fadeUp} style={{
          fontSize: "clamp(1.8rem, 3vw, 2.4rem)",
          fontWeight: 700,
          color: "var(--text-primary)",
          marginBottom: 40,
          letterSpacing: "-0.01em",
        }}>
          Dois pilares, um objetivo.
        </motion.h2>

        <div className="grid grid-cols-2 gap-6" style={{ maxWidth: 900 }}>
          {pillars.map((col, i) => (
            <motion.div key={i} variants={fadeUp} className="card-premium p-8">
              <h3 style={{
                fontSize: 22, fontWeight: 700, color: col.accent, marginBottom: 24,
              }}>{col.title}</h3>
              <ul className="space-y-4">
                {col.items.map((item, j) => (
                  <li key={j} className="flex items-start gap-3">
                    <span style={{
                      width: 6, height: 6, borderRadius: "50%",
                      background: col.accent, flexShrink: 0, marginTop: 7,
                    }} />
                    <span style={{ fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.6 }}>
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </SlideBase>
  );
}

// ════════════════════════════════════════════════════════════════
// SLIDE 8 — MARCA REVEAL (Cinematic centered)
// ════════════════════════════════════════════════════════════════
function Slide8() {
  return (
    <SlideBase>
      <div className="absolute inset-0" style={{
        background: "radial-gradient(circle at 50% 50%, rgba(212,168,83,0.05), transparent 60%)"
      }} />
      <GoldDust />

      <motion.div
        className="relative z-10 flex flex-col items-center justify-center h-full text-center"
        variants={stagger} initial="hidden" animate="show"
      >
        <motion.div variants={scaleReveal} className="mb-8">
          <Image src="/images/logo-rede-de-valor-branco-v2.png" alt="Rede de Valor" width={260} height={85} />
        </motion.div>

        <motion.div variants={fadeUp} className="flex items-center gap-4 mb-8">
          <div style={{ width: 40, height: 1, background: "var(--gold)", opacity: 0.4 }} />
          <span style={{ color: "var(--gold)", fontSize: 13, fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase" }}>
            +
          </span>
          <div style={{ width: 40, height: 1, background: "var(--gold)", opacity: 0.4 }} />
        </motion.div>

        <motion.div variants={scaleReveal}>
          <Image src="/images/logo-time-v2.png" alt="TIME" width={100} height={100} />
        </motion.div>

        <motion.p variants={fadeUp} style={{
          fontSize: "clamp(1rem, 1.5vw, 1.2rem)",
          color: "var(--text-secondary)",
          marginTop: 36,
          maxWidth: 480,
          lineHeight: 1.7,
        }}>
          Duas marcas unidas para criar o ecossistema de networking
          mais relevante para empresários no Brasil.
        </motion.p>
      </motion.div>
    </SlideBase>
  );
}

// ════════════════════════════════════════════════════════════════
// SLIDE 9 — ECOSSISTEMA (Diagram with rings)
// ════════════════════════════════════════════════════════════════
function Slide9() {
  const rings = [
    { label: "Você", r: 0 },
    { label: "Comunidade", r: 80 },
    { label: "Mentores", r: 140 },
    { label: "Mercado", r: 200 },
  ];

  return (
    <SlideBase>
      <CornerAccent position="tl" />

      <motion.div
        className="relative z-10 flex items-center h-full px-[8%]"
        variants={stagger} initial="hidden" animate="show"
      >
        {/* Left text */}
        <motion.div variants={slideL} className="w-[45%]">
          <p style={{
            fontSize: 12, textTransform: "uppercase", letterSpacing: "0.3em",
            color: "var(--gold)", fontWeight: 600, marginBottom: 16,
          }}>Ecossistema</p>

          <h2 style={{
            fontSize: "clamp(1.8rem, 3vw, 2.4rem)",
            fontWeight: 700,
            color: "var(--text-primary)",
            lineHeight: 1.2,
            letterSpacing: "-0.01em",
          }}>
            Você no centro de um<br />
            <span style={{ color: "var(--gold)" }}>ecossistema de valor.</span>
          </h2>

          <p style={{
            fontSize: "clamp(0.95rem, 1.2vw, 1.05rem)",
            color: "var(--text-secondary)",
            marginTop: 20,
            lineHeight: 1.7,
            maxWidth: 400,
          }}>
            Cada camada do ecossistema amplia seu alcance, suas oportunidades
            e seu faturamento.
          </p>
        </motion.div>

        {/* Right — concentric rings */}
        <motion.div variants={scaleIn} className="w-[55%] flex items-center justify-center">
          <div className="relative" style={{ width: 420, height: 420 }}>
            {rings.map((ring, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full flex items-center justify-center"
                style={{
                  width: ring.r * 2 || 20,
                  height: ring.r * 2 || 20,
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  border: i > 0 ? "1px solid" : "none",
                  borderColor: `rgba(212,168,83,${0.4 - i * 0.08})`,
                  background: i === 0 ? "var(--gold)" : "transparent",
                }}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + i * 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                <span style={{
                  position: "absolute",
                  top: i === 0 ? "50%" : -10,
                  left: "50%",
                  transform: i === 0 ? "translate(-50%, -50%)" : "translate(-50%, -100%)",
                  fontSize: i === 0 ? 11 : 12,
                  fontWeight: 600,
                  color: i === 0 ? "var(--bg-0)" : "var(--gold)",
                  whiteSpace: "nowrap",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}>
                  {ring.label}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </SlideBase>
  );
}

// ════════════════════════════════════════════════════════════════
// SLIDE 10 — BENEFÍCIOS (Bento Grid 4x2)
// ════════════════════════════════════════════════════════════════
function Slide10() {
  const benefits = [
    { icon: "🤝", t: "Conexões qualificadas", d: "Networking com empresários que faturam acima de 100k/mês" },
    { icon: "🎯", t: "Rodadas de negócio", d: "Encontros facilitados para gerar parcerias e vendas diretas" },
    { icon: "🧠", t: "Mentoria estratégica", d: "Acesso a mentores que já escalaram negócios de 7 e 8 dígitos" },
    { icon: "🏆", t: "Eventos exclusivos", d: "Encontros presenciais com curadoria e experiências premium" },
    { icon: "📈", t: "Crescimento acelerado", d: "Atalhos validados para escalar sem reinventar a roda" },
    { icon: "🔑", t: "Comunidade fechada", d: "Grupo seleto com accountability e troca constante" },
    { icon: "💡", t: "Conteúdo aplicável", d: "Insights semanais de quem está na trincheira todo dia" },
    { icon: "🌐", t: "Visibilidade", d: "Posicione-se como referência dentro de uma comunidade relevante" },
  ];

  return (
    <SlideBase>
      <motion.div
        className="relative z-10 flex flex-col justify-center h-full px-[6%]"
        variants={stagger} initial="hidden" animate="show"
      >
        <motion.p variants={fadeUp} style={{
          fontSize: 12, textTransform: "uppercase", letterSpacing: "0.3em",
          color: "var(--gold)", fontWeight: 600, marginBottom: 12,
        }}>Benefícios</motion.p>

        <motion.h2 variants={fadeUp} style={{
          fontSize: "clamp(1.6rem, 2.5vw, 2.2rem)",
          fontWeight: 700,
          color: "var(--text-primary)",
          marginBottom: 32,
        }}>
          O que muda no seu negócio.
        </motion.h2>

        <div className="grid grid-cols-4 gap-4" style={{ maxWidth: 1100 }}>
          {benefits.map((b, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              className="p-5 rounded-2xl"
              style={{
                background: "linear-gradient(160deg, rgba(20,18,14,0.8), rgba(10,10,8,0.9))",
                border: "1px solid var(--border-card)",
              }}
            >
              <span className="text-2xl">{b.icon}</span>
              <h4 style={{
                fontSize: 14, fontWeight: 700, color: "var(--text-primary)",
                marginTop: 10, marginBottom: 6,
              }}>{b.t}</h4>
              <p style={{ fontSize: 12.5, color: "var(--text-muted)", lineHeight: 1.55 }}>{b.d}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </SlideBase>
  );
}

// ════════════════════════════════════════════════════════════════
// SLIDE 11 — VALOR ÂNCORA (Stat callout)
// ════════════════════════════════════════════════════════════════
function Slide11({ active }: { active: boolean }) {
  const anchor = useCounter(15500, 1800, active);

  return (
    <SlideBase>
      <div className="absolute inset-0" style={{
        background: "radial-gradient(ellipse at 50% 40%, rgba(212,168,83,0.04), transparent 60%)"
      }} />
      <CornerAccent position="tr" />
      <CornerAccent position="bl" />

      <motion.div
        className="relative z-10 flex flex-col items-center justify-center h-full text-center px-[6%]"
        variants={stagger} initial="hidden" animate="show"
      >
        <motion.p variants={fadeUp} style={{
          fontSize: 12, textTransform: "uppercase", letterSpacing: "0.3em",
          color: "var(--gold)", fontWeight: 600, marginBottom: 20,
        }}>Valor real</motion.p>

        <motion.p variants={fadeUp} style={{
          fontSize: "clamp(1rem, 1.4vw, 1.15rem)",
          color: "var(--text-secondary)",
          marginBottom: 16,
        }}>
          Se você fosse contratar tudo isso separado, investiria:
        </motion.p>

        <motion.div variants={scaleIn}>
          <p style={{
            fontSize: "clamp(3.5rem, 9vw, 7rem)",
            fontWeight: 800,
            color: "var(--text-primary)",
            lineHeight: 1,
            letterSpacing: "-0.03em",
            position: "relative",
          }}>
            <span style={{ opacity: 0.3 }}>R$</span>
            {anchor.toLocaleString("pt-BR")}
            {/* Strikethrough line */}
            <motion.div
              className="absolute left-0 right-0"
              style={{
                top: "55%", height: 3,
                background: "linear-gradient(90deg, transparent, var(--gold), transparent)",
              }}
              initial={{ scaleX: 0 }}
              animate={active ? { scaleX: 1 } : {}}
              transition={{ delay: 2, duration: 0.6, ease: "easeOut" }}
            />
          </p>
        </motion.div>

        <motion.p variants={fadeUp} style={{
          fontSize: "clamp(1rem, 1.5vw, 1.2rem)",
          color: "var(--text-muted)",
          marginTop: 24,
          maxWidth: 480,
          lineHeight: 1.7,
        }}>
          Entre mentorias, eventos, comunidade e conteúdos exclusivos —
          o valor real supera R$15.000 por ano.
        </motion.p>
      </motion.div>
    </SlideBase>
  );
}

// ════════════════════════════════════════════════════════════════
// SLIDE 12 — PREÇO REAL (Card CTA com glow)
// ════════════════════════════════════════════════════════════════
function Slide12() {
  return (
    <SlideBase>
      <div className="absolute inset-0" style={{
        background: "radial-gradient(ellipse at 50% 50%, rgba(212,168,83,0.06), transparent 50%)"
      }} />

      <motion.div
        className="relative z-10 flex flex-col items-center justify-center h-full"
        variants={stagger} initial="hidden" animate="show"
      >
        <motion.div
          variants={scaleIn}
          className="urgency-card px-12 py-14 text-center"
          style={{ maxWidth: 560 }}
        >
          <div className="urgency-shimmer" />

          <p style={{
            fontSize: 12, textTransform: "uppercase", letterSpacing: "0.3em",
            color: "var(--gold)", fontWeight: 600, marginBottom: 8,
          }}>Investimento anual</p>

          <p style={{
            fontSize: 16, color: "var(--text-muted)", marginBottom: 24,
            textDecoration: "line-through",
          }}>
            De R$15.500
          </p>

          <p style={{
            fontSize: "clamp(3rem, 7vw, 5rem)",
            fontWeight: 800,
            lineHeight: 1,
            letterSpacing: "-0.03em",
          }}>
            <span style={{ color: "var(--text-muted)", fontSize: "0.5em" }}>R$</span>
            <span className="text-gradient-gold-shine">5.000</span>
          </p>

          <p style={{
            fontSize: 14, color: "var(--text-secondary)", marginTop: 8,
          }}>
            ou 12x de R$497
          </p>

          <div style={{
            width: 60, height: 1, background: "var(--gold)", opacity: 0.3,
            margin: "24px auto",
          }} />

          <p style={{
            fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.65,
            maxWidth: 380, margin: "0 auto",
          }}>
            Acesso completo a todos os eventos, mentorias,
            comunidade e conteúdos exclusivos por 12 meses.
          </p>
        </motion.div>
      </motion.div>
    </SlideBase>
  );
}

// ════════════════════════════════════════════════════════════════
// SLIDE 13 — URGÊNCIA (Asymmetric + sidebar badge)
// ════════════════════════════════════════════════════════════════
function Slide13() {
  return (
    <SlideBase>
      <motion.div
        className="relative z-10 flex h-full"
        variants={stagger} initial="hidden" animate="show"
      >
        {/* Sidebar badge */}
        <motion.div
          variants={slideL}
          className="w-[30%] flex flex-col items-center justify-center"
          style={{
            background: "linear-gradient(180deg, rgba(212,168,83,0.08), rgba(212,168,83,0.02))",
            borderRight: "1px solid var(--border-card)",
          }}
        >
          <div style={{
            width: 80, height: 80, borderRadius: "50%",
            background: "linear-gradient(135deg, var(--gold-light), var(--gold-dark))",
            display: "flex", alignItems: "center", justifyContent: "center",
            marginBottom: 16,
          }}>
            <span style={{ fontSize: 32, fontWeight: 800, color: "var(--bg-0)" }}>!</span>
          </div>
          <p style={{
            fontSize: 14, fontWeight: 700, color: "var(--gold)",
            textTransform: "uppercase", letterSpacing: "0.2em",
          }}>Vagas<br />limitadas</p>
        </motion.div>

        {/* Main content */}
        <motion.div
          variants={slideR}
          className="w-[70%] flex flex-col justify-center px-[6%]"
        >
          <p style={{
            fontSize: 12, textTransform: "uppercase", letterSpacing: "0.3em",
            color: "var(--gold)", fontWeight: 600, marginBottom: 16,
          }}>Urgência</p>

          <h2 style={{
            fontSize: "clamp(1.8rem, 3vw, 2.4rem)",
            fontWeight: 700,
            color: "var(--text-primary)",
            lineHeight: 1.2,
            marginBottom: 24,
          }}>
            Essa condição tem<br />
            <span style={{ color: "var(--gold)" }}>prazo para acabar.</span>
          </h2>

          <div className="space-y-4" style={{ maxWidth: 480 }}>
            {[
              "Apenas 30 vagas disponíveis por trimestre",
              "Bônus de fundador para os primeiros 15 membros",
              "Próximo encontro presencial em 2 semanas",
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <span style={{
                  width: 20, height: 20, borderRadius: "50%",
                  background: "rgba(212,168,83,0.1)",
                  border: "1px solid rgba(212,168,83,0.25)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0, marginTop: 2,
                  fontSize: 10, color: "var(--gold)",
                }}>✓</span>
                <span style={{ fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.6 }}>
                  {item}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </SlideBase>
  );
}

// ════════════════════════════════════════════════════════════════
// SLIDE 14 — DECISÃO (Comparison split)
// ════════════════════════════════════════════════════════════════
function Slide14() {
  return (
    <SlideBase>
      <motion.div
        className="relative z-10 flex flex-col justify-center h-full px-[8%]"
        variants={stagger} initial="hidden" animate="show"
      >
        <motion.h2 variants={fadeUp} style={{
          fontSize: "clamp(1.8rem, 3vw, 2.4rem)",
          fontWeight: 700,
          color: "var(--text-primary)",
          marginBottom: 40,
          textAlign: "center",
        }}>
          Duas opções. Uma decisão.
        </motion.h2>

        <div className="grid grid-cols-2 gap-6 mx-auto" style={{ maxWidth: 900 }}>
          {/* Option A — without */}
          <motion.div
            variants={slideL}
            className="p-8 rounded-2xl"
            style={{
              background: "linear-gradient(160deg, rgba(15,13,10,0.9), rgba(8,8,6,0.95))",
              border: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            <p style={{
              fontSize: 13, fontWeight: 600, color: "var(--text-muted)",
              textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 20,
            }}>Sem a Rede</p>

            <ul className="space-y-4">
              {[
                "Continuar crescendo sozinho",
                "Networking genérico sem resultado",
                "Aprender tudo na tentativa e erro",
                "Ficar invisível no mercado",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span style={{ color: "var(--text-muted)", fontSize: 14, marginTop: 1 }}>✕</span>
                  <span style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.6 }}>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Option B — with */}
          <motion.div
            variants={slideR}
            className="p-8 rounded-2xl"
            style={{
              background: "linear-gradient(160deg, rgba(22,18,10,0.95), rgba(12,10,6,0.98))",
              border: "1px solid var(--border-hover)",
              boxShadow: "0 0 40px rgba(212,168,83,0.08)",
            }}
          >
            <p style={{
              fontSize: 13, fontWeight: 600, color: "var(--gold)",
              textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 20,
            }}>Com a Rede de Valor</p>

            <ul className="space-y-4">
              {[
                "Crescer com apoio de quem já fez",
                "Gerar negócios a cada encontro",
                "Encurtar caminho com mentores reais",
                "Posicionar-se como referência",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span style={{ color: "var(--gold)", fontSize: 14, marginTop: 1 }}>✓</span>
                  <span style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6 }}>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </motion.div>
    </SlideBase>
  );
}

// ════════════════════════════════════════════════════════════════
// SLIDE 15 — CTA FINAL (Photo + overlay)
// ════════════════════════════════════════════════════════════════
function Slide15() {
  return (
    <SlideBase>
      {/* Background photo */}
      <div className="absolute inset-0">
        <Image src="/images/cta-bg.jpeg" alt="" fill className="object-cover" />
        <div className="absolute inset-0" style={{
          background: "linear-gradient(to top, rgba(0,0,0,0.92) 30%, rgba(0,0,0,0.5) 100%)"
        }} />
      </div>

      <GoldDust />

      <motion.div
        className="relative z-10 flex flex-col items-center justify-center h-full text-center px-[6%]"
        variants={stagger} initial="hidden" animate="show"
      >
        <motion.div variants={scaleReveal} className="mb-6">
          <Image src="/images/logo-rede-de-valor-branco-v2.png" alt="Rede de Valor" width={200} height={66} />
        </motion.div>

        <motion.h2 variants={fadeUp} style={{
          fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)",
          fontWeight: 800,
          color: "var(--text-primary)",
          lineHeight: 1.15,
          letterSpacing: "-0.01em",
          maxWidth: 600,
        }}>
          Pronto para jogar
          <br />
          <span className="text-gradient-gold-shine">no próximo nível?</span>
        </motion.h2>

        <motion.p variants={fadeUp} style={{
          fontSize: "clamp(0.95rem, 1.3vw, 1.1rem)",
          color: "var(--text-secondary)",
          marginTop: 20,
          maxWidth: 440,
          lineHeight: 1.7,
        }}>
          Garanta sua vaga e entre para a comunidade que está
          transformando a forma de fazer negócios.
        </motion.p>

        <motion.div variants={fadeUp} className="mt-10 flex flex-col items-center gap-4">
          <a
            href="https://wa.me/5500000000000?text=Quero%20saber%20mais%20sobre%20a%20Rede%20de%20Valor"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-hero-cta"
            style={{ fontFamily: FONT }}
          >
            Quero minha vaga →
          </a>

          <span style={{ fontSize: 13, color: "var(--text-muted)" }}>
            Vagas limitadas — fale com nosso time agora
          </span>
        </motion.div>

        <motion.div variants={fadeIn} className="mt-12 flex items-center gap-4">
          <Image src="/images/logo-rede-de-valor.svg" alt="" width={32} height={32} style={{ opacity: 0.4 }} />
          <span style={{ color: "var(--text-muted)", fontSize: 12 }}>×</span>
          <Image src="/images/logo-time-v2.png" alt="" width={32} height={32} style={{ opacity: 0.4 }} />
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
  const [dir, setDir] = useState(1);
  const touchRef = useRef<number | null>(null);
  const slideRef = useRef(slide);
  slideRef.current = slide;

  // Keyboard navigation
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

  const go = (n: number) => {
    setDir(n > slide ? 1 : -1);
    setSlide(n);
  };

  const next = () => {
    if (slide < TOTAL - 1) { setDir(1); setSlide(s => s + 1); }
  };

  const prev = () => {
    if (slide > 0) { setDir(-1); setSlide(s => s - 1); }
  };

  // Touch/swipe
  const onTouchStart = (e: React.TouchEvent) => { touchRef.current = e.touches[0].clientX; };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchRef.current === null) return;
    const diff = touchRef.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) { diff > 0 ? next() : prev(); }
    touchRef.current = null;
  };

  const CurrentSlide = SLIDES[slide];

  return (
    <div
      className="relative w-screen h-screen overflow-hidden select-none"
      style={{ background: "var(--bg-0)", fontFamily: FONT }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Slide content */}
      <AnimatePresence mode="wait" custom={dir}>
        <motion.div
          key={slide}
          custom={dir}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <CurrentSlide active={true} />
        </motion.div>
      </AnimatePresence>

      {/* Navigation arrows */}
      {slide > 0 && (
        <button
          onClick={prev}
          className="absolute left-5 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.08)",
            backdropFilter: "blur(8px)",
          }}
          aria-label="Slide anterior"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 3L5 8L10 13" stroke="var(--text-secondary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}

      {slide < TOTAL - 1 && (
        <button
          onClick={next}
          className="absolute right-5 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.08)",
            backdropFilter: "blur(8px)",
          }}
          aria-label="Próximo slide"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M6 3L11 8L6 13" stroke="var(--text-secondary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}

      {/* Bottom progress bar + dots */}
      <div className="absolute bottom-0 left-0 right-0 z-30">
        {/* Progress bar */}
        <div className="w-full h-[2px]" style={{ background: "rgba(255,255,255,0.03)" }}>
          <motion.div
            className="h-full"
            style={{ background: "var(--gold)" }}
            animate={{ width: `${((slide + 1) / TOTAL) * 100}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>

        {/* Dot navigation */}
        <div className="flex items-center justify-center gap-2 py-4"
          style={{ background: "linear-gradient(to top, rgba(0,0,0,0.6), transparent)" }}
        >
          {Array.from({ length: TOTAL }).map((_, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              className="transition-all duration-300 cursor-pointer"
              style={{
                width: i === slide ? 24 : 6,
                height: 6,
                borderRadius: 3,
                background: i === slide ? "var(--gold)" : "rgba(255,255,255,0.15)",
              }}
              aria-label={`Ir para slide ${i + 1}`}
            />
          ))}

          <span className="ml-4" style={{
            fontSize: 11, color: "var(--text-muted)", fontWeight: 500,
            fontFamily: FONT,
          }}>
            {String(slide + 1).padStart(2, "0")}/{TOTAL}
          </span>
        </div>
      </div>
    </div>
  );
}
