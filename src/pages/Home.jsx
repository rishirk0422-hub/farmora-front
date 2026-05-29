import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useTheme } from "../hooks/useTheme";
import { useEffect, useState } from "react";

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Inter:wght@400;500;600&display=swap');`;

const tokens = (dark) => ({
  bg:         dark ? "#080f1a" : "#f0fdf4",
  card:       dark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.85)",
  cardBorder: dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)",
  text:       dark ? "#e2e8f0" : "#0f1a10",
  muted:      dark ? "rgba(255,255,255,0.38)" : "rgba(0,0,0,0.45)",
  subBg:      dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)",
  green:  "#16c784",
  blue:   "#3d9cf5",
  amber:  "#f5a623",
  purple: "#a78bfa",
  pink:   "#f472b6",
});

// ── Animated counter ──────────────────────────────────────────────────────────
const Counter = ({ to, suffix = "" }) => {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let raf;
    const start = performance.now();
    const dur = 1400;
    const tick = (now) => {
      const p = Math.min((now - start) / dur, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setVal(Math.floor(ease * to));
      if (p < 1) raf = requestAnimationFrame(tick);
      else setVal(to);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to]);
  return <>{val.toLocaleString("en-IN")}{suffix}</>;
};

// ── Feature card ──────────────────────────────────────────────────────────────
const FeatureCard = ({ icon, label, delay, T }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    whileHover={{ scale: 1.04, y: -4 }}
    style={{
      background: T.card,
      border: `1px solid ${T.cardBorder}`,
      borderRadius: 14,
      padding: "18px 16px",
      textAlign: "center",
      boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
      cursor: "default",
    }}
  >
    <div style={{ fontSize: "1.4rem", marginBottom: 8 }}>{icon}</div>
    <p style={{
      fontFamily: "'Inter', sans-serif",
      fontSize: "0.82rem",
      fontWeight: 600,
      color: T.text,
    }}>{label}</p>
  </motion.div>
);

// ── Role card ─────────────────────────────────────────────────────────────────
const RoleCard = ({ icon, title, items, accent, delay, T }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    style={{
      background: T.card,
      border: `1px solid ${T.cardBorder}`,
      borderRadius: 16,
      padding: "24px 22px",
      boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
      position: "relative",
      overflow: "hidden",
    }}
  >
    <div style={{
      position: "absolute", top: -20, right: -20,
      width: 90, height: 90, borderRadius: "50%",
      background: accent, opacity: 0.1, filter: "blur(24px)",
    }} />
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
      <div style={{
        width: 40, height: 40, borderRadius: 10,
        background: accent + "1a",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "1.2rem",
      }}>{icon}</div>
      <h3 style={{
        fontFamily: "'Syne', sans-serif",
        fontWeight: 800, fontSize: "1rem",
        color: T.text, margin: 0,
      }}>{title}</h3>
    </div>
    <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
      {items.map((item, i) => (
        <li key={i} style={{
          display: "flex", alignItems: "center", gap: 8,
          fontSize: "0.82rem", color: T.muted,
        }}>
          <span style={{ color: accent, fontSize: "0.65rem" }}>◆</span>
          {item}
        </li>
      ))}
    </ul>
  </motion.div>
);

// ── Stat block ────────────────────────────────────────────────────────────────
const StatBlock = ({ value, to, suffix, label, accent, delay, T }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.5 }}
    style={{
      background: T.card,
      border: `1px solid ${T.cardBorder}`,
      borderRadius: 14,
      padding: "22px 16px",
      textAlign: "center",
      boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
    }}
  >
    <p style={{
      fontFamily: "'Syne', sans-serif",
      fontSize: "1.9rem", fontWeight: 800,
      color: accent, margin: 0, lineHeight: 1,
    }}>
      <Counter to={to} suffix={suffix} />
    </p>
    <p style={{ fontSize: "0.75rem", color: T.muted, marginTop: 6 }}>{label}</p>
  </motion.div>
);

// ── Section label — same as dashboard ────────────────────────────────────────
const SectionLabel = ({ children, T }) => (
  <p style={{
    color: T.muted,
    fontSize: "0.65rem",
    letterSpacing: "0.15em",
    textTransform: "uppercase",
    fontWeight: 700,
    marginBottom: 16,
    marginTop: 48,
  }}>
    {children}
  </p>
);

// ── CTA Button ────────────────────────────────────────────────────────────────
const CTABtn = ({ to, label, primary, accent, T }) => (
  <Link
    to={to}
    style={{
      display: "inline-flex",
      alignItems: "center",
      padding: "12px 26px",
      borderRadius: 12,
      fontFamily: "'Syne', sans-serif",
      fontWeight: 800,
      fontSize: "0.88rem",
      letterSpacing: "0.04em",
      textDecoration: "none",
      transition: "all 0.2s",
      ...(primary
        ? {
            background: `linear-gradient(135deg, ${accent}, #14a368)`,
            color: "#fff",
            boxShadow: `0 4px 20px ${accent}40`,
            border: "none",
          }
        : {
            background: "transparent",
            color: accent,
            border: `1px solid ${accent}44`,
          }),
    }}
  >
    {label}
  </Link>
);

// ── MAIN ──────────────────────────────────────────────────────────────────────
const Home = () => {
  const { dark } = useTheme();
  const T = tokens(dark);

  const features = [
    { icon: "🚫", label: "No Middlemen" },
    { icon: "⚖️", label: "Fair Pricing" },
    { icon: "⚡", label: "Real-Time Orders" },
    { icon: "🔒", label: "Secure Platform" },
    { icon: "🌾", label: "Fresh Produce" },
    { icon: "📊", label: "Smart Dashboard" },
  ];

  const stats = [
    { to: 1000, suffix: "+", label: "Farmers", accent: T.green },
    { to: 5000, suffix: "+", label: "Customers", accent: T.blue },
    { to: 20000, suffix: "+", label: "Orders", accent: T.amber },
    { to: 50, suffix: "+", label: "Cities", accent: T.purple },
  ];

  return (
    <div style={{
      minHeight: "100vh",
      background: T.bg,
      fontFamily: "'Inter', sans-serif",
      color: T.text,
      transition: "background 0.3s, color 0.3s",
    }}>
      <style>{FONTS}</style>

      {/* Background blobs */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        <div style={{
          position: "absolute", top: 0, left: "15%",
          width: 500, height: 500, borderRadius: "50%",
          background: `radial-gradient(circle, ${T.green}${dark ? "12" : "18"} 0%, transparent 65%)`,
        }} />
        <div style={{
          position: "absolute", bottom: "10%", right: "5%",
          width: 400, height: 400, borderRadius: "50%",
          background: `radial-gradient(circle, ${T.blue}${dark ? "10" : "14"} 0%, transparent 65%)`,
        }} />
      </div>

      <div style={{
        position: "relative", zIndex: 1,
        maxWidth: 1100, margin: "0 auto",
        padding: "96px 24px 80px",
      }}>

        {/* ── Hero ── */}
        <section style={{ textAlign: "center", marginBottom: 0 }}>
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              display: "inline-flex", alignItems: "center", gap: 10,
              background: T.green + "15",
              border: `1px solid ${T.green}30`,
              borderRadius: 50, padding: "7px 18px", marginBottom: 24,
            }}
          >
            <div style={{
              width: 7, height: 7, borderRadius: "50%",
              background: T.green, boxShadow: `0 0 8px ${T.green}`,
            }} />
            <span style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 800, fontSize: "0.75rem",
              color: T.green, letterSpacing: "0.1em",
            }}>
              FARMORA MARKETPLACE
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: "clamp(2.4rem, 7vw, 4.2rem)",
              fontWeight: 800,
              lineHeight: 1.05,
              margin: "0 0 20px",
              color: T.text,
            }}
          >
            Farm Fresh Products
            <br />
            <span style={{
              background: `linear-gradient(90deg, ${T.green}, #34d399)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>
              Directly From Farmers 🌱
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            style={{
              maxWidth: 520, margin: "0 auto 36px",
              fontSize: "0.95rem", lineHeight: 1.75,
              color: T.muted,
            }}
          >
            Farmora connects farmers and consumers directly — eliminating middlemen,
            ensuring fair pricing, and delivering fresh produce to your door.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}
          >
            <CTABtn to="/products" label="Explore Products" primary accent={T.green} T={T} />
            <CTABtn to="/signup" label="Join Now →" accent={T.green} T={T} />
          </motion.div>
        </section>

        {/* animated divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.9, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{
            height: 1,
            background: `linear-gradient(90deg, ${T.green}55, transparent)`,
            transformOrigin: "left",
            margin: "56px 0 0",
          }}
        />

        {/* ── Why Farmora ── */}
        <SectionLabel T={T}>Why Farmora</SectionLabel>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
          gap: 12,
        }}>
          {features.map((f, i) => (
            <FeatureCard key={f.label} {...f} delay={0.05 * i} T={T} />
          ))}
        </div>

        {/* ── For Farmers & Buyers ── */}
        <SectionLabel T={T}>Who It's For</SectionLabel>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 16,
        }}>
          <RoleCard
            icon="👨‍🌾"
            title="For Farmers"
            items={["Sell directly to buyers", "Get better profit margins", "Manage products easily"]}
            accent={T.green}
            delay={0}
            T={T}
          />
          <RoleCard
            icon="🛒"
            title="For Buyers"
            items={["Buy fresh products", "Track orders easily", "Support local farmers"]}
            accent={T.blue}
            delay={0.08}
            T={T}
          />
        </div>

        {/* ── Stats ── */}
        <SectionLabel T={T}>Trusted By Thousands</SectionLabel>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 14,
        }}>
          {stats.map((s, i) => (
            <StatBlock key={s.label} {...s} delay={i * 0.07} T={T} />
          ))}
        </div>

        {/* ── CTA ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{
            marginTop: 56,
            background: T.card,
            border: `1px solid ${T.cardBorder}`,
            borderRadius: 20,
            padding: "40px 32px",
            textAlign: "center",
            boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div style={{
            position: "absolute", top: -40, left: "30%",
            width: 200, height: 200, borderRadius: "50%",
            background: T.green, opacity: 0.07, filter: "blur(48px)",
          }} />
          <p style={{
            color: T.muted, fontSize: "0.65rem",
            letterSpacing: "0.15em", textTransform: "uppercase",
            fontWeight: 700, marginBottom: 12,
          }}>
            Get Started
          </p>
          <h2 style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: "clamp(1.5rem, 4vw, 2.2rem)",
            fontWeight: 800, margin: "0 0 12px",
            color: T.text,
          }}>
            Start Your Journey Today 🚀
          </h2>
          <p style={{ color: T.muted, fontSize: "0.85rem", marginBottom: 28 }}>
            Join and be part of the agricultural revolution.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
            <CTABtn to="/signup" label="Get Started" primary accent={T.green} T={T} />
            <CTABtn to="/products" label="Browse Products" accent={T.blue} T={T} />
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          style={{
            textAlign: "center", color: T.muted,
            fontSize: "0.68rem", marginTop: 56,
            letterSpacing: "0.1em", opacity: 0.4,
          }}
        >
          FARMORA · {new Date().getFullYear()} · Connecting Farmers to Markets
        </motion.p>
      </div>
    </div>
  );
};

export default Home;
