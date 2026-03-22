"use client";

import Image from "next/image";
import { motion, AnimatePresence, useScroll, useTransform, useInView } from "framer-motion";
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
   SPEAKER DATA
   ================================================================ */
const mainSpeaker = {
  name: "Tony Granado",
  role: "Empresário e Estrategista de Negócios",
  image: "/images/expert - Tony Granado.jpeg",
  bio: "Empresário, comunicador e estrategista de negócios, com forte atuação em conexões, negociação e desenvolvimento de projetos. É um dos idealizadores do ecossistema Rede de Valor + TIME.",
};

const speakers = [
  {
    name: "Izaias Pissinini",
    role: "Cofundador · Rede de Valor",
    image: "/images/expert-izaias-pissinini.jpg",
    bio: "+23 anos em finanças e gestão. Especialista em contabilidade estratégica.",
  },
  {
    name: "Deivison Ferreira",
    role: "Liderança e Comportamento",
    image: "/images/expert-deivison-ferreira .jpg",
    bio: "+30 anos transformando líderes e empresas com foco em comportamento humano.",
  },
  {
    name: "Carlos Camilo",
    role: "Mallas Barber",
    image: "/images/expert - Mallas barber _ Carlos camilo.jpg",
    bio: "Referência no segmento de barbearias premium e empreendedorismo.",
  },
  {
    name: "Mamá Brito",
    role: "Empresário Multisegmento",
    image: "/images/expert - Mamá Brito.png",
    bio: "Atuação em múltiplos segmentos com forte visão de crescimento.",
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
  { value: 500, suffix: "+", label: "Empresários conectados" },
  { value: 23, suffix: "+", label: "Anos de experiência" },
  { value: 50, suffix: "+", label: "Eventos realizados" },
  { value: 12, suffix: "", label: "Cidades alcançadas" },
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
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, reducedMotion ? 0 : 120]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, reducedMotion ? 1 : 0]);

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
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
      {/* ─── NAVBAR ─── */}
      <nav className="fixed top-0 left-0 right-0 z-50">
        <div
          className="mx-3 md:mx-8 mt-3 px-5 md:px-8 py-3.5 rounded-2xl flex items-center justify-between transition-all duration-500"
          style={{
            background: scrolled ? "rgba(20, 19, 18, 0.85)" : "rgba(20, 19, 18, 0.4)",
            backdropFilter: "blur(20px) saturate(180%)",
            border: `1px solid ${scrolled ? "rgba(212, 168, 83, 0.1)" : "rgba(255,255,255,0.03)"}`,
          }}
        >
          <a href="#" className="flex-shrink-0">
            <Image src="/images/logo-rede-de-valor-branco-v2.png" alt="Rede de Valor" width={120} height={40} className="h-7 md:h-8 w-auto" />
          </a>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {[
              { label: "Benefícios", href: "#beneficios" },
              { label: "Como Funciona", href: "#como-funciona" },
              { label: "Quem Somos", href: "#quem-somos" },
            ].map((link) => (
              <a key={link.href} href={link.href} className="text-sm text-[var(--text-secondary)] hover:text-[var(--gold)] transition-colors duration-300 cursor-pointer">
                {link.label}
              </a>
            ))}
          </div>

          {/* Desktop CTA */}
          <a href="#formulario" className="hidden md:inline-flex px-5 py-2.5 text-sm font-medium rounded-xl cursor-pointer transition-all duration-300 hover:shadow-[0_0_24px_rgba(212,168,83,0.25)]" style={{ background: "linear-gradient(135deg, var(--gold), var(--gold-dark))", color: "#000" }}>
            Quero participar
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
              className="md:hidden mx-3 mt-2 rounded-2xl p-6 flex flex-col gap-5"
              style={{ background: "rgba(0,0,0,0.92)", backdropFilter: "blur(20px)", border: "1px solid rgba(212,168,83,0.1)" }}
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
              <a href="#formulario" onClick={() => setMobileMenuOpen(false)} className="text-center py-3 rounded-xl font-semibold cursor-pointer" style={{ background: "linear-gradient(135deg, var(--gold), var(--gold-dark))", color: "#000" }}>
                Quero participar
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ─── 1. HERO ─── */}
      <section ref={heroRef} className="relative min-h-screen noise flex items-center overflow-hidden">
        {/* Background — Event image */}
        <div className="absolute inset-0">
          <Image src="/images/hero-bg.jpeg" alt="" fill className="object-cover object-top" priority sizes="100vw" aria-hidden="true" />
        </div>

        {/* Dark overlay for text legibility */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.65) 35%, rgba(0,0,0,0.7) 65%, rgba(0,0,0,0.95) 100%)" }} />

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

        <motion.div className="relative z-30 w-full max-w-4xl mx-auto px-6 md:px-12 pt-32 pb-20" style={{ y: heroY, opacity: heroOpacity }}>
          <div className="flex flex-col items-center text-center">
            {/* Logos */}
            <div className="flex items-center gap-6 mb-8">
              <Image src="/images/logo-rede-de-valor-branco-v2.png" alt="Rede de Valor" width={120} height={40} className="h-7 sm:h-8 w-auto opacity-80" />
              <span className="text-lg font-light" style={{ color: "rgba(212, 168, 83, 0.4)" }}>+</span>
              <Image src="/images/logo-time-v2.png" alt="TIME Escola de Negócios" width={120} height={40} className="h-7 sm:h-8 w-auto opacity-80" />
            </div>

            {/* Badge */}
            <div className="inline-flex items-center mb-8 px-5 py-2.5 rounded-full" style={{ background: "rgba(0, 0, 0, 0.5)", border: "1px solid rgba(212, 168, 83, 0.25)", backdropFilter: "blur(12px)" }}>
              <span className="text-xs font-medium tracking-[0.2em] uppercase" style={{ color: "var(--gold)" }}>Networking + Escola de Negócios</span>
            </div>

            <h1
              className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.8rem] leading-[1.08] mb-6 max-w-[20ch] mx-auto"
              style={{ fontFamily: "var(--font-heading), serif", fontWeight: 600, letterSpacing: "-0.025em" }}
            >
              Um novo nível de networking para quem quer <span className="text-gradient-gold-shine">crescer de verdade.</span>
            </h1>

            <p
              className="text-base md:text-lg mb-10 max-w-2xl mx-auto"
              style={{ color: "var(--text-secondary)", lineHeight: 1.85 }}
            >
              A união da <span className="font-medium text-[var(--text-primary)]">Rede de Valor</span> com a{" "}
              <span className="font-medium text-[var(--text-primary)]">TIME Escola de Negócios</span> criou um ecossistema
              onde conexões geram oportunidades reais, crescimento estruturado e posicionamento no mercado.
            </p>

            <div className="flex flex-col sm:flex-row gap-5 items-center justify-center">
              <a href="#formulario" className="animate-gold-pulse relative z-20 inline-flex items-center justify-center px-10 py-5 text-lg font-semibold rounded-xl cursor-pointer transition-all duration-300 hover:brightness-110 active:scale-[0.98]" style={{ background: "linear-gradient(135deg, var(--gold-light), var(--gold), var(--gold-dark))", color: "#000", boxShadow: "0 4px 32px rgba(212, 168, 83, 0.35), 0 0 20px rgba(212, 168, 83, 0.2)" }}>
                Quero fazer parte da Rede
              </a>
              <a href="#beneficios" className="inline-flex items-center justify-center gap-2 px-8 py-[18px] text-base font-medium rounded-xl cursor-pointer transition-all duration-300 hover:border-[rgba(212,168,83,0.5)] hover:bg-[rgba(212,168,83,0.04)]" style={{ border: "1px solid rgba(212, 168, 83, 0.2)", color: "var(--gold)" }}>
                Saiba mais
              </a>
            </div>
          </div>
        </motion.div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black to-transparent z-20" />
      </section>


      {/* ─── 3. AVISO IMPORTANTE ─── */}
      <Section className="py-12 md:py-16">
        <div className="max-w-3xl mx-auto px-6">
          <Reveal direction="scale">
            <div className="urgency-card px-8 py-10 md:px-14 md:py-14 text-center">
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
                className="relative z-10 text-2xl md:text-3xl lg:text-[2.1rem] text-white mb-5"
                style={{ fontFamily: "var(--font-heading), serif", fontWeight: 500, letterSpacing: "-0.01em", lineHeight: 1.3 }}
              >
                As vagas para a Rede de Valor são{" "}
                <span className="text-gradient-gold">limitadas.</span>
              </h3>

              {/* Decorative divider */}
              <div className="flex items-center justify-center gap-3 mb-6" aria-hidden="true">
                <div className="h-px w-8" style={{ background: "linear-gradient(90deg, transparent, rgba(212, 168, 83, 0.3))" }} />
                <div className="w-1.5 h-1.5 rotate-45" style={{ background: "var(--gold)", opacity: 0.35 }} />
                <div className="h-px w-8" style={{ background: "linear-gradient(90deg, rgba(212, 168, 83, 0.3), transparent)" }} />
              </div>

              {/* Body */}
              <p className="relative z-10 text-[15px] md:text-base max-w-md mx-auto" style={{ color: "var(--text-secondary)", lineHeight: 1.85 }}>
                Trabalhamos com um número restrito de membros para garantir a qualidade das conexões e o acompanhamento personalizado. O processo é seletivo.
              </p>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* ─── 4. PROBLEMA ─── */}
      <Section className="py-20 md:py-32 bg-radial-gold">
        <div className="max-w-5xl mx-auto px-6">
          {/* Section header — centered */}
          <div className="text-center mb-16">
            <Reveal>
              <h2 className="text-3xl sm:text-4xl md:text-5xl leading-[1.1] mb-6 max-w-3xl mx-auto" style={{ fontFamily: "var(--font-heading), serif", fontWeight: 500, letterSpacing: "-0.02em" }}>
                Você não cresce sozinho. <span className="text-gradient-gold" style={{ fontWeight: 600 }}>E esse é o maior erro de muitos empresários.</span>
              </h2>
            </Reveal>

            <Reveal delay={0.15}>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 text-lg" style={{ color: "var(--text-secondary)", lineHeight: 1.9 }}>
                <p>Não é falta de esforço.</p>
                <span className="hidden sm:block w-1 h-1 rounded-full" style={{ background: "var(--gold)", opacity: 0.4 }} />
                <p>Não é falta de capacidade.</p>
                <span className="hidden sm:block w-1 h-1 rounded-full" style={{ background: "var(--gold)", opacity: 0.4 }} />
                <p className="text-[var(--gold)]">É falta de ambiente.</p>
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
                  <h4 className="font-semibold text-white text-base mb-2">{item.title}</h4>
                  <p className="text-sm" style={{ color: "var(--text-secondary)", lineHeight: 1.7 }}>{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Bottom note */}
          <Reveal delay={0.4}>
            <p className="text-center text-sm mt-10" style={{ color: "var(--text-muted)" }}>
              E isso trava crescimento, oportunidades e resultados.
            </p>
          </Reveal>
        </div>
      </Section>

      {/* ─── QUOTE DIVIDER ─── */}
      <Section className="py-20 md:py-32 noise relative">
        <div className="absolute inset-0" style={{ background: "var(--bg-1)" }} />
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(212,168,83,0.05) 0%, transparent 65%)" }} />

        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          {/* Decorative top line */}
          <Reveal>
            <div className="flex items-center justify-center gap-4 mb-10" aria-hidden="true">
              <div className="h-px w-12 md:w-20" style={{ background: "linear-gradient(90deg, transparent, rgba(212, 168, 83, 0.3))" }} />
              <svg className="w-5 h-5" style={{ color: "var(--gold)", opacity: 0.5 }} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
              </svg>
              <div className="h-px w-12 md:w-20" style={{ background: "linear-gradient(90deg, rgba(212, 168, 83, 0.3), transparent)" }} />
            </div>
          </Reveal>

          {/* Quote */}
          <Reveal delay={0.1}>
            <p className="text-2xl sm:text-3xl md:text-4xl leading-[1.3]" style={{ fontFamily: "var(--font-heading), serif", fontWeight: 400, color: "var(--text-primary)", letterSpacing: "-0.01em" }}>
              &ldquo;O que acelera resultados não é só trabalho.
              <br /><span className="text-gradient-gold-shine" style={{ fontWeight: 500 }}>É conexão.</span>&rdquo;
            </p>
          </Reveal>

          {/* Decorative bottom */}
          <Reveal delay={0.25}>
            <div className="flex items-center justify-center gap-3 mt-10" aria-hidden="true">
              <div className="h-px w-8" style={{ background: "linear-gradient(90deg, transparent, rgba(212, 168, 83, 0.3))" }} />
              <div className="w-1.5 h-1.5 rotate-45" style={{ background: "var(--gold)", opacity: 0.35 }} />
              <div className="h-px w-8" style={{ background: "linear-gradient(90deg, rgba(212, 168, 83, 0.3), transparent)" }} />
            </div>
          </Reveal>
        </div>
      </Section>

      {/* ─── 5. FUSÃO REDE + TIME ─── */}
      <Section className="py-24 md:py-36 relative noise">
        {/* Background glow */}
        <div className="absolute inset-0" style={{ background: "var(--bg-1)" }} />
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 70% 60% at 50% 40%, rgba(212, 168, 83, 0.05) 0%, transparent 65%)" }} />

        <div className="relative z-10 max-w-5xl mx-auto px-6">
          {/* Heading */}
          <Reveal>
            <h2 className="text-center text-3xl sm:text-4xl md:text-5xl leading-[1.1] mb-16 md:mb-20" style={{ fontFamily: "var(--font-heading), serif", fontWeight: 500, letterSpacing: "-0.02em" }}>
              Conexão + Crescimento <br className="hidden sm:block" /><span className="text-gradient-gold" style={{ fontWeight: 600 }}>no mesmo ecossistema.</span>
            </h2>
          </Reveal>

          {/* Two columns with center divider */}
          <div className="relative flex flex-col lg:flex-row items-stretch gap-12 lg:gap-0">
            {/* Left — Rede de Valor */}
            <Reveal direction="left" className="flex-1">
              <div className="flex flex-col items-center text-center">
                <Image src="/images/logo-rede-de-valor-branco-v2.png" alt="Rede de Valor" width={160} height={48} className="h-10 md:h-14 w-auto opacity-90 mb-5" />
                <p className="text-sm md:text-base" style={{ color: "var(--text-secondary)", lineHeight: 1.7 }}>
                  Nasceu para gerar conexões reais<br />entre empresários.
                </p>
              </div>
            </Reveal>

            {/* Center divider — vertical gold line with "+" */}
            <div className="hidden lg:flex flex-col items-center flex-shrink-0" aria-hidden="true">
              <div className="flex-1 w-px gold-line-vertical" />
              <div className="w-12 h-12 rounded-full flex items-center justify-center my-3" style={{ background: "rgba(212, 168, 83, 0.08)", border: "1px solid rgba(212, 168, 83, 0.25)" }}>
                <span className="text-2xl font-light" style={{ color: "var(--gold)" }}>+</span>
              </div>
              <div className="flex-1 w-px gold-line-vertical" />
            </div>

            {/* Mobile divider */}
            <div className="flex lg:hidden items-center justify-center gap-4" aria-hidden="true">
              <div className="h-px flex-1" style={{ background: "linear-gradient(90deg, transparent, rgba(212, 168, 83, 0.3))" }} />
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "rgba(212, 168, 83, 0.08)", border: "1px solid rgba(212, 168, 83, 0.25)" }}>
                <span className="text-xl font-light" style={{ color: "var(--gold)" }}>+</span>
              </div>
              <div className="h-px flex-1" style={{ background: "linear-gradient(90deg, rgba(212, 168, 83, 0.3), transparent)" }} />
            </div>

            {/* Right — TIME */}
            <Reveal direction="right" className="flex-1">
              <div className="flex flex-col items-center text-center">
                <Image src="/images/logo-time-v2.png" alt="TIME Escola de Negócios" width={120} height={40} className="h-8 md:h-12 w-auto opacity-90 mb-5" />
                <p className="text-sm md:text-base" style={{ color: "var(--text-secondary)", lineHeight: 1.7 }}>
                  Trouxe estrutura, conhecimento<br />e desenvolvimento.
                </p>
              </div>
            </Reveal>
          </div>

          {/* Bottom result */}
          <Reveal delay={0.3}>
            <div className="mt-16 md:mt-20 text-center">
              <div className="flex items-center justify-center gap-3 mb-6" aria-hidden="true">
                <div className="h-px w-12" style={{ background: "linear-gradient(90deg, transparent, rgba(212, 168, 83, 0.3))" }} />
                <div className="w-1.5 h-1.5 rotate-45" style={{ background: "var(--gold)", opacity: 0.4 }} />
                <div className="h-px w-12" style={{ background: "linear-gradient(90deg, rgba(212, 168, 83, 0.3), transparent)" }} />
              </div>
              <p className="text-lg md:text-xl" style={{ fontFamily: "var(--font-heading), serif", color: "var(--text-primary)", lineHeight: 1.6 }}>
                Juntas, criam um <span className="text-gradient-gold" style={{ fontWeight: 600 }}>ecossistema completo</span> para quem quer evoluir de verdade.
              </p>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* ─── STATS BAR ─── */}
      <Section className="py-16 md:py-20 noise relative">
        <div className="absolute inset-0" style={{ background: "var(--bg-2)" }} />
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 60% 80% at 50% 50%, rgba(212, 168, 83, 0.04) 0%, transparent 70%)" }} />
        <div className="absolute top-0 left-0 right-0 gold-line" />
        <div className="absolute bottom-0 left-0 right-0 gold-line" />

        <div className="relative z-10 max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0">
            {stats.map((stat, i) => (
              <Reveal key={i} delay={0.1 * i} className={`text-center ${i > 0 ? "md:border-l" : ""}`} style={i > 0 ? { borderColor: "rgba(212, 168, 83, 0.12)" } : undefined}>
                <p className="text-4xl md:text-5xl lg:text-6xl font-bold mb-3 text-gradient-gold" style={{ fontFamily: "var(--font-body), sans-serif" }}>
                  <CountUp target={stat.value} suffix={stat.suffix} />
                </p>
                <p className="text-xs font-medium tracking-wider uppercase" style={{ color: "var(--text-secondary)", letterSpacing: "0.1em" }}>{stat.label}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      {/* ─── 6. BENEFÍCIOS ─── */}
      <Section id="beneficios" className="relative py-20 md:py-28">
        {/* Background image */}
        <div className="absolute inset-0">
          <Image src="/images/benefits-bg.jpeg" alt="" fill className="object-cover opacity-30" sizes="100vw" aria-hidden="true" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.9) 100%)" }} />
        </div>
        <div className="absolute bottom-0 left-0" style={{ width: "50vw", height: "50vh", background: "radial-gradient(ellipse at 20% 80%, rgba(212, 168, 83, 0.04) 0%, transparent 60%)" }} />

        <div className="relative z-10 max-w-6xl mx-auto px-6">
          <Reveal className="text-center mb-14">
            <div className="inline-flex items-center gap-2 mb-5">
              <span className="h-px w-8" style={{ background: "var(--gold)" }} />
              <span className="text-xs font-medium tracking-[0.25em] uppercase" style={{ color: "var(--gold)" }}>O que você recebe</span>
              <span className="h-px w-8" style={{ background: "var(--gold)" }} />
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl leading-[1.15] mb-3" style={{ fontFamily: "var(--font-heading), serif", fontWeight: 500, letterSpacing: "-0.015em" }}>
              Tudo para acelerar seus resultados <span className="text-gradient-gold" style={{ fontWeight: 600 }}>em um só lugar.</span>
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
                  <div className="card-premium card-gold-accent p-7 h-full cursor-pointer transition-all duration-300 hover:-translate-y-1" style={{ ...(isHighlight ? { borderColor: "rgba(212, 168, 83, 0.2)" } : {}) }}>
                    <div className={`${isHighlight ? "w-14 h-14" : "w-12 h-12"} rounded-xl flex items-center justify-center mb-5`} style={{ background: isHighlight ? "linear-gradient(135deg, rgba(212, 168, 83, 0.18), rgba(212, 168, 83, 0.05))" : "linear-gradient(135deg, rgba(212, 168, 83, 0.1), rgba(212, 168, 83, 0.03))", color: "var(--gold)", boxShadow: isHighlight ? "0 0 24px rgba(212, 168, 83, 0.1)" : "0 0 16px rgba(212, 168, 83, 0.05)" }}>
                      {b.icon}
                    </div>
                    <h4 className={`${isHighlight ? "text-base" : "text-[15px]"} font-semibold mb-2 text-white`}>{b.title}</h4>
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
      <Section id="como-funciona" className="py-24 md:py-36 noise relative">
        <div className="absolute inset-0" style={{ background: "var(--bg-1)" }} />
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 70% 50% at 50% 30%, rgba(212, 168, 83, 0.04) 0%, transparent 65%)" }} />

        <div className="relative z-10 max-w-6xl mx-auto px-6">
          {/* Header */}
          <Reveal className="text-center mb-16 md:mb-20">
            <div className="flex items-center justify-center gap-4 mb-5" aria-hidden="true">
              <div className="h-px w-10 md:w-16" style={{ background: "linear-gradient(90deg, transparent, rgba(212, 168, 83, 0.4))" }} />
              <span className="text-[11px] font-semibold tracking-[0.3em] uppercase" style={{ color: "var(--gold)" }}>Passo a passo</span>
              <div className="h-px w-10 md:w-16" style={{ background: "linear-gradient(90deg, rgba(212, 168, 83, 0.4), transparent)" }} />
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl leading-[1.1]" style={{ fontFamily: "var(--font-heading), serif", fontWeight: 500, letterSpacing: "-0.02em" }}>
              Como funciona <span className="text-gradient-gold" style={{ fontWeight: 600 }}>a Rede</span>
            </h2>
          </Reveal>

          {/* Horizontal steps — desktop */}
          <div className="hidden md:block">
            <div className="grid grid-cols-5 gap-0">
              {steps.map((step, i) => (
                <Reveal key={i} delay={0.1 * i} direction="up">
                  <div className="relative flex flex-col items-center text-center px-4 lg:px-6">
                    {/* Number — large editorial */}
                    <span
                      className="text-6xl lg:text-7xl mb-3 text-gradient-gold-shine"
                      style={{ fontFamily: "var(--font-heading), serif", fontWeight: 300, lineHeight: 1 }}
                    >
                      {step.num}
                    </span>

                    {/* Decorative line + dot */}
                    <div className="flex flex-col items-center mb-5" aria-hidden="true">
                      <div className="w-px h-5" style={{ background: "linear-gradient(180deg, var(--gold), transparent)", opacity: 0.4 }} />
                      <div className="w-1.5 h-1.5 rounded-full mt-1" style={{ background: "var(--gold)", opacity: 0.5, boxShadow: "0 0 6px rgba(212, 168, 83, 0.4)" }} />
                    </div>

                    {/* Title */}
                    <h4 className="text-sm lg:text-base font-semibold text-white mb-2.5" style={{ fontFamily: "var(--font-heading), serif", letterSpacing: "-0.01em" }}>{step.title}</h4>

                    {/* Description */}
                    <p className="text-xs lg:text-[13px] max-w-[180px]" style={{ color: "var(--text-secondary)", lineHeight: 1.7 }}>{step.desc}</p>

                  </div>
                </Reveal>
              ))}
            </div>

            {/* Bottom decorative divider */}
            <Reveal delay={0.5}>
              <div className="flex items-center justify-center gap-3 mt-16" aria-hidden="true">
                <div className="h-px w-16" style={{ background: "linear-gradient(90deg, transparent, rgba(212, 168, 83, 0.3))" }} />
                <div className="w-1.5 h-1.5 rotate-45" style={{ background: "var(--gold)", opacity: 0.35 }} />
                <div className="h-px w-16" style={{ background: "linear-gradient(90deg, rgba(212, 168, 83, 0.3), transparent)" }} />
              </div>
            </Reveal>
          </div>

          {/* Vertical steps — mobile */}
          <ol className="md:hidden list-none space-y-0">
            {steps.map((step, i) => (
              <Reveal key={i} delay={0.08 * i} direction="up">
                <li className="flex items-start gap-5 py-6" style={{ borderBottom: i < steps.length - 1 ? "1px solid rgba(212, 168, 83, 0.08)" : "none" }}>
                  <span
                    className="text-4xl text-gradient-gold flex-shrink-0 w-14 text-center"
                    style={{ fontFamily: "var(--font-heading), serif", fontWeight: 300, lineHeight: 1 }}
                  >
                    {step.num}
                  </span>
                  <div className="pt-0.5">
                    <h4 className="text-base font-semibold text-white mb-1.5" style={{ fontFamily: "var(--font-heading), serif" }}>{step.title}</h4>
                    <p className="text-sm" style={{ color: "var(--text-secondary)", lineHeight: 1.7 }}>{step.desc}</p>
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </Section>

      {/* ─── 8. IDEALIZADORES ─── */}
      <Section id="quem-somos" className="py-24 md:py-36 relative noise">
        <div className="absolute inset-0" style={{ background: "var(--bg-0)" }} />
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 60% 50% at 50% 30%, rgba(212, 168, 83, 0.04) 0%, transparent 65%)" }} />

        <div className="relative z-10 max-w-6xl mx-auto px-6">
          {/* Header */}
          <Reveal className="text-center mb-16 md:mb-20">
            <div className="flex items-center justify-center gap-4 mb-5" aria-hidden="true">
              <div className="h-px w-10 md:w-16" style={{ background: "linear-gradient(90deg, transparent, rgba(212, 168, 83, 0.4))" }} />
              <span className="text-[11px] font-semibold tracking-[0.3em] uppercase" style={{ color: "var(--gold)" }}>Idealizadores</span>
              <div className="h-px w-10 md:w-16" style={{ background: "linear-gradient(90deg, rgba(212, 168, 83, 0.4), transparent)" }} />
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl leading-[1.1]" style={{ fontFamily: "var(--font-heading), serif", fontWeight: 500, letterSpacing: "-0.02em" }}>
              Quem está por trás <span className="text-gradient-gold" style={{ fontWeight: 600 }}>de tudo isso</span>
            </h2>
          </Reveal>

          {/* Main Speaker — editorial split */}
          <Reveal className="mb-20" direction="up">
            <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
              <div className="relative w-full md:w-[340px] flex-shrink-0">
                <div className="relative rounded-2xl overflow-hidden" style={{ aspectRatio: "3/4" }}>
                  <Image src={mainSpeaker.image} alt={mainSpeaker.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 340px" />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 40%)" }} />
                </div>
                {/* Gold accent frame */}
                <div className="absolute -bottom-3 -right-3 w-full h-full rounded-2xl" style={{ border: "1px solid rgba(212, 168, 83, 0.15)", zIndex: -1 }} aria-hidden="true" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <p className="text-[11px] font-semibold tracking-[0.3em] uppercase mb-3" style={{ color: "var(--gold)" }}>
                  Idealizador Principal
                </p>
                <h3 className="text-3xl md:text-4xl font-semibold text-white mb-3" style={{ fontFamily: "var(--font-heading), serif", letterSpacing: "-0.01em" }}>
                  {mainSpeaker.name}
                </h3>
                <p className="text-sm mb-5" style={{ color: "var(--gold)" }}>{mainSpeaker.role}</p>
                <div className="flex items-center gap-3 mb-5 justify-center md:justify-start" aria-hidden="true">
                  <div className="h-px w-10" style={{ background: "linear-gradient(90deg, rgba(212, 168, 83, 0.3), transparent)" }} />
                </div>
                <p className="text-base md:text-lg max-w-lg" style={{ color: "var(--text-secondary)", lineHeight: 1.85 }}>
                  {mainSpeaker.bio}
                </p>
              </div>
            </div>
          </Reveal>

          {/* Other speakers — horizontal scroll-like layout */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {speakers.map((s, i) => (
              <Reveal key={i} delay={0.1 * i} direction="up">
                <div className="group">
                  <div className="relative rounded-2xl overflow-hidden mb-4" style={{ aspectRatio: "3/4" }}>
                    <Image src={s.image} alt={s.name} fill className="object-cover transition-transform duration-700 ease-out group-hover:scale-105" sizes="(max-width: 768px) 50vw, 25vw" />
                    <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.1) 50%, transparent 65%)" }} />
                    <div className="absolute inset-0 rounded-2xl transition-opacity duration-500 opacity-0 group-hover:opacity-100" style={{ border: "1px solid rgba(212, 168, 83, 0.25)", boxShadow: "inset 0 0 30px rgba(212, 168, 83, 0.05)" }} />
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <h4 className="text-base font-semibold text-white leading-tight mb-0.5" style={{ fontFamily: "var(--font-heading), serif" }}>{s.name}</h4>
                      <p className="text-xs" style={{ color: "var(--gold)" }}>{s.role}</p>
                    </div>
                  </div>
                  <p className="text-xs px-1 hidden md:block" style={{ color: "var(--text-muted)", lineHeight: 1.6 }}>{s.bio}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      {/* ─── 9. DEPOIMENTOS ─── */}
      <Section className="py-24 md:py-36 noise relative">
        <div className="absolute inset-0">
          <Image src="/images/testimonials-bg.jpeg" alt="" fill className="object-cover opacity-20" sizes="100vw" aria-hidden="true" />
          <div className="absolute inset-0" style={{ background: "var(--bg-1)", opacity: 0.85 }} />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-6">
          {/* Header */}
          <Reveal className="text-center mb-16 md:mb-20">
            <div className="flex items-center justify-center gap-4 mb-5" aria-hidden="true">
              <div className="h-px w-10 md:w-16" style={{ background: "linear-gradient(90deg, transparent, rgba(212, 168, 83, 0.4))" }} />
              <span className="text-[11px] font-semibold tracking-[0.3em] uppercase" style={{ color: "var(--gold)" }}>Depoimentos</span>
              <div className="h-px w-10 md:w-16" style={{ background: "linear-gradient(90deg, rgba(212, 168, 83, 0.4), transparent)" }} />
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl leading-[1.1]" style={{ fontFamily: "var(--font-heading), serif", fontWeight: 500, letterSpacing: "-0.02em" }}>
              O que dizem os <span className="text-gradient-gold" style={{ fontWeight: 600 }}>membros</span>
            </h2>
          </Reveal>

          {/* Testimonials — editorial layout */}
          <div className="space-y-16 md:space-y-20">
            {testimonials.map((t, i) => (
              <Reveal key={i} delay={0.1 * i} direction="up">
                <div className={`flex flex-col md:flex-row items-start gap-8 md:gap-14 ${i % 2 !== 0 ? "md:flex-row-reverse" : ""}`}>
                  {/* Quote side */}
                  <div className="flex-1">
                    {/* Stars */}
                    <div className="flex gap-1 mb-6">
                      {[...Array(5)].map((_, j) => (
                        <svg key={j} className="w-3.5 h-3.5" style={{ color: "var(--gold)" }} fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2L14.09 8.26L20 9.27L15.55 13.97L16.91 20L12 16.9L7.09 20L8.45 13.97L4 9.27L9.91 8.26L12 2Z" />
                        </svg>
                      ))}
                    </div>
                    <blockquote
                      className="text-xl md:text-2xl lg:text-[1.7rem] leading-[1.5] mb-6"
                      style={{ fontFamily: "var(--font-heading), serif", fontWeight: 400, color: "var(--text-primary)", fontStyle: "italic" }}
                    >
                      &ldquo;{t.quote}&rdquo;
                    </blockquote>
                    <div className="flex items-center gap-4">
                      <div className="w-px h-8" style={{ background: "var(--gold)", opacity: 0.3 }} aria-hidden="true" />
                      <div>
                        <p className="text-base font-semibold text-white">{t.name}</p>
                        <p className="text-xs" style={{ color: "var(--text-muted)" }}>{t.company}</p>
                      </div>
                    </div>
                  </div>

                  {/* Large initial — decorative */}
                  <div className="hidden md:flex items-center justify-center flex-shrink-0 w-28 lg:w-36 h-28 lg:h-36 rounded-full" style={{ background: "radial-gradient(circle, rgba(212, 168, 83, 0.08) 0%, transparent 70%)", border: "1px solid rgba(212, 168, 83, 0.12)" }}>
                    <span
                      className="text-5xl lg:text-6xl text-gradient-gold"
                      style={{ fontFamily: "var(--font-heading), serif", fontWeight: 300 }}
                    >
                      {t.initials}
                    </span>
                  </div>
                </div>

                {/* Divider between testimonials */}
                {i < testimonials.length - 1 && (
                  <div className="flex items-center justify-center gap-3 mt-16 md:mt-20" aria-hidden="true">
                    <div className="h-px w-12" style={{ background: "linear-gradient(90deg, transparent, rgba(212, 168, 83, 0.15))" }} />
                    <div className="w-1 h-1 rounded-full" style={{ background: "var(--gold)", opacity: 0.3 }} />
                    <div className="h-px w-12" style={{ background: "linear-gradient(90deg, rgba(212, 168, 83, 0.15), transparent)" }} />
                  </div>
                )}
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      {/* ─── 10. FORMULÁRIO ─── */}
      <Section id="formulario" className="py-24 md:py-36 relative noise">
        <div className="absolute inset-0" style={{ background: "var(--bg-0)" }} />
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 60% 50% at 50% 40%, rgba(212, 168, 83, 0.05) 0%, transparent 65%)" }} />

        <div className="relative z-10 max-w-5xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-14 lg:gap-20">
            {/* Left — copy */}
            <div className="flex-1 text-center lg:text-left">
              <Reveal direction="left">
                <div className="flex items-center justify-center lg:justify-start gap-4 mb-5" aria-hidden="true">
                  <div className="h-px w-10 md:w-16" style={{ background: "linear-gradient(90deg, transparent, rgba(212, 168, 83, 0.4))" }} />
                  <span className="text-[11px] font-semibold tracking-[0.3em] uppercase" style={{ color: "var(--gold)" }}>Próximo passo</span>
                  <div className="h-px w-10 md:w-16" style={{ background: "linear-gradient(90deg, rgba(212, 168, 83, 0.4), transparent)" }} />
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl leading-[1.1] mb-6" style={{ fontFamily: "var(--font-heading), serif", fontWeight: 500, letterSpacing: "-0.02em" }}>
                  Faça parte da<br /><span className="text-gradient-gold" style={{ fontWeight: 600 }}>Rede de Valor</span>
                </h2>
                <p className="text-base md:text-lg mb-8 max-w-md mx-auto lg:mx-0" style={{ color: "var(--text-secondary)", lineHeight: 1.8 }}>
                  Preencha seus dados e nossa equipe entrará em contato para te apresentar todos os detalhes.
                </p>

                {/* Trust signals */}
                <div className="space-y-3 hidden lg:block">
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
                <div className="card-premium card-gold-accent p-8 md:p-10" style={{ background: "linear-gradient(160deg, rgba(25, 23, 20, 0.97) 0%, rgba(12, 11, 9, 0.99) 100%)", borderColor: "rgba(212, 168, 83, 0.1)", boxShadow: "0 20px 80px rgba(0, 0, 0, 0.5), 0 0 40px rgba(212, 168, 83, 0.03)" }}>
              {!formSubmitted ? (
                <form className="space-y-5" onSubmit={async (e) => {
                  e.preventDefault();
                  setFormLoading(true);
                  setFormError("");
                  const form = e.currentTarget;
                  const data = Object.fromEntries(new FormData(form));
                  try {
                    // TODO: substituir pela URL real do webhook (n8n, Formspree, etc.)
                    const webhookUrl = process.env.NEXT_PUBLIC_FORM_WEBHOOK_URL;
                    if (webhookUrl) {
                      await fetch(webhookUrl, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(data),
                      });
                    }
                    setFormSubmitted(true);
                  } catch {
                    setFormError("Erro ao enviar. Tente novamente.");
                  } finally {
                    setFormLoading(false);
                  }
                }}>
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
                        <input type="tel" id="whatsapp" name="whatsapp" required placeholder="(00) 00000-0000" className="input-premium" />
                      </div>
                    </div>
                  </div>

                  <button type="submit" disabled={formLoading} className="btn-gold animate-gold-pulse w-full font-semibold text-base py-4 rounded-lg mt-4 active:scale-[0.98] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed">
                    {formLoading ? "Enviando..." : "Quero entrar para a Rede"}
                  </button>

                  {formError && (
                    <p className="text-sm text-center mt-2" style={{ color: "#ef4444" }} role="alert">{formError}</p>
                  )}

                  <div className="flex items-center justify-center gap-2 mt-2">
                    <svg className="w-3.5 h-3.5" style={{ color: "var(--text-muted)" }} fill="currentColor" viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/></svg>
                    <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>Seus dados estão seguros e não serão compartilhados.</p>
                  </div>
                </form>
              ) : (
                <motion.div className="text-center py-8" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
                  <div className="w-16 h-16 rounded-full mx-auto mb-5 flex items-center justify-center" style={{ background: "rgba(212, 168, 83, 0.1)", border: "1px solid rgba(212, 168, 83, 0.2)" }}>
                    <svg className="w-7 h-7 text-[var(--gold)]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold mb-2" style={{ fontFamily: "var(--font-heading), serif", color: "var(--gold)" }}>Enviado com sucesso!</h3>
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
          <Image src="/images/hero-bg.jpeg" alt="" fill className="object-cover object-center opacity-20" sizes="100vw" aria-hidden="true" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.6) 40%, rgba(0,0,0,0.6) 60%, rgba(0,0,0,0.9) 100%)" }} />
        </div>
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(212, 168, 83, 0.1) 0%, transparent 60%)" }} />

        <div className="relative z-10 max-w-4xl mx-auto px-6 py-24 md:py-36 text-center">
          {/* Decorative top */}
          <Reveal>
            <div className="flex items-center justify-center gap-4 mb-8" aria-hidden="true">
              <div className="h-px w-10 md:w-16" style={{ background: "linear-gradient(90deg, transparent, rgba(212, 168, 83, 0.4))" }} />
              <span className="text-[11px] font-semibold tracking-[0.3em] uppercase" style={{ color: "var(--gold)" }}>Sua decisão</span>
              <div className="h-px w-10 md:w-16" style={{ background: "linear-gradient(90deg, rgba(212, 168, 83, 0.4), transparent)" }} />
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <h2 className="text-3xl sm:text-4xl md:text-5xl leading-[1.1] mb-6" style={{ fontFamily: "var(--font-heading), serif", fontWeight: 500, letterSpacing: "-0.02em" }}>
              Você pode continuar tentando sozinho&hellip;
              <br /><span className="text-gradient-gold-shine" style={{ fontWeight: 600 }}>ou crescer com as conexões certas.</span>
            </h2>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="text-base md:text-lg mb-12 max-w-xl mx-auto" style={{ color: "var(--text-secondary)", lineHeight: 1.8 }}>
              O próximo nível do seu negócio depende do ambiente que você escolhe.
            </p>
          </Reveal>

          <Reveal delay={0.3}>
            <a href="#formulario" className="animate-gold-pulse inline-flex items-center justify-center px-12 py-5 text-lg font-semibold rounded-xl cursor-pointer transition-all duration-300 hover:brightness-110 active:scale-[0.98]" style={{ background: "linear-gradient(135deg, var(--gold-light), var(--gold), var(--gold-dark))", color: "#000", boxShadow: "0 4px 32px rgba(212, 168, 83, 0.25)" }}>
              Quero fazer parte da Rede de Valor
            </a>
          </Reveal>

          <Reveal delay={0.4}>
            <div className="flex items-center justify-center gap-3 mt-10">
              <div className="flex -space-x-2">
                {speakers.slice(0, 3).map((s, i) => (
                  <div key={i} className="w-9 h-9 rounded-full overflow-hidden" style={{ border: "2px solid rgba(212, 168, 83, 0.3)" }}>
                    <Image src={s.image} alt={s.name} width={36} height={36} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                Já são <strong className="text-[var(--gold)]">500+</strong> empresários na Rede
              </p>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* ─── FOOTER ─── */}
      <footer className="relative" style={{ background: "var(--bg-0)" }}>
        <div className="absolute inset-0">
          <Image src="/images/footer-bg.jpeg" alt="" fill className="object-cover opacity-15" sizes="100vw" aria-hidden="true" />
        </div>
        <div className="gold-line" />
        <div className="relative z-10 max-w-6xl mx-auto px-6 py-14">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <Image src="/images/logo-rede-de-valor-branco-v2.png" alt="Rede de Valor" width={120} height={40} className="h-7 w-auto opacity-60" />
              <span className="text-[var(--text-muted)]">×</span>
              <Image src="/images/logo-time-v2.png" alt="TIME" width={80} height={30} className="h-5 w-auto opacity-60" />
            </div>
            {/* Social icons */}
            <div className="flex items-center gap-4">
              <a href={process.env.NEXT_PUBLIC_INSTAGRAM_URL || "#"} className="w-9 h-9 rounded-full flex items-center justify-center cursor-pointer transition-colors duration-300 hover:bg-[rgba(212,168,83,0.1)]" style={{ border: "1px solid rgba(212,168,83,0.1)" }} aria-label="Instagram" target="_blank" rel="noopener noreferrer">
                <svg className="w-4 h-4 text-[var(--text-muted)]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
              <a href={process.env.NEXT_PUBLIC_LINKEDIN_URL || "#"} className="w-9 h-9 rounded-full flex items-center justify-center cursor-pointer transition-colors duration-300 hover:bg-[rgba(212,168,83,0.1)]" style={{ border: "1px solid rgba(212,168,83,0.1)" }} aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
                <svg className="w-4 h-4 text-[var(--text-muted)]" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
            </div>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              © {new Date().getFullYear()} Rede de Valor + TIME Escola de Negócios. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>

      {/* ─── WHATSAPP FLUTUANTE ─── */}
      <a href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5500000000000'}`} target="_blank" rel="noopener noreferrer" className="whatsapp-float" aria-label="WhatsApp">
        <svg viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
      </a>
    </main>
  );
}
