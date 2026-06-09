import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useTheme } from "../hooks/useTheme";

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Inter:wght@400;500;600&display=swap');`;

const tokens = (dark) => ({
  bg:         dark ? "#080f1a" : "#f0fdf4",
  card:       dark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.85)",
  cardBorder: dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)",
  text:       dark ? "#e2e8f0" : "#0f1a10",
  muted:      dark ? "rgba(255,255,255,0.38)" : "rgba(0,0,0,0.45)",
  green:  "#16c784",
  blue:   "#3d9cf5",
  amber:  "#f5a623",
  purple: "#a78bfa",
  pink:   "#f472b6",
});

// ── Section Label — same as dashboard ────────────────────────────────────────
const SectionLabel = ({ children, T }) => (
  <p style={{
    color: T.muted,
    fontSize: "0.65rem",
    letterSpacing: "0.15em",
    textTransform: "uppercase",
    fontWeight: 700,
    marginBottom: 16,
    marginTop: 52,
  }}>
    {children}
  </p>
);

// ── Info card (Mission / Vision / Problem / Solution) ─────────────────────────
const InfoCard = ({ icon, title, accent, children, delay, T }) => (
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
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
      <div style={{
        width: 38, height: 38, borderRadius: 10,
        background: accent + "1a",
        display: "flex", alignItems: "center",
        justifyContent: "center", fontSize: "1.1rem",
        flexShrink: 0,
      }}>{icon}</div>
      <h3 style={{
        fontFamily: "'Syne', sans-serif",
        fontWeight: 800, fontSize: "1rem",
        color: T.text, margin: 0,
      }}>{title}</h3>
    </div>
    {children}
  </motion.div>
);

// ── List inside info card ─────────────────────────────────────────────────────
const CardList = ({ items, accent, T }) => (
  <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
    {items.map((item, i) => (
      <li key={i} style={{
        display: "flex", alignItems: "flex-start", gap: 8,
        fontSize: "0.82rem", color: T.muted, lineHeight: 1.5,
      }}>
        <span style={{ color: accent, marginTop: 2, fontSize: "0.6rem", flexShrink: 0 }}>◆</span>
        {item}
      </li>
    ))}
  </ul>
);

// ── Feature pill ──────────────────────────────────────────────────────────────
const FeaturePill = ({ label, accent, delay, T }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.92 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.4 }}
    whileHover={{ scale: 1.04, y: -3 }}
    style={{
      background: T.card,
      border: `1px solid ${accent}28`,
      borderRadius: 12,
      padding: "14px 16px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
    }}
  >
    <p style={{
      fontFamily: "'Inter', sans-serif",
      fontSize: "0.82rem",
      fontWeight: 600,
      color: T.text,
      margin: 0,
      textAlign: "center",
    }}>{label}</p>
  </motion.div>
);

// ── CTA Button ────────────────────────────────────────────────────────────────
const CTABtn = ({ to, label, primary, accent }) => (
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
const About = () => {
  const { dark } = useTheme();
  const T = tokens(dark);

  const features = [
    "Direct Marketplace",
    "Real-Time Notifications",
    "Secure Payments",
    "Advanced Dashboard",
    "Location-Based Filtering",
    "Transparent Pricing",
  ];

  const accentCycle = [T.green, T.blue, T.amber, T.purple, T.pink, T.green];

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
        <section style={{ textAlign: "center" }}>
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
            }}>OUR STORY</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: "clamp(2rem, 6vw, 3.6rem)",
              fontWeight: 800,
              lineHeight: 1.05,
              margin: "0 0 18px",
              color: T.text,
            }}
          >
            Connecting Farmers
            <br />
            <span style={{
              background: `linear-gradient(90deg, ${T.green}, #34d399)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>
              to the Future 🌱
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            style={{
              maxWidth: 560, margin: "0 auto",
              fontSize: "0.92rem", lineHeight: 1.75,
              color: T.muted,
            }}
          >
            Farmora is redefining how agricultural products reach consumers —
            eliminating middlemen, ensuring fair prices, and building a
            transparent ecosystem for everyone.
          </motion.p>
        </section>

        {/* animated divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.9, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{
            height: 1,
            background: `linear-gradient(90deg, ${T.green}55, transparent)`,
            transformOrigin: "left",
            margin: "48px 0 0",
          }}
        />

        {/* ── Mission & Vision ── */}
        <SectionLabel T={T}>Foundation</SectionLabel>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 16,
        }}>
          <InfoCard icon="🎯" title="Our Mission" accent={T.green} delay={0} T={T}>
            <p style={{ fontSize: "0.84rem", color: T.muted, margin: 0, lineHeight: 1.7 }}>
              To empower farmers by giving them direct access to consumers,
              increasing their profit margins while ensuring fresh and affordable
              produce for buyers.
            </p>
          </InfoCard>
          <InfoCard icon="🌍" title="Our Vision" accent={T.blue} delay={0.08} T={T}>
            <p style={{ fontSize: "0.84rem", color: T.muted, margin: 0, lineHeight: 1.7 }}>
              To build India's largest farmer-to-consumer digital marketplace,
              driven by trust, transparency, and technology.
            </p>
          </InfoCard>
        </div>

        {/* ── Problem & Solution ── */}
        <SectionLabel T={T}>The Problem We Solve</SectionLabel>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 16,
        }}>
          <InfoCard icon="⚠️" title="The Problem" accent={T.amber} delay={0} T={T}>
            <CardList
              items={[
                "Farmers earn very low profit margins",
                "Multiple middlemen increase costs",
                "Lack of transparency in pricing",
                "Consumers get overpriced produce",
              ]}
              accent={T.amber}
              T={T}
            />
          </InfoCard>
          <InfoCard icon="✅" title="Our Solution" accent={T.green} delay={0.08} T={T}>
            <CardList
              items={[
                "Direct farmer-to-buyer connection",
                "Real-time marketplace",
                "Fair pricing system",
                "Digital empowerment for farmers",
              ]}
              accent={T.green}
              T={T}
            />
          </InfoCard>
        </div>

        {/* ── Features ── */}
        <SectionLabel T={T}>What Makes Farmora Powerful ⚡</SectionLabel>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
          gap: 12,
        }}>
          {features.map((f, i) => (
            <FeaturePill key={f} label={f} accent={accentCycle[i]} delay={i * 0.06} T={T} />
          ))}
        </div>

        {/* ── For Farmers & Buyers ── */}
        <SectionLabel T={T}>Built For Everyone</SectionLabel>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 16,
        }}>
          <InfoCard icon="👨‍🌾" title="For Farmers" accent={T.purple} delay={0} T={T}>
            <CardList
              items={["List products easily", "Get better pricing", "Manage orders digitally"]}
              accent={T.purple}
              T={T}
            />
          </InfoCard>
          <InfoCard icon="🛒" title="For Buyers" accent={T.pink} delay={0.08} T={T}>
            <CardList
              items={["Buy fresh directly", "Track orders", "Support local farmers"]}
              accent={T.pink}
              T={T}
            />
          </InfoCard>
        </div>

        {/* ── CTA ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{
            marginTop: 52,
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
            Ready to Begin?
          </p>
          <h2 style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: "clamp(1.4rem, 4vw, 2rem)",
            fontWeight: 800, margin: "0 0 10px",
            color: T.text,
          }}>
            Join the Agricultural Revolution 🌱
          </h2>
          <p style={{ color: T.muted, fontSize: "0.84rem", marginBottom: 28 }}>
            Be part of a smarter, fairer, and more transparent food system.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
            <CTABtn to="/signup" label="Get Started" primary accent={T.green} />
            <CTABtn to="/products" label="Explore Products" accent={T.blue} />
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

export default About;
