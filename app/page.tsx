"use client";

import Image from "next/image";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";

/* ================================================================
   ANIMATION HELPERS
   ================================================================ */
const stagger = { visible: { transition: { staggerChildren: 0.12 } } };

function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return reduced;
}

function Section({ children, className = "", id }: { children: React.ReactNode; className?: string; id?: string }) {
  const mounted = useMounted();
  const reduced = useReducedMotion();
  return (
    <motion.section
      id={id}
      className={`relative overflow-hidden ${className}`}
      initial={mounted && !reduced ? "hidden" : false}
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={reduced ? undefined : stagger}
    >
      {children}
    </motion.section>
  );
}

function Reveal({ children, className = "", delay = 0, direction = "up", style }: {
  children: React.ReactNode; className?: string; delay?: number;
  direction?: "up" | "left" | "right" | "scale";
  style?: React.CSSProperties;
}) {
  const dirs = {
    up: { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0 } },
    left: { hidden: { opacity: 0, x: -50 }, visible: { opacity: 1, x: 0 } },
    right: { hidden: { opacity: 0, x: 50 }, visible: { opacity: 1, x: 0 } },
    scale: { hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1 } },
  };
  const mounted = useMounted();
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      style={style}
      initial={mounted && !reduced ? "hidden" : false}
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      variants={reduced ? undefined : {
        hidden: dirs[direction].hidden,
        visible: { ...dirs[direction].visible, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay } },
      }}
    >
      {children}
    </motion.div>
  );
}

/* ================================================================
   COUNT UP HOOK
   ================================================================ */
function CountUp({ target, suffix = "" }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const step = target / 40;
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 30);
    return () => clearInterval(timer);
  }, [isInView, target]);

  return <span ref={ref}>{count}{suffix}</span>;
}

/* ================================================================
   COUNTDOWN TIMER
   ================================================================ */
const EVENT_DATE = new Date("2025-05-15T19:00:00-03:00");

function CountdownTimer({ compact = false }: { compact?: boolean }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    function calc() {
      const diff = EVENT_DATE.getTime() - Date.now();
      if (diff <= 0) { setExpired(true); return; }
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    }
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, []);

  if (expired) return null;

  const units = [
    { label: "Dias", value: timeLeft.days },
    { label: "Horas", value: timeLeft.hours },
    { label: "Min", value: timeLeft.minutes },
    { label: "Seg", value: timeLeft.seconds },
  ];

  if (compact) {
    return (
      <div className="inline-flex items-center gap-2">
        {units.map((u, i) => (
          <span key={u.label} className="flex items-center gap-2">
            <span className="text-sm font-semibold tabular-nums" style={{ color: "var(--gold)" }}>
              {String(u.value).padStart(2, "0")}
            </span>
            <span className="text-[10px] uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>{u.label}</span>
            {i < units.length - 1 && <span className="text-xs" style={{ color: "rgba(212,168,83,0.3)" }}>:</span>}
          </span>
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center gap-3 md:gap-4">
      {units.map((u, i) => (
        <div key={u.label} className="flex items-center gap-3 md:gap-4">
          <div className="flex flex-col items-center">
            <div
              className="w-16 h-16 md:w-20 md:h-20 rounded-xl flex items-center justify-center tabular-nums text-2xl md:text-3xl font-bold"
              style={{
                background: "rgba(212,168,83,0.06)",
                border: "1px solid rgba(212,168,83,0.15)",
                color: "var(--gold)",
                fontFamily: "var(--font-heading), sans-serif",
              }}
            >
              {String(u.value).padStart(2, "0")}
            </div>
            <span className="text-[10px] uppercase tracking-wider mt-2" style={{ color: "var(--text-muted)" }}>{u.label}</span>
          </div>
          {i < units.length - 1 && (
            <span className="text-xl font-light -mt-5" style={{ color: "rgba(212,168,83,0.3)" }}>:</span>
          )}
        </div>
      ))}
    </div>
  );
}

/* ================================================================
   SPEAKER DATA
   ================================================================ */
const speakers = [
  {
    name: "Tony Granado",
    role: "Sócio",
    specialty: "Empresário e Estrategista de Negócios",
    image: "/images/expert-tony-granado.webp",
    imagePosition: "center 30%",
    bio: "Empresário cristão, comunicador e estrategista de negócios, com forte atuação em conexões, negociação e desenvolvimento de projetos. Guiado pela fé e por valores sólidos, atua na comunicação com propósito e impacto, sendo um dos idealizadores do ecossistema Rede de Valor + TIME.",
  },
  {
    name: "Izaias Pissinini",
    role: "Sócio",
    specialty: "Finanças e Gestão Estratégica",
    image: "/images/expert-izaias-pissinini.webp",
    bio: "Contador e empresário com mais de 23 anos de experiência em contabilidade e finanças, especialista em contabilidade estratégica e cofundador da Rede de Valor.",
  },
  {
    name: "Deivison Ferreira",
    role: "Sócio",
    specialty: "Liderança e Comportamento Humano",
    image: "/images/expert-deivison-ferreira.webp",
    bio: "Especialista em liderança e comportamento humano, com mais de 30 anos de experiência e impacto em milhares de alunos e empresas.",
  },
  {
    name: "Igor Ferreira",
    role: "Sócio",
    specialty: "Empreendedor e Gestão Corporativa",
    image: "/images/expert-igor-ferreira.jpg",
    bio: "Empresário, fundador da ICF Group e referência em liderança, gestão e desenvolvimento corporativo em nível nacional.",
  },
  {
    name: "Mamá Brito",
    role: "Sócio",
    specialty: "Empresário Multisegmento",
    image: "/images/expert-mama-brito.webp",
    bio: "Atuação em múltiplos segmentos com forte visão de crescimento e geração de oportunidades no mercado.",
  },
];

/* ================================================================
   BENEFITS DATA
   ================================================================ */
const benefits = [
  {
    title: "Networking de Alto Nível",
    desc: "Conexões estratégicas com empresários, investidores e líderes de mercado.",
    icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" /></svg>,
  },
  {
    title: "Podcast Profissional",
    desc: "Gravação de episódios + cortes para redes sociais + posicionamento de marca.",
    icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" /></svg>,
  },
  {
    title: "Entrevista em Rádio",
    desc: "Autoridade com visibilidade na mídia tradicional e conteúdo multiplataforma.",
    icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 7.5l16.5-4.125M12 6.75c-2.708 0-5.363.224-7.948.655C2.999 7.58 2.25 8.507 2.25 9.574v9.176A2.25 2.25 0 004.5 21h15a2.25 2.25 0 002.25-2.25V9.574c0-1.067-.75-1.994-1.802-2.169A48.329 48.329 0 0012 6.75z" /></svg>,
  },
  {
    title: "Cursos e Treinamentos",
    desc: "Conteúdos exclusivos online e presenciais para acelerar seus resultados.",
    icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" /></svg>,
  },
  {
    title: "Eventos Mensais Exclusivos",
    desc: "Encontros presenciais com palestras, dinâmicas e oportunidades de negócio.",
    icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>,
  },
  {
    title: "Projetos para Investidores",
    desc: "Mentoria para estruturar suas ideias e captar oportunidades reais.",
    icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" /></svg>,
  },
];

/* ================================================================
   STEPS DATA
   ================================================================ */
const steps = [
  { num: "01", title: "Preencha o formulário", desc: "Deixe seus dados e nossa equipe entrará em contato." },
  { num: "02", title: "Conversa consultiva", desc: "Entenda como a Rede pode acelerar o seu negócio." },
  { num: "03", title: "Acesse o ecossistema", desc: "Conteúdos, treinamentos e comunidade exclusiva." },
  { num: "04", title: "Participe dos encontros", desc: "Eventos mensais com palestras e networking." },
  { num: "05", title: "Acelere seus resultados", desc: "Parcerias, negócios e crescimento concreto." },
];

/* ================================================================
   STATS DATA
   ================================================================ */
const stats = [
  { value: 100, suffix: "+", label: "Empresários conectados" },
  { value: 30, suffix: "+", label: "Transformando líderes e empresários", prefix: "anos" },
  { value: 12, suffix: "", label: "Networking e conexões estratégicas", prefix: "encontros/ano" },
  { value: 0, suffix: "", label: "Crescimento contínuo da rede", special: "Ambiente em expansão" },
];

/* ================================================================
   TESTIMONIALS DATA (placeholder)
   ================================================================ */
const testimonials = [
  {
    quote: "Desde que entrei para a Rede de Valor, meu faturamento cresceu 40%. As conexões certas mudam tudo.",
    name: "Ricardo M.",
    initials: "RM",
    company: "Empresário · Setor Imobiliário",
  },
  {
    quote: "O ambiente é diferente de tudo que já participei. Aqui não é só networking — é crescimento real.",
    name: "Patrícia S.",
    initials: "PS",
    company: "CEO · Agência Digital",
  },
  {
    quote: "Em 3 meses, fechei 2 parcerias estratégicas que sozinho levaria anos para conseguir.",
    name: "Carlos A.",
    initials: "CA",
    company: "Fundador · Consultoria Empresarial",
  },
];

/* ================================================================
   PAGE
   ================================================================ */
export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showStickyCTA, setShowStickyCTA] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const formRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        setScrolled(y > 40);
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        setScrollProgress(docHeight > 0 ? y / docHeight : 0);
        const pastHero = y > window.innerHeight * 0.8;
        const formEl = document.getElementById("formulario");
        const nearForm = formEl ? formEl.getBoundingClientRect().top < window.innerHeight * 1.2 : false;
        setShowStickyCTA(pastHero && !nearForm);
        ticking = false;
      });
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main>
      <a
        href="#formulario"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60] focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm focus:font-medium"
        style={{ background: "var(--gold)", color: "#000" }}
      >
        Ir para formulário
      </a>

      {/* ─── SCROLL PROGRESS BAR ─── */}
      <div className="fixed top-0 left-0 right-0 z-[60] h-[2px] pointer-events-none">
        <div
          className="h-full origin-left transition-transform duration-100"
          style={{
            transform: `scaleX(${scrollProgress})`,
            background: "linear-gradient(90deg, var(--gold-dark), var(--gold), var(--gold-light))",
            opacity: scrollProgress > 0.01 ? 1 : 0,
          }}
        />
      </div>

      {/* ─── STICKY CTA BAR ─── */}
      <AnimatePresence>
        {showStickyCTA && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 pointer-events-none"
          >
            <a
              href="#formulario"
              className="group relative block w-full cursor-pointer pointer-events-auto"
            >
              {/* Outer glow ring */}
              <div className="absolute -inset-[1px] rounded-2xl opacity-60 transition-opacity duration-500" style={{ background: "linear-gradient(135deg, rgba(232,201,118,0.4), rgba(212,168,83,0.2), rgba(184,144,58,0.4))", filter: "blur(4px)" }} />
              {/* Button body */}
              <div
                className="relative flex items-center justify-center w-full px-6 py-4 rounded-2xl overflow-hidden transition-all duration-300 active:scale-[0.98]"
                style={{
                  background: "linear-gradient(135deg, #E8C976 0%, #D4A853 30%, #B8903A 70%, #A07C2A 100%)",
                  color: "#0a0908",
                  boxShadow: "0 -4px 24px rgba(0,0,0,0.4), 0 4px 20px rgba(212,168,83,0.3), inset 0 1px 0 rgba(255,255,255,0.35), inset 0 -2px 4px rgba(0,0,0,0.1)",
                }}
              >
                <span className="absolute inset-0 -translate-x-full transition-transform duration-700 ease-out bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
                <span className="absolute top-0 left-[10%] right-[10%] h-px pointer-events-none" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)" }} />
                <span className="relative text-sm font-semibold">Quero participar</span>
              </div>
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── NAVBAR ─── */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-4 md:px-6">
        <div
          className="max-w-[1100px] mx-auto mt-4 px-5 md:px-8 py-3 rounded-2xl flex items-center justify-between transition-all duration-500"
          style={{
            background: scrolled ? "rgba(12, 11, 10, 0.88)" : "rgba(12, 11, 10, 0.4)",
            backdropFilter: "blur(24px) saturate(180%)",
            border: `1px solid ${scrolled ? "rgba(212, 168, 83, 0.12)" : "rgba(255,255,255,0.04)"}`,
            boxShadow: scrolled ? "0 8px 32px rgba(0,0,0,0.4), 0 0 0 0.5px rgba(212,168,83,0.06)" : "none",
          }}
        >
          {/* Logos */}
          <a href="#" className="flex items-center gap-3 flex-shrink-0">
            <Image src="/images/logo-rede-de-valor-v1.webp" alt="Rede de Valor" width={120} height={40} className="h-7 md:h-8 w-auto" />
            <span className="text-[10px] font-light" style={{ color: "rgba(212, 168, 83, 0.3)" }}>+</span>
            <Image src="/images/logo-time-v2.webp" alt="TIME" width={80} height={24} className="h-5 md:h-6 w-auto opacity-80" />
          </a>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {[
              { label: "Benefícios", href: "#beneficios" },
              { label: "Como Funciona", href: "#como-funciona" },
              { label: "Quem Somos", href: "#quem-somos" },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="relative text-sm text-[var(--text-secondary)] hover:text-white transition-colors duration-300 cursor-pointer group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-px group-hover:w-full transition-all duration-300" style={{ background: "var(--gold)" }} />
              </a>
            ))}
          </div>

          {/* Desktop CTA */}
          <a href="#formulario" className="group hidden md:inline-block relative cursor-pointer">
            <div className="absolute -inset-[1px] rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: "linear-gradient(135deg, rgba(232,201,118,0.3), rgba(212,168,83,0.15), rgba(184,144,58,0.3))", filter: "blur(3px)" }} />
            <div className="relative px-5 py-2.5 text-sm font-medium rounded-xl overflow-hidden transition-all duration-300 group-hover:scale-[1.03] active:scale-[0.98]" style={{ background: "linear-gradient(135deg, #E8C976 0%, #D4A853 30%, #B8903A 70%, #A07C2A 100%)", color: "#0a0908", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.3), inset 0 -1px 3px rgba(0,0,0,0.1)" }}>
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
              <span className="relative">Quero participar</span>
            </div>
          </a>

          {/* Mobile hamburger */}
          <button
            className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 cursor-pointer"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menu"
            aria-expanded={mobileMenuOpen}
          >
            <motion.span animate={{ rotate: mobileMenuOpen ? 45 : 0, y: mobileMenuOpen ? 8 : 0 }} className="w-6 h-0.5 bg-white rounded-full block" />
            <motion.span animate={{ opacity: mobileMenuOpen ? 0 : 1 }} className="w-6 h-0.5 bg-white rounded-full block" />
            <motion.span animate={{ rotate: mobileMenuOpen ? -45 : 0, y: mobileMenuOpen ? -8 : 0 }} className="w-6 h-0.5 bg-white rounded-full block" />
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="md:hidden mx-4 mt-2 rounded-2xl p-6 flex flex-col gap-5"
              style={{ background: "rgba(8,7,5,0.95)", backdropFilter: "blur(24px)", border: "1px solid rgba(212,168,83,0.1)", boxShadow: "0 16px 48px rgba(0,0,0,0.5)" }}
            >
              {[
                { label: "Benefícios", href: "#beneficios" },
                { label: "Como Funciona", href: "#como-funciona" },
                { label: "Quem Somos", href: "#quem-somos" },
              ].map((link) => (
                <a key={link.href} href={link.href} onClick={() => setMobileMenuOpen(false)} className="text-lg text-[var(--text-secondary)] hover:text-[var(--gold)] transition-colors cursor-pointer">
                  {link.label}
                </a>
              ))}
              <a href="#formulario" onClick={() => setMobileMenuOpen(false)} className="group relative cursor-pointer block">
                {/* Outer glow ring */}
                <div className="absolute -inset-[1px] rounded-xl opacity-60 group-hover:opacity-100 transition-opacity duration-500" style={{ background: "linear-gradient(135deg, rgba(232,201,118,0.4), rgba(212,168,83,0.2), rgba(184,144,58,0.4))", filter: "blur(4px)" }} />
                {/* Button body */}
                <div
                  className="relative flex items-center justify-center py-3 rounded-xl overflow-hidden transition-all duration-300 group-hover:scale-[1.02] active:scale-[0.98]"
                  style={{
                    background: "linear-gradient(135deg, #E8C976 0%, #D4A853 30%, #B8903A 70%, #A07C2A 100%)",
                    color: "#0a0908",
                    boxShadow: "0 8px 40px rgba(212, 168, 83, 0.35), 0 2px 12px rgba(212, 168, 83, 0.2), inset 0 1px 0 rgba(255,255,255,0.35), inset 0 -2px 4px rgba(0,0,0,0.1)",
                  }}
                >
                  <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
                  <span className="absolute top-0 left-[10%] right-[10%] h-px pointer-events-none" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)" }} />
                  <span className="relative font-semibold">Quero participar</span>
                </div>
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ─── 1. HERO ─── */}
      <section ref={heroRef} className="relative min-h-[100svh] noise flex items-center overflow-hidden">
        {/* Background — Mobile (vertical video) */}
        <div className="absolute inset-0 md:hidden" aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/hero-mobile-poster.jpg" alt="" className="absolute inset-0 w-full h-full object-cover object-center" />
          <video
            className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
            autoPlay
            loop
            muted
            playsInline
            disablePictureInPicture
            controlsList="nodownload nofullscreen noremoteplayback"
            poster="/images/hero-mobile-poster.jpg"
          >
            <source src="/images/hero-video-mobile.webm" type="video/webm" />
            <source src="/images/hero-video-mobile.mp4" type="video/mp4" />
          </video>
        </div>
        {/* Background — Desktop (horizontal video) */}
        <div className="absolute inset-0 hidden md:block" aria-hidden="true">
          <Image src="/images/hero-bg.jpeg" alt="" fill className="object-cover object-top" priority sizes="100vw" />
          <video
            className="absolute inset-0 w-full h-full object-cover object-top"
            autoPlay
            loop
            muted
            playsInline
            poster="/images/hero-bg.jpeg"
          >
            <source src="/images/hero-video.webm" type="video/webm" />
            <source src="/images/hero-video.mp4" type="video/mp4" />
          </video>
        </div>

        {/* Dark overlay for text legibility */}
        <div className="absolute inset-0 md:hidden" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.72) 30%, rgba(0,0,0,0.55) 55%, rgba(0,0,0,0.4) 70%, rgba(0,0,0,0.92) 100%)" }} />
        <div className="absolute inset-0 hidden md:block" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.65) 35%, rgba(0,0,0,0.7) 65%, rgba(0,0,0,0.95) 100%)" }} />

        {/* Abstract gold decorative rings — Stitch "Private Atelier" inspired */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute hidden lg:block" style={{ top: "15%", right: "8%", width: "280px", height: "280px", borderRadius: "50%", border: "1px solid rgba(212, 168, 83, 0.06)", opacity: 0.7 }} />
          <div className="absolute hidden lg:block" style={{ top: "20%", right: "12%", width: "180px", height: "180px", borderRadius: "50%", border: "1px solid rgba(212, 168, 83, 0.04)" }} />
          <div className="absolute hidden lg:block animate-slow-spin" style={{ bottom: "20%", left: "5%", width: "200px", height: "200px", borderRadius: "50%", border: "1px solid rgba(212, 168, 83, 0.05)" }} />
        </div>

        {/* Particles */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="particle particle-1" style={{ bottom: "20%", left: "15%" }} />
          <div className="particle particle-2" style={{ bottom: "30%", left: "35%" }} />
          <div className="particle particle-3" style={{ bottom: "15%", right: "25%" }} />
          <div className="particle particle-4" style={{ bottom: "25%", right: "15%" }} />
          <div className="particle particle-5" style={{ bottom: "35%", left: "55%" }} />
          <div className="particle particle-6" style={{ bottom: "10%", left: "70%" }} />
        </div>

        <div className="relative z-30 w-full max-w-4xl mx-auto px-5 md:px-12 pt-20 md:pt-32 pb-8 md:pb-20">
          <div className="flex flex-col items-center text-center">
            {/* Logos — desktop only */}
            <div className="items-center gap-6 mb-8" style={{ display: "none" }} id="hero-logos">
              <Image src="/images/logo-rede-de-valor-v1.webp" alt="Rede de Valor" width={200} height={80} className="h-11 sm:h-14 md:h-16 w-auto opacity-90" />
              <span className="text-lg font-light" style={{ color: "rgba(212, 168, 83, 0.4)" }}>+</span>
              <Image src="/images/logo-time-v2.webp" alt="TIME Escola de Negócios" width={160} height={48} className="h-7 sm:h-9 md:h-10 w-auto opacity-90" />
            </div>

            {/* Eyebrow text */}
            <span
              className="inline-flex items-center gap-2 text-[11px] md:text-xs uppercase tracking-[0.25em] mb-5 md:mb-6"
              style={{ color: "var(--gold)", opacity: 0.85 }}
            >
              <span className="w-5 h-px" style={{ background: "var(--gold)", opacity: 0.5 }} />
              Exclusivo para empresários
              <span className="w-5 h-px" style={{ background: "var(--gold)", opacity: 0.5 }} />
            </span>

            <h1
              className="text-gradient-white text-[2.5rem] sm:text-4xl md:text-5xl lg:text-[3.8rem] leading-[1.1] mb-4 md:mb-6 mx-auto"
              style={{ fontFamily: "var(--font-heading), sans-serif", fontWeight: 400, letterSpacing: "-0.03em", maxWidth: "18ch" }}
            >
              Um novo nível de{" "}
              <span style={{ fontWeight: 700, WebkitTextFillColor: "#fff" }}>networking</span> para quem quer{" "}
              <span className="text-gradient-gold-shine" style={{ fontWeight: 700 }}>crescer de verdade.</span>
            </h1>

            <p
              className="text-sm md:text-lg mb-6 md:mb-10 max-w-2xl mx-auto leading-[1.45] md:leading-[1.85]"
              style={{ color: "rgba(240, 237, 230, 0.95)", textShadow: "0 1px 8px rgba(0,0,0,0.7), 0 0 20px rgba(0,0,0,0.5)" }}
            >
              A união da <span className="font-semibold text-white">Rede de Valor</span> com a{" "}
              <span className="font-semibold text-white">TIME Escola de Negócios</span> criou um ecossistema
              onde conexões geram oportunidades reais, crescimento estruturado e posicionamento no mercado.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 md:gap-5 items-center justify-center">
              {/* Primary CTA — Premium gold button */}
              <a href="#formulario" className="group relative z-20 cursor-pointer w-full sm:w-auto">
                {/* Outer glow ring */}
                <div className="absolute -inset-[1px] rounded-2xl opacity-60 group-hover:opacity-100 transition-opacity duration-500" style={{ background: "linear-gradient(135deg, rgba(232,201,118,0.4), rgba(212,168,83,0.2), rgba(184,144,58,0.4))", filter: "blur(4px)" }} />
                {/* Button body */}
                <div
                  className="relative inline-flex items-center justify-center gap-3 px-12 md:px-12 py-4 md:py-5 rounded-2xl overflow-hidden transition-all duration-300 group-hover:scale-[1.02] active:scale-[0.98] w-full"
                  style={{
                    background: "linear-gradient(135deg, #E8C976 0%, #D4A853 30%, #B8903A 70%, #A07C2A 100%)",
                    color: "#0a0908",
                    boxShadow: "0 8px 40px rgba(212, 168, 83, 0.35), 0 2px 12px rgba(212, 168, 83, 0.2), inset 0 1px 0 rgba(255,255,255,0.35), inset 0 -2px 4px rgba(0,0,0,0.1)",
                  }}
                >
                  {/* Shimmer sweep */}
                  <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
                  {/* Top highlight line */}
                  <span className="absolute top-0 left-[10%] right-[10%] h-px pointer-events-none" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)" }} />
                  {/* Text */}
                  <span className="relative text-base md:text-lg font-semibold tracking-[-0.01em]">Quero fazer parte da Rede</span>
                </div>
              </a>
              {/* Secondary CTA */}
              <a href="#beneficios" className="group inline-flex items-center justify-center gap-2 px-6 md:px-8 py-3.5 md:py-[18px] text-sm md:text-base font-medium rounded-2xl cursor-pointer transition-all duration-300 hover:bg-[rgba(212,168,83,0.06)]" style={{ border: "1px solid rgba(212, 168, 83, 0.2)", color: "var(--gold)" }}>
                <span>Saiba mais</span>
                <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-y-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" /></svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black to-transparent z-20" />
      </section>


      {/* ─── 3. AVISO IMPORTANTE ─── */}
      <Section className="py-12 md:py-16 relative">
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 50% 70% at 50% 50%, rgba(212,168,83,0.035) 0%, transparent 60%)" }} />
        <div className="relative z-10 max-w-3xl mx-auto px-6">
          <Reveal direction="scale">
            <div className="urgency-card px-5 py-8 md:px-14 md:py-14 text-center">
              {/* Shimmer sweep */}
              <div className="urgency-shimmer" aria-hidden="true" />



              {/* Shield icon */}
              <div className="relative z-10 flex justify-center mb-5" aria-hidden="true">
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: "radial-gradient(circle, rgba(212, 168, 83, 0.12) 0%, transparent 70%)", border: "1px solid rgba(212, 168, 83, 0.15)" }}>
                  <svg className="w-5 h-5" style={{ color: "var(--gold)" }} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0-10.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.25-8.25-3.286Zm0 13.036h.008v.008H12v-.008Z" />
                  </svg>
                </div>
              </div>

              {/* Label */}
              <div className="relative z-10 flex items-center justify-center gap-4 mb-6">
                <div className="h-px w-10 md:w-16" style={{ background: "linear-gradient(90deg, transparent, rgba(212, 168, 83, 0.4))" }} />
                <span className="text-[11px] font-semibold tracking-[0.3em] uppercase" style={{ color: "var(--gold)" }}>Aviso Importante</span>
                <div className="h-px w-10 md:w-16" style={{ background: "linear-gradient(90deg, rgba(212, 168, 83, 0.4), transparent)" }} />
              </div>

              {/* Heading */}
              <h3
                className="text-gradient-white relative z-10 text-2xl md:text-3xl lg:text-[2.1rem] mb-5"
                style={{ fontFamily: "var(--font-heading), sans-serif", fontWeight: 400, letterSpacing: "-0.02em", lineHeight: 1.3 }}
              >
                As vagas para a <span style={{ fontWeight: 700, WebkitTextFillColor: "#fff" }}>Rede de Valor</span> são{" "}
                <span className="text-gradient-gold" style={{ fontWeight: 700 }}>limitadas.</span>
              </h3>

              {/* Body */}
              <p className="relative z-10 text-[15px] md:text-base max-w-md mx-auto mb-6" style={{ color: "var(--text-secondary)", lineHeight: 1.85 }}>
                Trabalhamos com um número restrito de membros para garantir a qualidade das conexões e o acompanhamento personalizado. O processo é seletivo.
              </p>

              {/* Decorative divider */}
              <div className="flex items-center justify-center gap-3" aria-hidden="true">
                <div className="h-px w-8" style={{ background: "linear-gradient(90deg, transparent, rgba(212, 168, 83, 0.3))" }} />
                <div className="w-1.5 h-1.5 rotate-45" style={{ background: "var(--gold)", opacity: 0.35 }} />
                <div className="h-px w-8" style={{ background: "linear-gradient(90deg, rgba(212, 168, 83, 0.3), transparent)" }} />
              </div>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* ─── 4. PROBLEMA ─── */}
      <Section className="py-16 md:py-32 bg-radial-gold">
        <div className="max-w-5xl mx-auto px-5 md:px-6">
          {/* Section header — centered */}
          <div className="text-center mb-10">
            <Reveal>
              <h2 className="text-gradient-white text-[1.6rem] sm:text-4xl md:text-5xl leading-[2.1rem] md:leading-[1.15] mb-6 max-w-3xl mx-auto" style={{ fontFamily: "var(--font-heading), sans-serif", fontWeight: 400, letterSpacing: "-0.03em" }}>
                Você não cresce sozinho. E esse é o maior erro de muitos <span className="text-gradient-gold" style={{ fontWeight: 700 }}>empresários.</span>
              </h2>
            </Reveal>

            <Reveal delay={0.15}>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 mt-2">
                <p className="text-base md:text-lg italic" style={{ color: "var(--text-secondary)" }}>Não é falta de esforço.</p>
                <p className="text-base md:text-lg italic" style={{ color: "var(--text-secondary)" }}>Não é falta de capacidade.</p>
                <p className="text-base md:text-lg italic font-medium" style={{ color: "var(--gold)" }}>É falta de ambiente.</p>
              </div>
            </Reveal>
          </div>

          {/* Pain point cards — 3 columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" /></svg>, title: "Falta de conexões certas", desc: "Você está rodeado de pessoas que não te impulsionam." },
              { icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" /></svg>, title: "Falta de acesso", desc: "As portas certas não abrem para quem tenta sozinho." },
              { icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z" /></svg>, title: "Falta de direcionamento", desc: "Sem estratégia, esforço vira desperdício." },
            ].map((item, i) => (
              <Reveal key={i} delay={0.1 * i} direction="up">
                <div className="card-premium card-gold-accent p-7 md:p-8 text-center h-full transition-all duration-300 hover:border-[rgba(212,168,83,0.3)] hover:shadow-[0_0_30px_rgba(212,168,83,0.08)]">
                  <div className="w-12 h-12 rounded-full mx-auto mb-5 flex items-center justify-center" style={{ background: "radial-gradient(circle, rgba(212, 168, 83, 0.12) 0%, transparent 70%)", border: "1px solid rgba(212, 168, 83, 0.15)", color: "var(--gold)" }}>
                    {item.icon}
                  </div>
                  <h4 className="font-semibold text-white text-lg mb-2">{item.title}</h4>
                  <p className="text-sm" style={{ color: "var(--text-secondary)", lineHeight: 1.7 }}>{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Quote — closing statement */}
          <Reveal delay={0.4}>
            <div className="text-center mt-14 md:mt-20">
              <div className="flex items-center justify-center gap-3 mb-8" aria-hidden="true">
                <div className="h-px w-12" style={{ background: "linear-gradient(90deg, transparent, rgba(212, 168, 83, 0.3))" }} />
                <div className="w-1.5 h-1.5 rotate-45" style={{ background: "var(--gold)", opacity: 0.35 }} />
                <div className="h-px w-12" style={{ background: "linear-gradient(90deg, rgba(212, 168, 83, 0.3), transparent)" }} />
              </div>
              <p className="text-[1.7rem] sm:text-2xl md:text-3xl leading-[1.3] mb-8 md:mb-10" style={{ fontFamily: "var(--font-heading), sans-serif", fontWeight: 400, color: "var(--text-primary)", letterSpacing: "-0.01em" }}>
                O que acelera resultados não é só trabalho.
                <br /><span className="text-gradient-gold-shine" style={{ fontWeight: 700 }}>É conexão.</span>
              </p>
              <a href="#formulario" className="group relative z-20 cursor-pointer inline-block">
                <div className="absolute -inset-[1px] rounded-2xl opacity-60 group-hover:opacity-100 transition-opacity duration-500" style={{ background: "linear-gradient(135deg, rgba(232,201,118,0.4), rgba(212,168,83,0.2), rgba(184,144,58,0.4))", filter: "blur(4px)" }} />
                <div className="relative inline-flex items-center justify-center px-8 md:px-10 py-4 md:py-5 rounded-2xl overflow-hidden transition-all duration-300 group-hover:scale-[1.02] active:scale-[0.98]" style={{ background: "linear-gradient(135deg, #E8C976 0%, #D4A853 30%, #B8903A 70%, #A07C2A 100%)", color: "#0a0908", boxShadow: "0 8px 40px rgba(212, 168, 83, 0.35), 0 2px 12px rgba(212, 168, 83, 0.2), inset 0 1px 0 rgba(255,255,255,0.35), inset 0 -2px 4px rgba(0,0,0,0.1)" }}>
                  <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
                  <span className="absolute top-0 left-[10%] right-[10%] h-px pointer-events-none" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)" }} />
                  <span className="relative text-base md:text-lg font-semibold tracking-[-0.01em]">Quero fazer parte da Rede</span>
                </div>
              </a>

              <div className="flex items-center justify-center gap-2 mt-5 md:mt-10">
                <div className="flex -space-x-1.5">
                  {speakers.slice(0, 3).map((s, i) => (
                    <div key={i} className="w-6 h-6 md:w-7 md:h-7 rounded-full overflow-hidden" style={{ border: "1.5px solid rgba(212, 168, 83, 0.3)" }}>
                      <Image src={s.image} alt={s.name} width={28} height={28} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
                <p className="text-[11px] md:text-xs" style={{ color: "var(--text-muted)" }}>
                  Já são <strong className="text-[var(--gold)]">100+</strong> empresários na Rede
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* ─── 4B. PARA QUEM É / PARA QUEM NÃO É ─── */}
      <Section className="py-16 md:py-28 relative noise">
        <div className="absolute inset-0" style={{ background: "var(--bg-1)" }} />
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 60% 50% at 50% 40%, rgba(212, 168, 83, 0.04) 0%, transparent 65%)" }} />

        <div className="relative z-10 max-w-5xl mx-auto px-5 md:px-6">
          <Reveal className="text-center mb-8 md:mb-12">
            <div className="flex items-center justify-center gap-4 mb-5" aria-hidden="true">
              <div className="h-px w-10 md:w-16" style={{ background: "linear-gradient(90deg, transparent, rgba(212, 168, 83, 0.4))" }} />
              <span className="text-[11px] font-semibold tracking-[0.3em] uppercase" style={{ color: "var(--gold)" }}>Exclusividade</span>
              <div className="h-px w-10 md:w-16" style={{ background: "linear-gradient(90deg, rgba(212, 168, 83, 0.4), transparent)" }} />
            </div>
            <h2 className="text-gradient-white text-[2rem] sm:text-4xl md:text-5xl leading-[2.625rem] md:leading-[1.15]" style={{ fontFamily: "var(--font-heading), sans-serif", fontWeight: 400, letterSpacing: "-0.03em" }}>
              A Rede é para <span className="text-gradient-gold" style={{ fontWeight: 700 }}>poucos.</span>
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {/* Para quem É */}
            <Reveal delay={0.1}>
              <div className="card-premium p-5 md:p-8 h-full" style={{ borderColor: "rgba(212, 168, 83, 0.15)" }}>
                <h3 className="text-xl font-semibold text-white mb-6" style={{ fontFamily: "var(--font-heading), sans-serif" }}>Para quem é</h3>
                <ul className="space-y-4">
                  {[
                    "Empresários que buscam conexões estratégicas de alto nível",
                    "Profissionais que querem crescer com método e comunidade",
                    "Líderes prontos para investir no próprio desenvolvimento",
                    "Quem valoriza networking qualificado e com propósito",
                    "Empreendedores que querem posicionamento e autoridade",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <svg className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: "var(--gold)" }} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                      <span className="text-sm" style={{ color: "var(--text-secondary)", lineHeight: 1.7 }}>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            {/* Para quem NÃO é */}
            <Reveal delay={0.2}>
              <div className="card-premium p-5 md:p-8 h-full" style={{ borderColor: "rgba(255, 255, 255, 0.06)" }}>
                <h3 className="text-xl font-semibold text-white mb-6" style={{ fontFamily: "var(--font-heading), sans-serif" }}>Para quem não é</h3>
                <ul className="space-y-4">
                  {[
                    "Quem busca resultado rápido sem esforço ou comprometimento",
                    "Quem não valoriza o poder das conexões e do networking",
                    "Profissionais que não estão dispostos a contribuir com a comunidade",
                    "Quem procura apenas conteúdo teórico, sem aplicação prática",
                    "Pessoas que não estão abertas a receber feedback e evoluir",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <svg className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: "rgba(255,100,100,0.6)" }} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span className="text-sm" style={{ color: "var(--text-muted)", lineHeight: 1.7 }}>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </Section>

      {/* ─── 5. FUSÃO REDE + TIME — BENTO GRID ─── */}
      <Section className="py-16 md:py-36 relative noise">
        <div className="absolute inset-0" style={{ background: "var(--bg-2)" }} />
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 70% 60% at 50% 40%, rgba(212, 168, 83, 0.06) 0%, transparent 65%)" }} />

        <div className="relative z-10 max-w-6xl mx-auto px-5 md:px-6">
          {/* Heading */}
          <Reveal>
            <h2 className="text-gradient-white text-center text-[1.6rem] sm:text-4xl md:text-5xl leading-[2.1rem] md:leading-[1.15] mb-6 md:mb-12" style={{ fontFamily: "var(--font-heading), sans-serif", fontWeight: 400, letterSpacing: "-0.02em" }}>
              Conexão <span className="text-gradient-gold" style={{ fontWeight: 400, fontSize: "1.1em" }}>+</span> Crescimento
              <br className="hidden md:block" />{" "}
              <span className="text-gradient-gold" style={{ fontWeight: 700 }}>no mesmo ecossistema.</span>
            </h2>
          </Reveal>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-5">

            {/* Card 1 — Rede de Valor (2 cols, tall) */}
            <motion.div
              className="sm:col-span-2 bento-card-light rounded-3xl relative overflow-hidden cursor-pointer group"
              style={{ border: "1px solid rgba(255,255,255,0.07)" }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ scale: 1.015, transition: { duration: 0.3 } }}
            >
              {/* Logo backdrop area */}
              <div className="relative h-36 md:h-52 flex items-center justify-center overflow-hidden" style={{ background: "linear-gradient(180deg, rgba(212,168,83,0.06) 0%, rgba(0,0,0,0.3) 100%)" }}>
                {/* Ambient glow behind logo */}
                <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 60% 80% at 50% 50%, rgba(212,168,83,0.10) 0%, transparent 70%)" }} />
                <div className="absolute inset-0 noise" style={{ opacity: 0.4 }} />
                {/* Subtle grid pattern */}
                <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
                <Image src="/images/logo-rede-de-valor-v1.webp" alt="Rede de Valor" width={280} height={120} className="h-24 md:h-32 w-auto relative z-10 drop-shadow-[0_0_30px_rgba(212,168,83,0.15)]" />
              </div>
              {/* Content */}
              <div className="p-5 md:p-8" style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)" }}>
                <p className="text-lg md:text-xl mb-2" style={{ fontFamily: "var(--font-heading), sans-serif", fontWeight: 700, color: "#fff" }}>Rede de Valor</p>
                <p className="text-sm md:text-base" style={{ color: "var(--text-secondary)", lineHeight: 1.7 }}>
                  Nasceu para gerar conexões reais entre empresários que querem crescer juntos.
                </p>
              </div>
              {/* Hover border glow */}
              <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ boxShadow: "inset 0 0 0 1px rgba(212,168,83,0.2), 0 0 40px rgba(212,168,83,0.05)" }} />
            </motion.div>

            {/* Card 2 — TIME (2 cols, tall) */}
            <motion.div
              className="sm:col-span-2 bento-card-light rounded-3xl relative overflow-hidden cursor-pointer group"
              style={{ border: "1px solid rgba(255,255,255,0.07)" }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
              whileHover={{ scale: 1.015, transition: { duration: 0.3 } }}
            >
              {/* Logo backdrop area */}
              <div className="relative h-36 md:h-52 flex items-center justify-center overflow-hidden" style={{ background: "linear-gradient(180deg, rgba(212,168,83,0.06) 0%, rgba(0,0,0,0.3) 100%)" }}>
                <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 60% 80% at 50% 50%, rgba(212,168,83,0.10) 0%, transparent 70%)" }} />
                <div className="absolute inset-0 noise" style={{ opacity: 0.4 }} />
                <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
                <Image src="/images/logo-time-v2.webp" alt="TIME Escola de Negócios" width={200} height={60} className="h-14 md:h-18 w-auto relative z-10 drop-shadow-[0_0_30px_rgba(212,168,83,0.15)]" />
              </div>
              {/* Content */}
              <div className="p-5 md:p-8" style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)" }}>
                <p className="text-lg md:text-xl mb-2" style={{ fontFamily: "var(--font-heading), sans-serif", fontWeight: 700, color: "#fff" }}>TIME Escola de Negócios</p>
                <p className="text-sm md:text-base" style={{ color: "var(--text-secondary)", lineHeight: 1.7 }}>
                  Trouxe estrutura, conhecimento e desenvolvimento para acelerar resultados.
                </p>
              </div>
              {/* Hover border glow */}
              <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ boxShadow: "inset 0 0 0 1px rgba(212,168,83,0.2), 0 0 40px rgba(212,168,83,0.05)" }} />
            </motion.div>

            {/* Card 3 — Ecossistema completo (full width, gold accent) */}
            <motion.div
              className="sm:col-span-2 lg:col-span-4 bento-card-light rounded-2xl md:rounded-3xl p-5 md:p-12 relative overflow-hidden cursor-pointer group"
              style={{
                background: "linear-gradient(135deg, rgba(212,168,83,0.07) 0%, rgba(212,168,83,0.02) 40%, rgba(255,255,255,0.02) 100%)",
                border: "1px solid rgba(212,168,83,0.12)",
              }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
              whileHover={{ scale: 1.01, transition: { duration: 0.3 } }}
            >
              <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(212,168,83,0.08) 0%, transparent 60%)" }} />
              <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(212,168,83,0.05) 0%, transparent 60%)" }} />
              <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-12">
                <div className="flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center" style={{ background: "rgba(212,168,83,0.08)", border: "1px solid rgba(212,168,83,0.18)" }}>
                  <span className="text-3xl md:text-4xl" style={{ color: "var(--gold)", fontWeight: 300 }}>+</span>
                </div>
                <div className="flex-1">
                  <p className="text-gradient-white text-xl md:text-2xl lg:text-3xl mb-3" style={{ fontFamily: "var(--font-heading), sans-serif", fontWeight: 400, lineHeight: 1.3, letterSpacing: "-0.02em" }}>
                    Juntas, criam um <span className="text-gradient-gold" style={{ fontWeight: 700 }}>ecossistema completo</span> para quem quer evoluir de verdade.
                  </p>
                  <p className="text-sm md:text-base max-w-2xl" style={{ color: "var(--text-muted)", lineHeight: 1.7 }}>
                    A fusão entre networking estratégico e educação empresarial de alto nível.
                  </p>
                </div>
              </div>
              <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ boxShadow: "inset 0 0 0 1px rgba(212,168,83,0.25), 0 0 60px rgba(212,168,83,0.06)" }} />
            </motion.div>

            {/* Small cards — 4 pillars */}
            {[
              { icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>, title: "Conexões", desc: "Relacionamentos estratégicos com empresários do mesmo nível." },
              { icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>, title: "Conhecimento", desc: "Conteúdo aplicável e mentorias com quem já construiu resultados." },
              { icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>, title: "Escalabilidade", desc: "Estrutura e método para escalar seu negócio com consistência." },
              { icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>, title: "Posicionamento", desc: "Autoridade e visibilidade no seu mercado de atuação." },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                className="bento-card-light rounded-2xl md:rounded-3xl p-5 md:p-8 flex flex-col relative overflow-hidden cursor-pointer group"
                style={{
                  background: "linear-gradient(180deg, rgba(255,255,255,0.035) 0%, rgba(255,255,255,0.01) 100%)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  minHeight: 180,
                }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.3 + i * 0.05 }}
                whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
              >
                {/* Top edge accent */}
                <div className="absolute top-0 left-[20%] right-[20%] h-px pointer-events-none" style={{ background: "linear-gradient(90deg, transparent, rgba(212,168,83,0.12), transparent)" }} />
                <div className="w-11 h-11 rounded-xl mb-6 flex items-center justify-center" style={{ background: "rgba(212,168,83,0.08)", border: "1px solid rgba(212,168,83,0.15)" }}>
                  {item.icon}
                </div>
                <div>
                  <p className="text-base md:text-lg mb-1.5" style={{ fontFamily: "var(--font-heading), sans-serif", fontWeight: 700, color: "#fff" }}>{item.title}</p>
                  <p className="text-sm" style={{ color: "var(--text-muted)", lineHeight: 1.6 }}>{item.desc}</p>
                </div>
                <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ boxShadow: "inset 0 0 0 1px rgba(212,168,83,0.15), 0 0 30px rgba(212,168,83,0.04)" }} />
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ─── STATS BAR ─── */}
      <Section className="py-12 md:py-20 noise relative">
        <div className="absolute inset-0" style={{ background: "var(--bg-2)" }} />
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 60% 80% at 50% 50%, rgba(212, 168, 83, 0.04) 0%, transparent 70%)" }} />
        <div className="absolute top-0 left-0 right-0 gold-line" />
        <div className="absolute bottom-0 left-0 right-0 gold-line" />

        <div className="relative z-10 max-w-6xl mx-auto px-5 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0">
            {stats.map((stat, i) => (
              <Reveal key={i} delay={0.1 * i} className={`text-center ${i > 0 ? "md:border-l" : ""}`} style={i > 0 ? { borderColor: "rgba(212, 168, 83, 0.12)" } : undefined}>
                <p className="text-3xl md:text-5xl lg:text-6xl font-bold mb-1 text-gradient-gold" style={{ fontFamily: "var(--font-body), sans-serif" }}>
                  {stat.special ? stat.special : <CountUp target={stat.value} suffix={stat.suffix} />}
                </p>
                {stat.prefix && (
                  <p className="text-xs font-semibold tracking-wider uppercase mb-2" style={{ color: "var(--gold)", letterSpacing: "0.08em" }}>{stat.prefix}</p>
                )}
                <p className="text-xs font-medium tracking-wider uppercase" style={{ color: "var(--text-secondary)", letterSpacing: "0.1em" }}>{stat.label}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      {/* ─── 6. BENEFÍCIOS ─── */}
      <Section id="beneficios" className="relative py-16 md:py-28">
        {/* Background image */}
        <div className="absolute inset-0">
          <Image src="/images/benefits-bg.webp" alt="" fill className="object-cover opacity-30" sizes="100vw" aria-hidden="true" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.9) 100%)" }} />
        </div>
        <div className="absolute bottom-0 left-0" style={{ width: "50vw", height: "50vh", background: "radial-gradient(ellipse at 20% 80%, rgba(212, 168, 83, 0.04) 0%, transparent 60%)" }} />

        <div className="relative z-10 max-w-6xl mx-auto px-5 md:px-6">
          <Reveal className="text-center mb-8 md:mb-10">
            <div className="inline-flex items-center gap-2 mb-5">
              <span className="h-px w-8" style={{ background: "var(--gold)" }} />
              <span className="text-sm md:text-base font-semibold tracking-[0.25em] uppercase" style={{ color: "var(--gold)" }}>O que você recebe</span>
              <span className="h-px w-8" style={{ background: "var(--gold)" }} />
            </div>
            <h2 className="text-gradient-white text-[1.6rem] sm:text-4xl md:text-5xl leading-[2.1rem] md:leading-[1.15] mb-3" style={{ fontFamily: "var(--font-heading), sans-serif", fontWeight: 400, letterSpacing: "-0.03em" }}>
              Tudo para acelerar seus resultados<br className="hidden md:block" />{" "}<span className="text-gradient-gold" style={{ fontWeight: 700 }}>em um só lugar.</span>
            </h2>
            <p className="text-sm md:text-base max-w-lg mx-auto" style={{ color: "var(--text-secondary)" }}>
              Um ecossistema completo de networking, conteúdo e desenvolvimento.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((b, i) => {
              const isHighlight = i < 2;
              return (
                <Reveal key={i} delay={0.08 * i} direction={i % 2 === 0 ? "up" : "scale"}>
                  <div className="card-premium card-gold-accent p-5 md:p-7 h-full cursor-pointer transition-all duration-300 hover:-translate-y-1" style={{ ...(isHighlight ? { borderColor: "rgba(212, 168, 83, 0.2)" } : {}) }}>
                    <div className={`${isHighlight ? "w-14 h-14" : "w-12 h-12"} rounded-xl flex items-center justify-center mb-5`} style={{ background: isHighlight ? "linear-gradient(135deg, rgba(212, 168, 83, 0.18), rgba(212, 168, 83, 0.05))" : "linear-gradient(135deg, rgba(212, 168, 83, 0.1), rgba(212, 168, 83, 0.03))", color: "var(--gold)", boxShadow: isHighlight ? "0 0 24px rgba(212, 168, 83, 0.1)" : "0 0 16px rgba(212, 168, 83, 0.05)" }}>
                      {b.icon}
                    </div>
                    <h4 className={`${isHighlight ? "text-lg" : "text-base"} font-semibold mb-2 text-white`}>{b.title}</h4>
                    <p className="text-sm" style={{ color: "var(--text-secondary)", lineHeight: 1.7 }}>{b.desc}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>

          {/* Extra benefit */}
          <Reveal delay={0.5} className="mt-6">
            <div className="card-premium card-gold-accent p-7 cursor-pointer transition-all duration-300 hover:-translate-y-1">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(212, 168, 83, 0.08)", color: "var(--gold)" }}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12.75 3.03v.568c0 .334.148.65.405.864l1.068.89c.442.369.535 1.01.216 1.49l-.51.766a2.25 2.25 0 01-1.161.886l-.143.048a1.107 1.107 0 00-.57 1.664c.369.555.169 1.307-.427 1.605L9 13.125l.423 1.059a.956.956 0 01-1.652.928l-.679-.906a1.125 1.125 0 00-1.906.172L4.5 15.75l-.612.153M12.75 3.031a9 9 0 00-8.862 12.872M12.75 3.031a9 9 0 016.69 14.036" /></svg>
                </div>
                <div>
                  <h4 className="text-[15px] font-semibold mb-1 text-white">Experiências internacionais de negócios</h4>
                  <p className="text-sm" style={{ color: "var(--text-secondary)", lineHeight: 1.7 }}>Viagens, imersões e conexões globais para expandir sua visão.</p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* ─── 7. COMO FUNCIONA ─── */}
      <Section id="como-funciona" className="py-16 md:py-36 noise relative">
        <div className="absolute inset-0" style={{ background: "var(--bg-1)" }} />
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 70% 50% at 50% 30%, rgba(212, 168, 83, 0.04) 0%, transparent 65%)" }} />

        <div className="relative z-10 max-w-6xl mx-auto px-5 md:px-6">
          {/* Header */}
          <Reveal className="text-center mb-8 md:mb-12">
            <div className="flex items-center justify-center gap-4 mb-5" aria-hidden="true">
              <div className="h-px w-10 md:w-16" style={{ background: "linear-gradient(90deg, transparent, rgba(212, 168, 83, 0.4))" }} />
              <span className="text-[11px] font-semibold tracking-[0.3em] uppercase" style={{ color: "var(--gold)" }}>Passo a passo</span>
              <div className="h-px w-10 md:w-16" style={{ background: "linear-gradient(90deg, rgba(212, 168, 83, 0.4), transparent)" }} />
            </div>
            <h2 className="text-gradient-white text-[2rem] sm:text-4xl md:text-5xl leading-[2.625rem] md:leading-[1.15]" style={{ fontFamily: "var(--font-heading), sans-serif", fontWeight: 400, letterSpacing: "-0.03em" }}>
              Como funciona <span className="text-gradient-gold" style={{ fontWeight: 700 }}>a Rede</span>
            </h2>
          </Reveal>

          {/* Steps — Mobile: timeline layout | Desktop: horizontal circles */}
          <div className="relative">

            {/* ── MOBILE LAYOUT — vertical timeline ── */}
            <div className="md:hidden relative">
              {/* Vertical line */}
              <div className="absolute left-[23px] top-0 bottom-0 w-px" style={{ background: "linear-gradient(180deg, transparent 0%, rgba(212,168,83,0.2) 10%, rgba(212,168,83,0.2) 90%, transparent 100%)" }} />

              <div className="space-y-8">
                {steps.map((step, i) => (
                  <motion.div
                    key={i}
                    className="relative flex items-start gap-5 group"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.1 * i }}
                  >
                    {/* Number circle */}
                    <div className="relative w-[48px] h-[48px] flex-shrink-0 flex items-center justify-center z-[1]">
                      <div className="absolute inset-0 rounded-full" style={{ border: "1.5px solid rgba(212,168,83,0.25)", background: "radial-gradient(circle at 50% 40%, rgba(12,11,10,0.98) 0%, rgba(7,7,7,0.99) 100%)" }} />
                      <span
                        className="relative z-10 text-lg font-semibold leading-none"
                        style={{
                          fontFamily: "var(--font-heading), sans-serif",
                          background: "linear-gradient(180deg, #E8C976 0%, #D4A853 40%, #A07C2A 100%)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                        }}
                      >
                        {step.num}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="pt-1.5">
                      <h4 className="text-base font-semibold text-white mb-1" style={{ fontFamily: "var(--font-heading), sans-serif" }}>{step.title}</h4>
                      <p className="text-sm" style={{ color: "var(--text-muted)", lineHeight: 1.6 }}>{step.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* ── DESKTOP LAYOUT — horizontal circles ── */}
            <div className="hidden md:block relative">
              {/* SVG curved path */}
              <svg
                className="absolute top-[56px] left-0 right-0 z-0 pointer-events-none"
                viewBox="0 0 1000 40"
                fill="none"
                preserveAspectRatio="none"
                style={{ width: "100%", height: "40px", overflow: "visible" }}
                aria-hidden="true"
              >
                <defs>
                  <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="rgba(212,168,83,0)" />
                    <stop offset="10%" stopColor="rgba(212,168,83,0.15)" />
                    <stop offset="50%" stopColor="rgba(212,168,83,0.2)" />
                    <stop offset="90%" stopColor="rgba(212,168,83,0.15)" />
                    <stop offset="100%" stopColor="rgba(212,168,83,0)" />
                  </linearGradient>
                </defs>
                <path
                  d="M 50,20 C 150,20 150,-10 250,0 C 350,10 350,40 500,20 C 650,0 650,40 750,30 C 850,20 850,-5 950,20"
                  stroke="url(#pathGradient)"
                  strokeWidth="1.5"
                  strokeDasharray="8 6"
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>

              <div className="grid grid-cols-5 gap-5">
                {steps.map((step, i) => (
                  <motion.div
                    key={i}
                    className="relative rounded-2xl flex flex-col items-center text-center group cursor-pointer"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.12 * i }}
                  >
                    {/* Number container — circular with gold ring */}
                    <div className="relative w-[112px] h-[112px] mb-7 flex items-center justify-center z-[1]">
                      <div className="absolute inset-0 rounded-full transition-all duration-500 group-hover:scale-105" style={{ border: "1.5px solid rgba(212,168,83,0.2)", boxShadow: "0 0 0 1px rgba(212,168,83,0.05)" }} />
                      <div className="absolute inset-[1px] rounded-full transition-all duration-500" style={{ background: "radial-gradient(circle at 50% 40%, rgba(12,11,10,0.98) 0%, rgba(7,7,7,0.99) 100%)" }} />
                      <div className="absolute inset-[6px] rounded-full" style={{ border: "1px solid rgba(212,168,83,0.08)", background: "radial-gradient(circle at 50% 35%, rgba(212,168,83,0.05) 0%, transparent 70%)" }} />
                      <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ boxShadow: "0 0 25px rgba(212,168,83,0.12), 0 0 50px rgba(212,168,83,0.06)" }} />
                      <span
                        className="relative z-10 text-[2.25rem] font-semibold leading-none tracking-tight transition-transform duration-500 group-hover:scale-110"
                        style={{
                          fontFamily: "var(--font-heading), sans-serif",
                          background: "linear-gradient(180deg, #E8C976 0%, #D4A853 40%, #A07C2A 100%)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          letterSpacing: "-0.02em",
                        }}
                      >
                        {step.num}
                      </span>
                    </div>

                    <h4 className="text-[15px] font-semibold text-white mb-2 transition-colors duration-300" style={{ fontFamily: "var(--font-heading), sans-serif", letterSpacing: "-0.01em" }}>{step.title}</h4>
                    <p className="text-[13px] max-w-[200px]" style={{ color: "var(--text-muted)", lineHeight: 1.7 }}>{step.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ─── 8. IDEALIZADORES ─── */}
      <Section id="quem-somos" className="py-16 md:py-36 relative noise">
        {/* Background com profundidade */}
        <div className="absolute inset-0" style={{ background: "var(--bg-0)" }} />
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 70% 50% at 30% 35%, rgba(212, 168, 83, 0.06) 0%, transparent 65%)" }} />
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 60% 40% at 70% 75%, rgba(212, 168, 83, 0.04) 0%, transparent 60%)" }} />

        <div className="relative z-10 max-w-6xl mx-auto px-5 md:px-6">
          {/* Header */}
          <Reveal className="text-center mb-10 md:mb-16">
            <div className="flex items-center justify-center gap-4 mb-5" aria-hidden="true">
              <div className="h-px w-10 md:w-16" style={{ background: "linear-gradient(90deg, transparent, rgba(212, 168, 83, 0.4))" }} />
              <span className="text-[11px] font-semibold tracking-[0.3em] uppercase" style={{ color: "var(--gold)" }}>Idealizadores</span>
              <div className="h-px w-10 md:w-16" style={{ background: "linear-gradient(90deg, rgba(212, 168, 83, 0.4), transparent)" }} />
            </div>
            <h2 className="text-gradient-white text-[2rem] sm:text-4xl md:text-5xl leading-[2.625rem] md:leading-[1.15]" style={{ fontFamily: "var(--font-heading), sans-serif", fontWeight: 400, letterSpacing: "-0.03em" }}>
              Quem está por trás <span className="text-gradient-gold" style={{ fontWeight: 700 }}>de tudo isso</span>
            </h2>
          </Reveal>

          {/* Sócios — editorial cards para todos */}
          <div className="space-y-8 md:space-y-10">
            {speakers.map((s, i) => (
              <Reveal key={i} delay={0.1 * i} direction="up">
                <div className="relative">
                  {/* Glow atmosférico */}
                  <div className="absolute -inset-10 pointer-events-none" style={{ background: `radial-gradient(ellipse 50% 60% at ${i % 2 === 0 ? '30%' : '70%'} 50%, rgba(212, 168, 83, 0.04) 0%, transparent 70%)` }} aria-hidden="true" />

                  <div className={`relative flex flex-col ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-stretch gap-0 rounded-2xl overflow-hidden`} style={{ background: "linear-gradient(135deg, rgba(18, 16, 12, 0.95) 0%, rgba(8, 7, 5, 0.98) 100%)", border: "1px solid rgba(212, 168, 83, 0.1)", boxShadow: "0 30px 80px rgba(0, 0, 0, 0.5), 0 0 60px rgba(212, 168, 83, 0.03)" }}>
                    {/* Foto */}
                    <div className="relative w-full md:w-[45%] flex-shrink-0 group/speaker overflow-hidden">
                      <div className="relative w-full h-64 sm:h-80 md:h-full" style={{ minHeight: "400px" }}>
                        <Image src={s.image} alt={s.name} fill className="object-cover transition-transform duration-1000 ease-out group-hover/speaker:scale-[1.03]" style={{ objectPosition: s.imagePosition || "center top" }} sizes="(max-width: 768px) 100vw, 45vw" />
                        {/* Gradientes cinematográficos */}
                        <div className="absolute inset-0 hidden md:block" style={{ background: i % 2 === 0 ? "linear-gradient(to right, transparent 60%, rgba(8, 7, 5, 0.98) 100%)" : "linear-gradient(to left, transparent 60%, rgba(8, 7, 5, 0.98) 100%)" }} />
                        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(8, 7, 5, 0.6) 0%, transparent 30%)" }} />
                        <div className="absolute inset-0 md:hidden" style={{ background: "linear-gradient(to bottom, transparent 50%, rgba(8, 7, 5, 0.95) 100%)" }} />
                      </div>
                      {/* Gold top accent line */}
                      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: i % 2 === 0 ? "linear-gradient(90deg, var(--gold), rgba(212, 168, 83, 0.3), transparent)" : "linear-gradient(90deg, transparent, rgba(212, 168, 83, 0.3), var(--gold))" }} aria-hidden="true" />
                    </div>

                    {/* Conteúdo */}
                    <div className="relative flex-1 flex flex-col justify-center px-5 py-8 md:px-14 md:py-16">
                      {/* Aspas decorativas */}
                      <div className="absolute top-8 right-10 hidden md:block pointer-events-none" aria-hidden="true">
                        <span className="text-7xl leading-none" style={{ fontFamily: "var(--font-heading), sans-serif", color: "var(--gold)", opacity: 0.06 }}>&ldquo;</span>
                      </div>

                      <p className="text-[11px] font-semibold tracking-[0.3em] uppercase mb-4" style={{ color: "var(--gold)" }}>
                        Sócio
                      </p>

                      <h3 className="text-2xl md:text-4xl lg:text-5xl font-semibold text-white mb-3" style={{ fontFamily: "var(--font-heading), sans-serif", letterSpacing: "-0.02em" }}>
                        {s.name}
                      </h3>

                      <p className="text-sm font-medium mb-6" style={{ color: "var(--gold)" }}>{s.specialty}</p>

                      {/* Linha separadora */}
                      <div className="flex items-center gap-3 mb-6" aria-hidden="true">
                        <div className="h-px w-12" style={{ background: "linear-gradient(90deg, var(--gold), transparent)", opacity: 0.4 }} />
                        <div className="w-1 h-1 rounded-full" style={{ background: "var(--gold)", opacity: 0.4 }} />
                      </div>

                      <p className="text-base md:text-lg max-w-md" style={{ color: "var(--text-secondary)", lineHeight: 1.5 }}>
                        {s.bio}
                      </p>

                      {/* Decorativo bottom-right */}
                      <div className="absolute bottom-6 right-8 hidden md:flex items-center gap-2" aria-hidden="true">
                        <div className="w-1 h-1 rotate-45" style={{ background: "var(--gold)", opacity: 0.2 }} />
                        <div className="h-px w-8" style={{ background: "linear-gradient(90deg, rgba(212, 168, 83, 0.2), transparent)" }} />
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>


      {/* ─── 9B. FAQ ─── */}
      <Section className="py-16 md:py-28 relative noise">
        <div className="absolute inset-0" style={{ background: "var(--bg-1)" }} />
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 60% 50% at 50% 40%, rgba(212, 168, 83, 0.04) 0%, transparent 65%)" }} />

        <div className="relative z-10 max-w-3xl mx-auto px-5 md:px-6">
          <Reveal className="text-center mb-8 md:mb-12">
            <div className="flex items-center justify-center gap-4 mb-5" aria-hidden="true">
              <div className="h-px w-10 md:w-16" style={{ background: "linear-gradient(90deg, transparent, rgba(212, 168, 83, 0.4))" }} />
              <span className="text-[11px] font-semibold tracking-[0.3em] uppercase" style={{ color: "var(--gold)" }}>Dúvidas frequentes</span>
              <div className="h-px w-10 md:w-16" style={{ background: "linear-gradient(90deg, rgba(212, 168, 83, 0.4), transparent)" }} />
            </div>
            <h2 className="text-gradient-white text-[2rem] sm:text-4xl md:text-5xl leading-[2.625rem] md:leading-[1.15]" style={{ fontFamily: "var(--font-heading), sans-serif", fontWeight: 400, letterSpacing: "-0.03em" }}>
              Perguntas <span className="text-gradient-gold" style={{ fontWeight: 700 }}>frequentes</span>
            </h2>
          </Reveal>

          <div className="space-y-3">
            {[
              { q: "Quanto custa participar da Rede de Valor?", a: "O valor do investimento é apresentado durante a conversa consultiva com nossa equipe, de forma personalizada. Trabalhamos com condições que se adequam ao perfil de cada membro." },
              { q: "Como funciona o processo seletivo?", a: "Após preencher o formulário, nossa equipe entra em contato para uma conversa consultiva. Avaliamos se o perfil é compatível com a comunidade para garantir a qualidade das conexões para todos os membros." },
              { q: "Preciso ter uma empresa para participar?", a: "Não necessariamente. A Rede é voltada para empresários, profissionais liberais e líderes que buscam crescimento através de conexões estratégicas e desenvolvimento profissional." },
              { q: "Qual o compromisso de tempo?", a: "Os encontros mensais são a principal agenda. Além disso, temos conteúdos online, grupo exclusivo e eventos especiais ao longo do ano. Você participa no seu ritmo." },
              { q: "Onde acontecem os encontros?", a: "Os encontros presenciais acontecem mensalmente em locais estratégicos. Também temos experiências internacionais e eventos especiais em diferentes cidades." },
              { q: "Posso cancelar a qualquer momento?", a: "Sim. Não trabalhamos com contratos de fidelidade. Acreditamos que a permanência deve ser pela entrega de valor, não por obrigação contratual." },
            ].map((faq, i) => (
              <Reveal key={i} delay={0.05 * i}>
                <details className="group card-premium overflow-hidden cursor-pointer" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                  <summary className="flex items-center justify-between p-5 md:p-7 list-none [&::-webkit-details-marker]:hidden">
                    <span className="text-sm md:text-[15px] font-medium text-white pr-4" style={{ fontFamily: "var(--font-heading), sans-serif" }}>{faq.q}</span>
                    <svg className="w-5 h-5 flex-shrink-0 transition-transform duration-300 group-open:rotate-45" style={{ color: "var(--gold)" }} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                  </summary>
                  <div className="px-5 md:px-7 pb-5 md:pb-7 -mt-1">
                    <p className="text-sm" style={{ color: "var(--text-secondary)", lineHeight: 1.8 }}>{faq.a}</p>
                  </div>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      {/* ─── 10. FORMULÁRIO ─── */}
      <Section id="formulario" className="py-16 md:py-36 relative noise">
        <div className="absolute inset-0" style={{ background: "var(--bg-0)" }} />
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 60% 50% at 50% 40%, rgba(212, 168, 83, 0.05) 0%, transparent 65%)" }} />

        <div className="relative z-10 max-w-5xl mx-auto px-5 md:px-6">
          <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-20">
            {/* Left — copy */}
            <div className="flex-1 text-left">
              <Reveal direction="left">
                <div className="flex items-center justify-start gap-4 mb-5" aria-hidden="true">
                  <div className="h-px w-10 md:w-16" style={{ background: "linear-gradient(90deg, transparent, rgba(212, 168, 83, 0.4))" }} />
                  <span className="text-[11px] font-semibold tracking-[0.3em] uppercase" style={{ color: "var(--gold)" }}>Próximo passo</span>
                  <div className="h-px w-10 md:w-16" style={{ background: "linear-gradient(90deg, rgba(212, 168, 83, 0.4), transparent)" }} />
                </div>
                <h2 className="text-gradient-white text-[2rem] sm:text-4xl md:text-5xl leading-[2.625rem] md:leading-[1.15] mb-6" style={{ fontFamily: "var(--font-heading), sans-serif", fontWeight: 400, letterSpacing: "-0.03em" }}>
                  Faça parte da<br /><span className="text-gradient-gold" style={{ fontWeight: 700 }}>Rede de Valor</span>
                </h2>
                <p className="text-base md:text-lg mb-8 max-w-md mx-auto lg:mx-0" style={{ color: "var(--text-secondary)", lineHeight: 1.8 }}>
                  Preencha seus dados e nossa equipe entrará em contato para te apresentar todos os detalhes.
                </p>

                {/* Trust signals */}
                <div className="space-y-3">
                  {[
                    "Processo seletivo e confidencial",
                    "Resposta em até 48h úteis",
                    "Sem compromisso",
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <svg className="w-4 h-4 flex-shrink-0" style={{ color: "var(--gold)" }} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                      <span className="text-sm" style={{ color: "var(--text-secondary)" }}>{item}</span>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>

            {/* Right — form */}
            <div className="w-full lg:w-[440px] flex-shrink-0">
              <Reveal delay={0.15} direction="right">
                <div className="card-premium card-gold-accent p-5 md:p-10" style={{ background: "linear-gradient(160deg, rgba(25, 23, 20, 0.97) 0%, rgba(12, 11, 9, 0.99) 100%)", borderColor: "rgba(212, 168, 83, 0.1)", boxShadow: "0 20px 80px rgba(0, 0, 0, 0.5), 0 0 40px rgba(212, 168, 83, 0.03)" }}>
              {!formSubmitted ? (
                <form className="space-y-5" onSubmit={async (e) => {
                  e.preventDefault();
                  // Honeypot anti-spam
                  const form = e.currentTarget;
                  const formData = new FormData(form);
                  if (formData.get("website")) return;

                  if (formLoading) return;
                  setFormLoading(true);
                  setFormError("");
                  const data = Object.fromEntries(formData);
                  delete (data as Record<string, unknown>).website;

                  const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyZ4vjKM-iVCtwbUp4-E0eMXTWP4lBxGiuak6mIYXE2WwhQCm6E3f9Uns0ztuMRbfywNQ/exec";

                  try {
                    const params = new URLSearchParams(data as Record<string, string>).toString();
                    await fetch(SCRIPT_URL + "?" + params, { mode: "no-cors" });
                    setShowPopup(true);
                    setFormSubmitted(true);
                  } catch {
                    setFormError("Erro ao enviar. Tente novamente ou entre em contato pelo WhatsApp.");
                  } finally {
                    setFormLoading(false);
                  }
                }}>
                  {/* Honeypot anti-spam — invisível */}
                  <input type="text" name="website" className="absolute opacity-0 pointer-events-none" tabIndex={-1} autoComplete="off" aria-hidden="true" />

                  <div className="space-y-5">
                    <div>
                      <label htmlFor="nome" className="block text-xs font-medium tracking-wider uppercase mb-3" style={{ color: "var(--text-secondary)", letterSpacing: "0.1em" }}>Nome completo</label>
                      <input type="text" id="nome" name="nome" required placeholder="Seu nome" className="input-premium" />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-xs font-medium tracking-wider uppercase mb-3" style={{ color: "var(--text-secondary)", letterSpacing: "0.1em" }}>E-mail</label>
                      <input type="email" id="email" name="email" required placeholder="seu@email.com" className="input-premium" />
                    </div>
                    <div className="grid grid-cols-2 gap-5">
                      <div>
                        <label htmlFor="instagram" className="block text-xs font-medium tracking-wider uppercase mb-3" style={{ color: "var(--text-secondary)", letterSpacing: "0.1em" }}>Instagram</label>
                        <input type="text" id="instagram" name="instagram" placeholder="@seuinstagram" className="input-premium" />
                      </div>
                      <div>
                        <label htmlFor="whatsapp" className="block text-xs font-medium tracking-wider uppercase mb-3" style={{ color: "var(--text-secondary)", letterSpacing: "0.1em" }}>WhatsApp</label>
                        <input type="tel" id="whatsapp" name="whatsapp" required placeholder="(00) 00000-0000" pattern="\(?\d{2}\)?\s?\d{4,5}-?\d{4}" title="Formato: (00) 00000-0000" className="input-premium" />
                      </div>
                    </div>
                  </div>

                  <div className="relative group mt-4">
                    <div className="absolute -inset-[1px] rounded-2xl opacity-60 group-hover:opacity-100 transition-opacity duration-500" style={{ background: "linear-gradient(135deg, rgba(232,201,118,0.4), rgba(212,168,83,0.2), rgba(184,144,58,0.4))", filter: "blur(4px)" }} />
                    <button type="submit" disabled={formLoading} className="relative w-full py-4 rounded-2xl overflow-hidden transition-all duration-300 group-hover:scale-[1.01] active:scale-[0.98] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed" style={{ background: "linear-gradient(135deg, #E8C976 0%, #D4A853 30%, #B8903A 70%, #A07C2A 100%)", color: "#0a0908", boxShadow: "0 8px 40px rgba(212, 168, 83, 0.3), 0 2px 12px rgba(212, 168, 83, 0.15), inset 0 1px 0 rgba(255,255,255,0.35), inset 0 -2px 4px rgba(0,0,0,0.1)" }}>
                      <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
                      <span className="absolute top-0 left-[10%] right-[10%] h-px pointer-events-none" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)" }} />
                      <span className="relative text-base font-semibold tracking-[-0.01em]">{formLoading ? "Enviando..." : "Quero entrar para a Rede"}</span>
                    </button>
                  </div>

                  {formError && (
                    <p className="text-sm text-center mt-2" style={{ color: "#ef4444" }} role="alert">{formError}</p>
                  )}

                  {/* Garantia + segurança */}
                  <div className="mt-4 p-4 rounded-xl" style={{ background: "rgba(212,168,83,0.04)", border: "1px solid rgba(212,168,83,0.08)" }}>
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: "var(--gold)" }} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                      </svg>
                      <div>
                        <p className="text-xs font-medium text-white mb-1">Sem compromisso</p>
                        <p className="text-[11px]" style={{ color: "var(--text-muted)", lineHeight: 1.6 }}>Preencha o formulário e converse com nossa equipe antes de tomar qualquer decisão. Seus dados estão seguros.</p>
                      </div>
                    </div>
                  </div>
                </form>
              ) : (
                <motion.div className="text-center py-8" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
                  <div className="w-16 h-16 rounded-full mx-auto mb-5 flex items-center justify-center" style={{ background: "rgba(212, 168, 83, 0.1)", border: "1px solid rgba(212, 168, 83, 0.2)" }}>
                    <svg className="w-7 h-7 text-[var(--gold)]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold mb-2" style={{ fontFamily: "var(--font-heading), sans-serif", color: "var(--gold)" }}>Enviado com sucesso!</h3>
                  <p className="text-sm" style={{ color: "var(--text-secondary)" }}>Nossa equipe entrará em contato em breve.</p>
                </motion.div>
              )}
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </Section>

      {/* ─── 11. CTA FINAL ─── */}
      <Section className="relative noise">
        <div className="absolute inset-0">
          <Image src="/images/hero-bg.webp" alt="" fill className="object-cover object-center opacity-20" sizes="100vw" aria-hidden="true" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.6) 40%, rgba(0,0,0,0.6) 60%, rgba(0,0,0,0.9) 100%)" }} />
        </div>
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(212, 168, 83, 0.1) 0%, transparent 60%)" }} />

        <div className="relative z-10 max-w-5xl mx-auto px-5 md:px-6 py-16 md:py-36 text-center">
          {/* Decorative top */}
          <Reveal>
            <div className="flex items-center justify-center gap-4 mb-8" aria-hidden="true">
              <div className="h-px w-10 md:w-16" style={{ background: "linear-gradient(90deg, transparent, rgba(212, 168, 83, 0.4))" }} />
              <span className="text-[11px] font-semibold tracking-[0.3em] uppercase" style={{ color: "var(--gold)" }}>Sua decisão</span>
              <div className="h-px w-10 md:w-16" style={{ background: "linear-gradient(90deg, rgba(212, 168, 83, 0.4), transparent)" }} />
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <h2 className="text-gradient-white text-[2rem] sm:text-4xl md:text-[3.1rem] leading-[2.625rem] md:leading-[1.15] mb-6" style={{ fontFamily: "var(--font-heading), sans-serif", fontWeight: 400, letterSpacing: "-0.03em" }}>
              Você pode continuar tentando sozinho&hellip;
              <br /><span className="text-gradient-gold-shine" style={{ fontWeight: 700 }}>ou crescer com as conexões certas.</span>
            </h2>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="text-base md:text-lg mb-12 max-w-xl mx-auto" style={{ color: "var(--text-secondary)", lineHeight: 1.8 }}>
              O próximo nível do seu negócio depende do ambiente que você escolhe.
            </p>
          </Reveal>

          <Reveal delay={0.3}>
            <a href="#formulario" className="group relative z-20 cursor-pointer inline-block">
              <div className="absolute -inset-[1px] rounded-2xl opacity-60 group-hover:opacity-100 transition-opacity duration-500" style={{ background: "linear-gradient(135deg, rgba(232,201,118,0.4), rgba(212,168,83,0.2), rgba(184,144,58,0.4))", filter: "blur(4px)" }} />
              <div className="relative inline-flex items-center justify-center px-8 md:px-12 py-4 md:py-5 rounded-2xl overflow-hidden transition-all duration-300 group-hover:scale-[1.02] active:scale-[0.98]" style={{ background: "linear-gradient(135deg, #E8C976 0%, #D4A853 30%, #B8903A 70%, #A07C2A 100%)", color: "#0a0908", boxShadow: "0 8px 40px rgba(212, 168, 83, 0.35), 0 2px 12px rgba(212, 168, 83, 0.2), inset 0 1px 0 rgba(255,255,255,0.35), inset 0 -2px 4px rgba(0,0,0,0.1)" }}>
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
                <span className="absolute top-0 left-[10%] right-[10%] h-px pointer-events-none" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)" }} />
                <span className="relative text-base md:text-lg font-semibold tracking-[-0.01em]">Quero fazer parte da Rede de Valor</span>
              </div>
            </a>
          </Reveal>

          <Reveal delay={0.4}>
            <div className="flex items-center justify-center gap-3 mt-8">
              <div className="flex -space-x-2">
                {speakers.slice(0, 3).map((s, i) => (
                  <div key={i} className="w-9 h-9 rounded-full overflow-hidden" style={{ border: "2px solid rgba(212, 168, 83, 0.3)" }}>
                    <Image src={s.image} alt={s.name} width={36} height={36} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                Já são <strong className="text-[var(--gold)]">100+</strong> empresários na Rede
              </p>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* ─── POPUP DE CONFIRMAÇÃO ─── */}
      <AnimatePresence>
        {showPopup && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center px-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowPopup(false)} />

            {/* Modal */}
            <motion.div
              className="relative w-full max-w-md rounded-2xl p-8 md:p-10 text-center"
              style={{
                background: "linear-gradient(160deg, rgba(25, 23, 20, 0.98) 0%, rgba(12, 11, 9, 0.99) 100%)",
                border: "1px solid rgba(212, 168, 83, 0.15)",
                boxShadow: "0 30px 80px rgba(0, 0, 0, 0.6), 0 0 60px rgba(212, 168, 83, 0.08)",
              }}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Ícone check */}
              <div className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center" style={{ background: "rgba(212, 168, 83, 0.1)", border: "1.5px solid rgba(212, 168, 83, 0.25)" }}>
                <svg className="w-8 h-8" style={{ color: "var(--gold)" }} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                </svg>
              </div>

              <h3 className="text-2xl md:text-3xl font-bold mb-3" style={{ fontFamily: "var(--font-heading), sans-serif", color: "var(--gold)" }}>
                Recebemos suas informações!
              </h3>
              <p className="text-sm md:text-base mb-8" style={{ color: "var(--text-secondary)", lineHeight: 1.7 }}>
                Obrigado por preencher o formulário. Em breve, nossa equipe entrará em contato com você.
              </p>

              <button
                onClick={() => setShowPopup(false)}
                className="group relative inline-flex items-center justify-center px-8 py-3.5 rounded-xl overflow-hidden transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] cursor-pointer"
                style={{
                  background: "linear-gradient(135deg, #E8C976 0%, #D4A853 30%, #B8903A 70%, #A07C2A 100%)",
                  color: "#0a0908",
                  boxShadow: "0 8px 30px rgba(212, 168, 83, 0.3), inset 0 1px 0 rgba(255,255,255,0.3)",
                }}
              >
                <span className="font-semibold text-sm">Entendido</span>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── FOOTER ─── */}
      <footer className="relative" style={{ background: "var(--bg-0)" }}>
        <div className="absolute inset-0">
          <Image src="/images/footer-bg.webp" alt="" fill className="object-cover opacity-15" sizes="100vw" aria-hidden="true" />
        </div>
        <div className="gold-line" />
        <div className="relative z-10 max-w-6xl mx-auto px-6 py-14">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <Image src="/images/logo-rede-de-valor-v1.webp" alt="Rede de Valor" width={120} height={40} className="h-7 w-auto opacity-60" />
              <span className="text-[var(--text-muted)]">×</span>
              <Image src="/images/logo-time-v2.webp" alt="TIME" width={80} height={30} className="h-5 w-auto opacity-60" />
            </div>
            {/* Social icons */}
            <div className="flex items-center gap-4">
              <a href="https://www.instagram.com/rededevaloroficial?igsh=dzY4NmFoc2RlN3Yy" className="w-11 h-11 rounded-full flex items-center justify-center cursor-pointer transition-colors duration-300 hover:bg-[rgba(212,168,83,0.1)]" style={{ border: "1px solid rgba(212,168,83,0.1)" }} aria-label="Instagram" target="_blank" rel="noopener noreferrer">
                <svg className="w-4 h-4 text-[var(--text-muted)]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
            </div>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              © {new Date().getFullYear()} Rede de Valor + TIME Escola de Negócios. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>

      {/* ─── WHATSAPP FLUTUANTE — desktop only ─── */}
      <a href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5500000000000'}`} target="_blank" rel="noopener noreferrer" className="whatsapp-float hidden md:flex" aria-label="WhatsApp">
        <svg viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
      </a>
    </main>
  );
}
