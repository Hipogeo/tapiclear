"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion";

/* ─── WATER DROP SVG FILTER ─────────────────────────────────── */
function WaterFilter() {
  return (
    <svg style={{ position: "absolute", width: 0, height: 0 }}>
      <defs>
        <filter id="water-blob">
          <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="4" seed="2" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="18" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <filter id="goo">
          <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
          <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -8" result="goo" />
          <feComposite in="SourceGraphic" in2="goo" operator="atop" />
        </filter>
      </defs>
    </svg>
  );
}

/* ─── FALLING DROPS CANVAS ──────────────────────────────────── */
function RainCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animId;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const drops = Array.from({ length: 38 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      len: 10 + Math.random() * 22,
      speed: 1.8 + Math.random() * 3.2,
      opacity: 0.08 + Math.random() * 0.18,
      width: 0.6 + Math.random() * 1.2,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drops.forEach((d) => {
        const grad = ctx.createLinearGradient(d.x, d.y, d.x, d.y + d.len);
        grad.addColorStop(0, `rgba(186,230,253,0)`);
        grad.addColorStop(0.5, `rgba(125,211,252,${d.opacity})`);
        grad.addColorStop(1, `rgba(56,189,248,${d.opacity * 0.4})`);
        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x, d.y + d.len);
        ctx.strokeStyle = grad;
        ctx.lineWidth = d.width;
        ctx.lineCap = "round";
        ctx.stroke();
        d.y += d.speed;
        if (d.y > canvas.height + d.len) {
          d.y = -d.len;
          d.x = Math.random() * canvas.width;
        }
      });
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 1,
      }}
    />
  );
}

/* ─── RIPPLE on click ───────────────────────────────────────── */
function RippleLayer() {
  const [ripples, setRipples] = useState([]);
  const handleClick = (e) => {
    const id = Date.now();
    setRipples((r) => [...r, { id, x: e.clientX, y: e.clientY }]);
    setTimeout(() => setRipples((r) => r.filter((rp) => rp.id !== id)), 900);
  };
  return (
    <div
      onClick={handleClick}
      style={{ position: "fixed", inset: 0, zIndex: 9999, pointerEvents: "none" }}
    >
      {ripples.map((rp) => (
        <motion.div
          key={rp.id}
          initial={{ scale: 0, opacity: 0.55, x: rp.x - 60, y: rp.y - 60 }}
          animate={{ scale: 5, opacity: 0 }}
          transition={{ duration: 0.85, ease: "easeOut" }}
          style={{
            position: "fixed",
            width: 120,
            height: 120,
            borderRadius: "50%",
            border: "1.5px solid rgba(56,189,248,0.55)",
            pointerEvents: "none",
          }}
        />
      ))}
    </div>
  );
}

/* ─── STAT COUNTER ──────────────────────────────────────────── */
function Counter({ to, suffix = "" }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        let start = 0;
        const step = () => {
          start += Math.ceil(to / 60);
          if (start >= to) { setVal(to); return; }
          setVal(start);
          requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      }
    }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [to]);
  return <span ref={ref}>{val}{suffix}</span>;
}

/* ─── WATER BLOB ─────────────────────────────────────────────── */
function WaterBlob({ size, x, y, color, duration, delay }) {
  return (
    <motion.div
      animate={{
        borderRadius: [
          "60% 40% 70% 30% / 50% 60% 40% 70%",
          "40% 60% 30% 70% / 70% 30% 60% 40%",
          "70% 30% 50% 50% / 30% 70% 50% 50%",
          "60% 40% 70% 30% / 50% 60% 40% 70%",
        ],
        scale: [1, 1.08, 0.96, 1],
      }}
      transition={{ duration, repeat: Infinity, delay, ease: "easeInOut" }}
      style={{
        position: "absolute",
        width: size,
        height: size,
        left: x,
        top: y,
        background: color,
        filter: "blur(60px)",
        opacity: 0.35,
        pointerEvents: "none",
      }}
    />
  );
}

/* ─── MAIN ───────────────────────────────────────────────────── */
export default function TapiclearLanding() {
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 600], [0, 120]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);

  const [activeService, setActiveService] = useState(null);

  const services = [
    {
      icon: "◈",
      title: "Sofás & Sillones",
      short: "Restauramos la vida de cada tejido.",
      detail:
        "Tratamiento profundo con equipos de extracción de última generación. Eliminamos manchas, ácaros y olores preservando la integridad de cada fibra. El resultado es un tapizado visualmente renovado, fresco y sanitizado.",
    },
    {
      icon: "◉",
      title: "Tapizados de Auto",
      short: "Interior renovado, sensación nueva.",
      detail:
        "Limpieza interior detallada: asientos, cielo raso, alfombras y paneles. Utilizamos productos específicos para cada material — cuero, tela, alcántara — con secado rápido y sin residuos.",
    },
    {
      icon: "◍",
      title: "Colchones & Sillas",
      short: "Higiene profunda donde más importa.",
      detail:
        "Desinfección de alta frecuencia para colchones y sillas de uso cotidiano. Eliminación de manchas orgánicas, polvo acumulado y microorganismos. Un descanso limpio, genuino y saludable.",
    },
  ];

  return (
    <>
      <WaterFilter />
      <RippleLayer />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --white: #ffffff;
          --ice: #f0f9ff;
          --mist: #e0f2fe;
          --sky: #bae6fd;
          --cyan: #38bdf8;
          --ocean: #0ea5e9;
          --deep: #0369a1;
          --navy: #0c4a6e;
          --ink: #0f172a;
          --font-display: 'Cormorant Garamond', Georgia, serif;
          --font-body: 'DM Sans', sans-serif;
        }

        html { scroll-behavior: smooth; }

        body {
          background: var(--white);
          color: var(--ink);
          font-family: var(--font-body);
          overflow-x: hidden;
        }

        ::selection { background: rgba(56,189,248,0.25); }

        .display { font-family: var(--font-display); }

        /* custom scrollbar */
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: var(--ice); }
        ::-webkit-scrollbar-thumb { background: var(--cyan); border-radius: 99px; }
      `}</style>

      <main style={{ background: "var(--white)", overflowX: "hidden" }}>

        {/* ── NAVBAR ────────────────────────────────────────── */}
        <motion.header
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: "fixed",
            top: 0,
            zIndex: 100,
            width: "100%",
            borderBottom: "1px solid rgba(186,230,253,0.4)",
            backdropFilter: "blur(24px)",
            background: "rgba(240,249,255,0.75)",
          }}
        >
          <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 2rem", display: "flex", alignItems: "center", justifyContent: "space-between", height: 72 }}>
            <div>
              <div className="display" style={{ fontSize: 26, fontWeight: 700, color: "var(--deep)", letterSpacing: "-0.02em" }}>
                Tapiclear
              </div>
              <div style={{ fontSize: 9, letterSpacing: "0.38em", color: "var(--ocean)", textTransform: "uppercase", marginTop: 2 }}>
                Limpieza Premium
              </div>
            </div>
            <nav style={{ display: "flex", gap: "2.5rem" }}>
              {["inicio", "servicios", "resultados", "contacto"].map((s) => (
                <a
                  key={s}
                  href={`#${s}`}
                  style={{
                    fontSize: 11,
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                    color: "var(--navy)",
                    textDecoration: "none",
                    fontWeight: 500,
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) => (e.target.style.color = "var(--ocean)")}
                  onMouseLeave={(e) => (e.target.style.color = "var(--navy)")}
                >
                  {s}
                </a>
              ))}
            </nav>
          </div>
        </motion.header>

        {/* ── HERO ──────────────────────────────────────────── */}
        <section
          id="inicio"
          style={{
            position: "relative",
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            overflow: "hidden",
            background: "linear-gradient(160deg, #f0f9ff 0%, #ffffff 45%, #e0f2fe 100%)",
          }}
        >
          <RainCanvas />

          {/* blobs */}
          <WaterBlob size={700} x="-12%" y="-10%" color="radial-gradient(circle, #bae6fd, #7dd3fc)" duration={12} delay={0} />
          <WaterBlob size={500} x="65%" y="40%" color="radial-gradient(circle, #e0f2fe, #bae6fd)" duration={16} delay={2} />
          <WaterBlob size={300} x="30%" y="60%" color="radial-gradient(circle, #7dd3fc, #38bdf8)" duration={10} delay={1} />

          <motion.div
            style={{ y: heroY, opacity: heroOpacity, position: "relative", zIndex: 2, maxWidth: 1400, margin: "0 auto", padding: "9rem 2rem 4rem", width: "100%" }}
          >
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "center" }}>

              {/* LEFT */}
              <div>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.2 }}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 10,
                    background: "rgba(255,255,255,0.7)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid rgba(186,230,253,0.6)",
                    borderRadius: 99,
                    padding: "10px 22px",
                    marginBottom: 32,
                    boxShadow: "0 8px 32px rgba(14,165,233,0.1)",
                  }}
                >
                  <motion.div
                    animate={{ scale: [1, 1.4, 1], opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--cyan)" }}
                  />
                  <span style={{ fontSize: 10, letterSpacing: "0.32em", textTransform: "uppercase", color: "var(--deep)", fontWeight: 600 }}>
                    Pureza · Frescura · Detalle
                  </span>
                </motion.div>

                <motion.h1
                  className="display"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.2, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  style={{ fontSize: "clamp(52px, 7vw, 96px)", fontWeight: 700, lineHeight: 0.9, letterSpacing: "-0.02em", color: "var(--ink)" }}
                >
                  Tapizados
                  <br />
                  <motion.span
                    animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                    transition={{ duration: 5, repeat: Infinity }}
                    style={{
                      display: "block",
                      background: "linear-gradient(90deg, #0ea5e9, #38bdf8, #0369a1, #38bdf8)",
                      backgroundSize: "300% 100%",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    impecables.
                  </motion.span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.55 }}
                  style={{ marginTop: 32, fontSize: "clamp(16px,1.3vw,20px)", color: "#334155", lineHeight: 1.7, fontWeight: 300, maxWidth: 520 }}
                >
                  Limpieza premium para sillones, colchones y vehículos.
                  Estética fresca, profunda y profesional.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.7 }}
                  style={{ display: "flex", gap: 16, marginTop: 44, flexWrap: "wrap" }}
                >
                  <motion.button
                    whileHover={{ scale: 1.04, boxShadow: "0 20px 50px rgba(14,165,233,0.4)" }}
                    whileTap={{ scale: 0.97 }}
                    style={{
                      background: "linear-gradient(135deg, var(--ocean), var(--deep))",
                      color: "#fff",
                      border: "none",
                      borderRadius: 99,
                      padding: "18px 36px",
                      fontSize: 11,
                      letterSpacing: "0.22em",
                      textTransform: "uppercase",
                      fontWeight: 700,
                      cursor: "pointer",
                      boxShadow: "0 12px 40px rgba(14,165,233,0.3)",
                    }}
                  >
                    Reservar servicio
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.04, background: "rgba(255,255,255,0.95)" }}
                    whileTap={{ scale: 0.97 }}
                    style={{
                      background: "rgba(255,255,255,0.65)",
                      backdropFilter: "blur(20px)",
                      color: "var(--deep)",
                      border: "1px solid rgba(186,230,253,0.7)",
                      borderRadius: 99,
                      padding: "18px 36px",
                      fontSize: 11,
                      letterSpacing: "0.22em",
                      textTransform: "uppercase",
                      fontWeight: 700,
                      cursor: "pointer",
                      boxShadow: "0 8px 30px rgba(14,165,233,0.1)",
                    }}
                  >
                    Ver resultados
                  </motion.button>
                </motion.div>

                {/* Stats */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  style={{ display: "flex", gap: 40, marginTop: 56, paddingTop: 40, borderTop: "1px solid rgba(186,230,253,0.5)" }}
                >
                  {[
                    { n: 800, s: "+", label: "Trabajos realizados" },
                    { n: 100, s: "%", label: "Satisfacción garantizada" },
                    { n: 6, s: "+", label: "Años de experiencia" },
                  ].map((st, i) => (
                    <div key={i}>
                      <div className="display" style={{ fontSize: 36, fontWeight: 700, color: "var(--ocean)", lineHeight: 1 }}>
                        <Counter to={st.n} suffix={st.s} />
                      </div>
                      <div style={{ fontSize: 11, color: "#64748b", marginTop: 6, letterSpacing: "0.05em" }}>{st.label}</div>
                    </div>
                  ))}
                </motion.div>
              </div>

              {/* RIGHT — hero visual */}
              <motion.div
                initial={{ opacity: 0, x: 60, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ duration: 1.4, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                style={{ position: "relative" }}
              >
                {/* water blob behind image */}
                <motion.div
                  animate={{ scale: [1, 1.06, 1], rotate: [0, 4, 0] }}
                  transition={{ duration: 8, repeat: Infinity }}
                  style={{
                    position: "absolute",
                    inset: "-8%",
                    background: "radial-gradient(circle at 40% 40%, #bae6fd, #7dd3fc, transparent 70%)",
                    borderRadius: "60% 40% 55% 45% / 45% 55% 45% 55%",
                    filter: "blur(32px)",
                    opacity: 0.6,
                    zIndex: 0,
                  }}
                />

                <div style={{ position: "relative", zIndex: 1, borderRadius: 40, overflow: "hidden", boxShadow: "0 40px 100px rgba(14,165,233,0.22), 0 0 0 1px rgba(255,255,255,0.7)" }}>
                  <img
                    src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=1600&auto=format&fit=crop"
                    style={{ width: "100%", height: 580, objectFit: "cover", display: "block" }}
                    alt="Sofá limpio"
                  />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(12,74,110,0.3), transparent 55%)" }} />

                  {/* water ripple overlay */}
                  <motion.div
                    animate={{ opacity: [0, 0.18, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "radial-gradient(ellipse at 50% 50%, rgba(186,230,253,0.4), transparent 70%)",
                      filter: "url(#water-blob)",
                    }}
                  />

                  {/* float card */}
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 1.2, duration: 0.8 }}
                    style={{
                      position: "absolute",
                      bottom: 24,
                      left: 24,
                      right: 24,
                      background: "rgba(255,255,255,0.35)",
                      backdropFilter: "blur(28px)",
                      border: "1px solid rgba(255,255,255,0.5)",
                      borderRadius: 24,
                      padding: "20px 24px",
                    }}
                  >
                    <div style={{ fontSize: 10, letterSpacing: "0.28em", textTransform: "uppercase", color: "var(--deep)", fontWeight: 600 }}>
                      Acabado Premium
                    </div>
                    <div className="display" style={{ fontSize: 24, fontWeight: 700, color: "var(--ink)", marginTop: 6 }}>
                      Frescura total.
                    </div>
                    <div style={{ fontSize: 13, color: "#334155", marginTop: 4 }}>
                      Restauramos textura, color y limpieza profunda.
                    </div>
                  </motion.div>
                </div>
              </motion.div>

            </div>
          </motion.div>

          {/* wave bottom */}
          <div style={{ position: "absolute", bottom: 0, left: 0, width: "100%", zIndex: 3, lineHeight: 0 }}>
            <svg viewBox="0 0 1440 90" xmlns="http://www.w3.org/2000/svg" style={{ display: "block", width: "100%" }}>
              <path d="M0,40 C240,90 480,0 720,45 C960,90 1200,10 1440,50 L1440,90 L0,90 Z" fill="white" />
            </svg>
          </div>
        </section>

        {/* ── WATER DIVIDER ─────────────────────────────────── */}
        <section style={{ position: "relative", height: 220, background: "white", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {/* animated water surface */}
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={i}
              animate={{ scaleX: [1, 1.04, 0.97, 1], y: [0, -6, 4, 0] }}
              transition={{ duration: 5 + i * 1.2, repeat: Infinity, delay: i * 0.6, ease: "easeInOut" }}
              style={{
                position: "absolute",
                left: "-5%",
                width: "110%",
                height: 80,
                top: 40 + i * 26,
                borderRadius: "50%",
                background: `rgba(186,230,253,${0.12 - i * 0.02})`,
                border: `1px solid rgba(125,211,252,${0.25 - i * 0.04})`,
                filter: "blur(2px)",
              }}
            />
          ))}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
            className="display"
            style={{ position: "relative", zIndex: 2, fontSize: "clamp(18px,2vw,26px)", fontStyle: "italic", color: "var(--deep)", fontWeight: 300, letterSpacing: "0.04em", textAlign: "center" }}
          >
            "Cada fibra merece cuidado. Cada espacio merece frescura."
          </motion.p>
        </section>

        {/* ── SERVICES ──────────────────────────────────────── */}
        <section
          id="servicios"
          style={{ position: "relative", padding: "8rem 2rem", background: "linear-gradient(180deg, white 0%, #f0f9ff 100%)", overflow: "hidden" }}
        >
          <WaterBlob size={600} x="60%" y="-5%" color="radial-gradient(circle, #e0f2fe, transparent)" duration={14} delay={0} />

          <div style={{ maxWidth: 1400, margin: "0 auto" }}>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.9 }}
              style={{ marginBottom: "4rem" }}
            >
              <div style={{ fontSize: 10, letterSpacing: "0.38em", textTransform: "uppercase", color: "var(--ocean)", fontWeight: 600, marginBottom: 16 }}>
                Servicios
              </div>
              <h2 className="display" style={{ fontSize: "clamp(36px,5vw,72px)", fontWeight: 700, lineHeight: 1, color: "var(--ink)", maxWidth: 680 }}>
                Una nueva vida para cada superficie.
              </h2>
            </motion.div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24 }}>
              {services.map((svc, i) => {
                const isActive = activeService === i;
                return (
                  <motion.div
                    key={i}
                    layout
                    onClick={() => setActiveService(isActive ? null : i)}
                    initial={{ opacity: 0, y: 60 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.8, delay: i * 0.15 }}
                    whileHover={!isActive ? { y: -8, boxShadow: "0 30px 80px rgba(14,165,233,0.18)" } : {}}
                    style={{
                      background: isActive
                        ? "linear-gradient(135deg, rgba(14,165,233,0.08), rgba(186,230,253,0.12))"
                        : "rgba(255,255,255,0.7)",
                      backdropFilter: "blur(24px)",
                      border: isActive ? "1px solid rgba(56,189,248,0.45)" : "1px solid rgba(186,230,253,0.5)",
                      borderRadius: 36,
                      padding: "2.5rem",
                      cursor: "pointer",
                      transition: "border 0.3s, background 0.3s",
                      boxShadow: isActive
                        ? "0 20px 60px rgba(14,165,233,0.15), inset 0 0 0 1px rgba(255,255,255,0.5)"
                        : "0 8px 40px rgba(14,165,233,0.07)",
                      overflow: "hidden",
                      position: "relative",
                    }}
                  >
                    {/* shimmer on active */}
                    {isActive && (
                      <motion.div
                        animate={{ x: ["-100%", "200%"] }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                        style={{
                          position: "absolute",
                          inset: 0,
                          width: "40%",
                          background: "linear-gradient(90deg, transparent, rgba(186,230,253,0.25), transparent)",
                          pointerEvents: "none",
                        }}
                      />
                    )}

                    <div style={{ fontSize: 28, color: "var(--ocean)", marginBottom: 20 }}>{svc.icon}</div>
                    <h3 className="display" style={{ fontSize: 28, fontWeight: 700, color: "var(--ink)", marginBottom: 12, lineHeight: 1.1 }}>
                      {svc.title}
                    </h3>
                    <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.7, fontWeight: 300 }}>
                      {svc.short}
                    </p>

                    <AnimatePresence>
                      {isActive && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.4 }}
                          style={{ overflow: "hidden" }}
                        >
                          <p style={{ fontSize: 14, color: "#334155", lineHeight: 1.8, fontWeight: 300, marginTop: 20, paddingTop: 20, borderTop: "1px solid rgba(186,230,253,0.5)" }}>
                            {svc.detail}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <motion.div
                      animate={{ rotate: isActive ? 45 : 0 }}
                      transition={{ duration: 0.3 }}
                      style={{ position: "absolute", top: 28, right: 28, fontSize: 18, color: "var(--cyan)", opacity: 0.7 }}
                    >
                      +
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── WATER PHYSICS SECTION ─────────────────────────── */}
        <section style={{ position: "relative", padding: "8rem 2rem", background: "var(--navy)", overflow: "hidden" }}>
          {/* animated water surface lines */}
          {[0,1,2,3,4,5].map((i) => (
            <motion.div
              key={i}
              animate={{ scaleX: [0.95, 1.05, 0.98, 1], y: [0, -10, 6, 0], opacity: [0.15, 0.35, 0.15] }}
              transition={{ duration: 6 + i, repeat: Infinity, delay: i * 0.9, ease: "easeInOut" }}
              style={{
                position: "absolute",
                left: "-5%",
                width: "110%",
                height: 60 + i * 8,
                top: `${8 + i * 14}%`,
                borderRadius: "50%",
                border: "1px solid rgba(125,211,252,0.2)",
                pointerEvents: "none",
              }}
            />
          ))}
          <RainCanvas />

          <div style={{ position: "relative", zIndex: 2, maxWidth: 1400, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6rem", alignItems: "center" }}>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 1 }}
            >
              <div style={{ fontSize: 10, letterSpacing: "0.38em", textTransform: "uppercase", color: "var(--cyan)", fontWeight: 600, marginBottom: 16 }}>
                Nuestro método
              </div>
              <h2 className="display" style={{ fontSize: "clamp(36px,4.5vw,64px)", fontWeight: 700, lineHeight: 1.05, color: "white", marginBottom: 28 }}>
                Limpieza que penetra hasta la última fibra.
              </h2>
              <p style={{ fontSize: 16, color: "rgba(186,230,253,0.8)", lineHeight: 1.8, fontWeight: 300, marginBottom: 40 }}>
                Usamos tecnología de extracción por vapor y agua presurizada de baja humedad, penetrando cada capa del tapizado sin dañar su estructura. El resultado es visible, inmediato y duradero.
              </p>
              {[
                "Extracción profunda por vapor controlado",
                "Productos biodegradables y sin residuos",
                "Secado rápido en menos de 2 horas",
                "Certificación de higiene en cada trabajo",
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12, duration: 0.6 }}
                  style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}
                >
                  <motion.div
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.5 }}
                    style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--cyan)", flexShrink: 0 }}
                  />
                  <span style={{ fontSize: 14, color: "rgba(224,242,254,0.9)", fontWeight: 300 }}>{item}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* water drop visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 1.2 }}
              style={{ display: "flex", alignItems: "center", justifyContent: "center", position: "relative", height: 420 }}
            >
              {/* concentric rings */}
              {[0,1,2,3].map((r) => (
                <motion.div
                  key={r}
                  animate={{ scale: [1, 1.18, 1], opacity: [0.12, 0.28, 0.12] }}
                  transition={{ duration: 3 + r * 0.8, repeat: Infinity, delay: r * 0.7 }}
                  style={{
                    position: "absolute",
                    width: 120 + r * 80,
                    height: 120 + r * 80,
                    borderRadius: "50%",
                    border: "1px solid rgba(56,189,248,0.4)",
                  }}
                />
              ))}
              {/* center drop */}
              <motion.div
                animate={{ y: [0, -12, 0], scale: [1, 1.04, 1] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                style={{
                  position: "relative",
                  zIndex: 2,
                  width: 110,
                  height: 130,
                  background: "linear-gradient(160deg, rgba(125,211,252,0.9), rgba(14,165,233,0.8))",
                  borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
                  boxShadow: "0 0 60px rgba(56,189,248,0.5), inset 0 -8px 20px rgba(255,255,255,0.15)",
                  backdropFilter: "blur(10px)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <motion.div
                  animate={{ opacity: [0.4, 0.9, 0.4] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{ width: 30, height: 38, background: "rgba(255,255,255,0.25)", borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%" }}
                />
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ── RESULTS ───────────────────────────────────────── */}
        <section
          id="resultados"
          style={{ position: "relative", padding: "8rem 2rem", background: "white", overflow: "hidden" }}
        >
          <WaterBlob size={500} x="-8%" y="20%" color="radial-gradient(circle, #e0f2fe, transparent)" duration={12} delay={1} />

          <div style={{ maxWidth: 1400, margin: "0 auto" }}>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9 }}
              style={{ textAlign: "center", marginBottom: "4rem" }}
            >
              <div style={{ fontSize: 10, letterSpacing: "0.38em", textTransform: "uppercase", color: "var(--ocean)", fontWeight: 600, marginBottom: 16 }}>
                Resultados
              </div>
              <h2 className="display" style={{ fontSize: "clamp(36px,5vw,72px)", fontWeight: 700, color: "var(--ink)" }}>
                El cambio se ve. Y se siente.
              </h2>
            </motion.div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
              {[
                { img: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=1600&auto=format&fit=crop", label: "Sillón living" },
                { img: "https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=1600&auto=format&fit=crop", label: "Tapizado auto" },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 60 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.9, delay: i * 0.2 }}
                  style={{ position: "relative", borderRadius: 40, overflow: "hidden", boxShadow: "0 30px 80px rgba(14,165,233,0.14)" }}
                >
                  <motion.img
                    whileHover={{ scale: 1.04 }}
                    transition={{ duration: 0.6 }}
                    src={item.img}
                    style={{ width: "100%", height: 540, objectFit: "cover", display: "block" }}
                    alt={item.label}
                  />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(12,74,110,0.6) 0%, transparent 55%)" }} />

                  {/* water sweep on hover */}
                  <motion.div
                    initial={{ x: "-100%", opacity: 0 }}
                    whileHover={{ x: "100%", opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "linear-gradient(90deg, transparent, rgba(186,230,253,0.2), transparent)",
                      pointerEvents: "none",
                    }}
                  />

                  <div style={{ position: "absolute", bottom: 28, left: 28, right: 28, display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
                    <div>
                      <div style={{ fontSize: 10, letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(186,230,253,0.9)", fontWeight: 600 }}>Antes & Después</div>
                      <div className="display" style={{ fontSize: 28, fontWeight: 700, color: "white", marginTop: 6 }}>{item.label}</div>
                    </div>
                    <div style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.25)", borderRadius: 99, padding: "12px 22px", fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: "white", fontWeight: 600, cursor: "pointer" }}>
                      Ver detalle
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ───────────────────────────────────────────── */}
        <section style={{ position: "relative", padding: "9rem 2rem", background: "linear-gradient(135deg, #0c4a6e, #0369a1, #0ea5e9)", overflow: "hidden" }}>
          <RainCanvas />
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            style={{ position: "absolute", width: 900, height: 900, borderRadius: "50%", border: "1px solid rgba(186,230,253,0.08)", top: "50%", left: "50%", transform: "translate(-50%,-50%)", pointerEvents: "none" }}
          />
          <motion.div
            animate={{ rotate: [360, 0] }}
            transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
            style={{ position: "absolute", width: 600, height: 600, borderRadius: "50%", border: "1px solid rgba(186,230,253,0.12)", top: "50%", left: "50%", transform: "translate(-50%,-50%)", pointerEvents: "none" }}
          />

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 1 }}
            style={{ position: "relative", zIndex: 2, maxWidth: 800, margin: "0 auto", textAlign: "center" }}
          >
            <div style={{ fontSize: 10, letterSpacing: "0.38em", textTransform: "uppercase", color: "rgba(186,230,253,0.8)", fontWeight: 600, marginBottom: 20 }}>
              Tapiclear
            </div>
            <h2 className="display" style={{ fontSize: "clamp(44px,6vw,88px)", fontWeight: 700, color: "white", lineHeight: 0.95, marginBottom: 28 }}>
              Limpieza que se ve y se siente.
            </h2>
            <p style={{ fontSize: 18, color: "rgba(186,230,253,0.85)", lineHeight: 1.7, fontWeight: 300, marginBottom: 48 }}>
              Restauramos tus espacios con un acabado visualmente impecable y profesional.
            </p>
            <motion.button
              whileHover={{ scale: 1.06, boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}
              whileTap={{ scale: 0.97 }}
              style={{
                background: "white",
                color: "var(--deep)",
                border: "none",
                borderRadius: 99,
                padding: "20px 48px",
                fontSize: 11,
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                fontWeight: 800,
                cursor: "pointer",
                boxShadow: "0 12px 50px rgba(0,0,0,0.2)",
              }}
            >
              Pedir presupuesto
            </motion.button>
          </motion.div>
        </section>

        {/* ── FOOTER ────────────────────────────────────────── */}
        <footer
          id="contacto"
          style={{ background: "#f0f9ff", borderTop: "1px solid rgba(186,230,253,0.5)", padding: "4rem 2rem" }}
        >
          <div style={{ maxWidth: 1400, margin: "0 auto", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "3rem", flexWrap: "wrap" }}>
            <div>
              <div className="display" style={{ fontSize: 40, fontWeight: 700, color: "var(--deep)" }}>Tapiclear</div>
              <p style={{ marginTop: 16, maxWidth: 380, color: "#475569", lineHeight: 1.7, fontWeight: 300, fontSize: 15 }}>
                Limpieza premium de tapizados con estética moderna, fresca y profesional.
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {["Instagram", "WhatsApp", "Buenos Aires · Argentina"].map((l) => (
                <div key={l} style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "#64748b", fontWeight: 500 }}>{l}</div>
              ))}
            </div>
          </div>
        </footer>

      </main>
    </>
  );
}
