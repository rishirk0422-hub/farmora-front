import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../hooks/useTheme";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../services/api";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Inter:wght@400;500;600&display=swap');`;

// ── Theme tokens ──────────────────────────────────────────────────────────────
const tokens = (dark) => ({
  bg:        dark ? "#080f1a"                    : "#f0fdf4",
  card:      dark ? "rgba(255,255,255,0.04)"     : "rgba(255,255,255,0.85)",
  cardBorder:dark ? "rgba(255,255,255,0.07)"     : "rgba(0,0,0,0.08)",
  text:      dark ? "#e2e8f0"                    : "#0f1a10",
  muted:     dark ? "rgba(255,255,255,0.38)"     : "rgba(0,0,0,0.45)",
  subBg:     dark ? "rgba(255,255,255,0.05)"     : "rgba(0,0,0,0.04)",
  gridLine:  dark ? "rgba(255,255,255,0.05)"     : "rgba(0,0,0,0.06)",
  tipBg:     dark ? "#0f1d2e"                    : "#ffffff",
  tipBorder: dark ? "rgba(255,255,255,0.1)"      : "rgba(0,0,0,0.1)",
  green:  "#16c784",
  blue:   "#3d9cf5",
  amber:  "#f5a623",
  purple: "#a78bfa",
  pink:   "#f472b6",
});

// ── Animated counter ──────────────────────────────────────────────────────────
const Counter = ({ to, prefix = "", suffix = "" }) => {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!to) return;
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
  return <>{prefix}{val.toLocaleString("en-IN")}{suffix}</>;
};

// ── Custom tooltip ────────────────────────────────────────────────────────────
const ChartTip = ({ active, payload, label, T }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: T.tipBg, border: `1px solid ${T.tipBorder}`, borderRadius: 10, padding: "10px 14px", fontSize: 12, color: T.text }}>
      <p style={{ color: T.muted, marginBottom: 4 }}>{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color, fontWeight: 600 }}>
          {p.name}: ₹{p.value?.toLocaleString("en-IN")}
        </p>
      ))}
    </div>
  );
};

// ── Stat card ─────────────────────────────────────────────────────────────────
const Stat = ({ icon, label, value, prefix = "", suffix = "", accent, delay, sub, T }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    style={{ background: T.card, border: `1px solid ${T.cardBorder}`, borderRadius: 16, padding: "20px 18px", position: "relative", overflow: "hidden",
      boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
  >
    <div style={{ position: "absolute", top: -24, right: -24, width: 80, height: 80, borderRadius: "50%", background: accent, opacity: 0.15, filter: "blur(24px)" }} />
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
      <span style={{ fontSize: "1.3rem" }}>{icon}</span>
      <span style={{ fontSize: "0.65rem", color: accent, background: accent + "18", padding: "3px 8px", borderRadius: 20, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>{label}</span>
    </div>
    <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.75rem", fontWeight: 800, color: T.text, lineHeight: 1 }}>
      <Counter to={value} prefix={prefix} suffix={suffix} />
    </div>
    {sub && <div style={{ fontSize: "0.72rem", color: T.muted, marginTop: 5 }}>{sub}</div>}
  </motion.div>
);

// ── Section label ─────────────────────────────────────────────────────────────
const SectionLabel = ({ children, delay = 0, T }) => (
  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay }}
    style={{ color: T.muted, fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 700, marginBottom: 12, marginTop: 32 }}>
    {children}
  </motion.p>
);

// ── Chart card ────────────────────────────────────────────────────────────────
const ChartCard = ({ title, children, delay, T }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    style={{ background: T.card, border: `1px solid ${T.cardBorder}`, borderRadius: 16, padding: "20px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
  >
    <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, color: T.text, fontSize: "0.9rem", marginBottom: 18 }}>{title}</p>
    {children}
  </motion.div>
);

// ── Action button ─────────────────────────────────────────────────────────────
const ActionBtn = ({ icon, label, path, accent, delay, navigate, T }) => (
  <motion.button
    initial={{ opacity: 0, scale: 0.93 }} animate={{ opacity: 1, scale: 1 }}
    transition={{ delay, duration: 0.4 }}
    whileHover={{ scale: 1.04, y: -3 }} whileTap={{ scale: 0.96 }}
    onClick={() => navigate(path)}
    style={{
      background: "transparent", border: `1px solid ${accent}33`, borderRadius: 14,
      padding: "16px 14px", cursor: "pointer", display: "flex", flexDirection: "column",
      alignItems: "flex-start", gap: 8, transition: "all 0.2s", width: "100%",
    }}
    onMouseEnter={e => { e.currentTarget.style.borderColor = accent + "88"; e.currentTarget.style.background = accent + "0f"; }}
    onMouseLeave={e => { e.currentTarget.style.borderColor = accent + "33"; e.currentTarget.style.background = "transparent"; }}
  >
    <div style={{ width: 36, height: 36, borderRadius: 10, background: accent + "1a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>{icon}</div>
    <span style={{ fontSize: "0.78rem", fontWeight: 600, color: T.text, textAlign: "left", lineHeight: 1.3 }}>{label}</span>
  </motion.button>
);

// ── Status badge ──────────────────────────────────────────────────────────────
const Badge = ({ status, T }) => {
  const map = { pending: [T.amber, "Pending"], accepted: [T.blue, "Accepted"], completed: [T.green, "Completed"] };
  const [color, label] = map[status] || [T.muted, status];
  return <span style={{ fontSize: "0.7rem", fontWeight: 700, color, background: color + "18", padding: "3px 9px", borderRadius: 20 }}>{label}</span>;
};

const catColors = ["#16c784","#3d9cf5","#f5a623","#a78bfa","#f472b6","#ef4444"];

// ── MAIN ──────────────────────────────────────────────────────────────────────
const Dashboard = () => {
  const { user } = useAuth();
  const { dark } = useTheme();
  const navigate = useNavigate();
  const T = tokens(dark);
  const isSeller = user?.role === "seller";

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/dashboard/stats")
      .then(r => setData(r.data))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const firstName = user?.fullName?.split(" ")[0] || "there";

  const sellerStats = [
    { icon: "📦", label: "Products",  value: data?.totalProducts || 0,  accent: T.green,  sub: `${data?.activeProducts || 0} active` },
    { icon: "📑", label: "Orders",    value: data?.totalOrders || 0,    accent: T.blue,   sub: `${data?.pendingOrders || 0} pending` },
    { icon: "✅", label: "Completed", value: data?.completedOrders || 0, accent: T.green },
    { icon: "💰", label: "Revenue",   value: data?.totalRevenue || 0,   accent: T.amber,  prefix: "₹", sub: "from completed orders" },
  ];
  const buyerStats = [
    { icon: "🛒", label: "Orders",    value: data?.totalOrders || 0,    accent: T.green },
    { icon: "⏳", label: "Pending",   value: data?.pendingOrders || 0,  accent: T.amber },
    { icon: "✅", label: "Completed", value: data?.completedOrders || 0, accent: T.blue },
    { icon: "💸", label: "Spent",     value: data?.totalSpent || 0,     accent: T.purple, prefix: "₹" },
  ];

  const sellerActions = [
    { icon: "➕", label: "Add Product",      path: "/seller/add-product",  accent: T.green  },
    { icon: "📦", label: "My Products",      path: "/seller/products",     accent: T.blue   },
    { icon: "📑", label: "Orders",           path: "/orders",              accent: T.amber  },
    { icon: "🏷️", label: "Category Master", path: "/masters/categories",  accent: T.purple },
    { icon: "⚖️", label: "Unit Master",     path: "/masters/units",       accent: T.pink   },
    { icon: "👤", label: "Profile",          path: "/profile",             accent: T.green  },
  ];
  const buyerActions = [
    { icon: "🌾", label: "Browse Products", path: "/products", accent: T.green  },
    { icon: "📦", label: "My Orders",       path: "/orders",   accent: T.blue   },
    { icon: "👤", label: "Profile",         path: "/profile",  accent: T.purple },
  ];

  const statCards = isSeller ? sellerStats : buyerStats;
  const actions   = isSeller ? sellerActions : buyerActions;

  return (
    <div style={{ minHeight: "100vh", background: T.bg, fontFamily: "'Inter', sans-serif", color: T.text, transition: "background 0.3s, color 0.3s" }}>
      <style>{FONTS}</style>

      {/* bg blobs */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        <div style={{ position: "absolute", top: 0, left: "15%", width: 500, height: 500, borderRadius: "50%", background: `radial-gradient(circle, ${T.green}${dark?"12":"18"} 0%, transparent 65%)` }} />
        <div style={{ position: "absolute", bottom: "10%", right: "5%", width: 400, height: 400, borderRadius: "50%", background: `radial-gradient(circle, ${T.blue}${dark?"10":"14"} 0%, transparent 65%)` }} />
      </div>

      <div style={{ position: "relative", zIndex: 1, maxWidth: 1160, margin: "0 auto", padding: "96px 20px 80px" }}>

        {/* ── Header ── */}
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}
          style={{ marginBottom: 32, display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
          <div>
            <p style={{ color: T.muted, fontSize: "0.72rem", letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 600, marginBottom: 4 }}>{greeting} 👋</p>
            <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(1.7rem,4vw,2.6rem)", fontWeight: 800, margin: 0, lineHeight: 1.05, color: T.text }}>
              {firstName}<span style={{ color: T.green }}>.</span>
            </h1>
            <p style={{ color: T.muted, fontSize: "0.8rem", marginTop: 5 }}>
              {isSeller ? "🌾 Seller · Farmora Marketplace" : "🛒 Buyer · Farmora Marketplace"}
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: (isSeller ? T.green : T.blue) + "15", border: `1px solid ${isSeller ? T.green : T.blue}30`, borderRadius: 50, padding: "7px 16px" }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: isSeller ? T.green : T.blue, boxShadow: `0 0 8px ${isSeller ? T.green : T.blue}` }} />
            <span style={{ color: isSeller ? T.green : T.blue, fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.08em" }}>{isSeller ? "SELLER" : "BUYER"}</span>
          </div>
        </motion.div>

        <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          style={{ height: 1, background: `linear-gradient(90deg, ${T.green}55, transparent)`, marginBottom: 0, transformOrigin: "left" }} />

        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 300 }}>
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              style={{ width: 36, height: 36, border: `3px solid ${T.green}`, borderTopColor: "transparent", borderRadius: "50%" }} />
          </div>
        ) : (
          <>
            {/* Stats */}
            <SectionLabel delay={0.1} T={T}>Overview</SectionLabel>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: 14 }}>
              {statCards.map((s, i) => <Stat key={s.label} {...s} delay={0.12 + i * 0.06} T={T} />)}
            </div>

            {/* Charts */}
            <SectionLabel delay={0.35} T={T}>Analytics</SectionLabel>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>

              {/* Area chart */}
              <div style={{ gridColumn: "span 2" }}>
                <ChartCard title={isSeller ? "Revenue Trend (7 months)" : "Spend Trend (7 months)"} delay={0.38} T={T}>
                  <ResponsiveContainer width="100%" height={220}>
                    <AreaChart data={data?.revenueTrend || []} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="gR" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={T.green} stopOpacity={dark ? 0.35 : 0.25} />
                          <stop offset="100%" stopColor={T.green} stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="gO" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={T.blue} stopOpacity={dark ? 0.3 : 0.2} />
                          <stop offset="100%" stopColor={T.blue} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke={T.gridLine} />
                      <XAxis dataKey="month" tick={{ fill: T.muted, fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: T.muted, fontSize: 11 }} axisLine={false} tickLine={false} width={45} />
                      <Tooltip content={<ChartTip T={T} />} />
                      <Legend wrapperStyle={{ fontSize: 11, color: T.muted }} />
                      <Area type="monotone" dataKey={isSeller ? "revenue" : "spent"} name={isSeller ? "Revenue (₹)" : "Spent (₹)"} stroke={T.green} strokeWidth={2} fill="url(#gR)" dot={{ fill: T.green, r: 3 }} activeDot={{ r: 5 }} />
                      <Area type="monotone" dataKey="orders" name="Orders" stroke={T.blue} strokeWidth={2} fill="url(#gO)" dot={{ fill: T.blue, r: 3 }} activeDot={{ r: 5 }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartCard>
              </div>

              {/* Donut */}
              <ChartCard title="Order Status" delay={0.42} T={T}>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={data?.orderStatus || []} cx="50%" cy="50%" innerRadius={65} outerRadius={90} paddingAngle={3} dataKey="value">
                      {(data?.orderStatus || []).map((e, i) => <Cell key={i} fill={e.color} />)}
                    </Pie>
                    <Tooltip contentStyle={{ background: T.tipBg, border: `1px solid ${T.tipBorder}`, borderRadius: 10, fontSize: 12, color: T.text }} />
                    <Legend wrapperStyle={{ fontSize: 11, color: T.muted }} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartCard>

              {/* Bar */}
              {isSeller && (
                <ChartCard title="Products by Category" delay={0.46} T={T}>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={(data?.categoryBreakdown || []).map(c => ({ name: c._id, count: c.count }))} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={T.gridLine} />
                      <XAxis dataKey="name" tick={{ fill: T.muted, fontSize: 10 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: T.muted, fontSize: 11 }} axisLine={false} tickLine={false} width={30} />
                      <Tooltip contentStyle={{ background: T.tipBg, border: `1px solid ${T.tipBorder}`, borderRadius: 10, fontSize: 12, color: T.text }} cursor={{ fill: dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)" }} />
                      <Bar dataKey="count" name="Products" radius={[6, 6, 0, 0]}>
                        {(data?.categoryBreakdown || []).map((_, i) => <Cell key={i} fill={catColors[i % catColors.length]} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </ChartCard>
              )}
            </div>

            {/* Recent orders */}
            {data?.recentOrders?.length > 0 && (
              <>
                <SectionLabel delay={0.5} T={T}>Recent Orders</SectionLabel>
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.52 }}
                  style={{ background: T.card, border: `1px solid ${T.cardBorder}`, borderRadius: 16, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.82rem" }}>
                      <thead>
                        <tr style={{ borderBottom: `1px solid ${T.cardBorder}` }}>
                          {(isSeller ? ["Buyer","Product","Qty","Amount","Status","Date"] : ["Product","Qty","Amount","Status","Date"]).map(h => (
                            <th key={h} style={{ padding: "12px 16px", textAlign: "left", color: T.muted, fontWeight: 600, fontSize: "0.7rem", letterSpacing: "0.08em", textTransform: "uppercase", whiteSpace: "nowrap" }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {data.recentOrders.map((o, i) => (
                          <motion.tr key={o._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 + i * 0.05 }}
                            style={{ borderBottom: `1px solid ${T.cardBorder}` }}
                            onMouseEnter={e => e.currentTarget.style.background = dark ? "rgba(255,255,255,0.025)" : "rgba(0,0,0,0.025)"}
                            onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                            {isSeller && <td style={{ padding: "11px 16px", fontWeight: 500, color: T.text }}>{o.buyer?.fullName || "—"}</td>}
                            <td style={{ padding: "11px 16px", color: T.text }}>{o.product?.title || "—"}</td>
                            <td style={{ padding: "11px 16px", color: T.muted }}>{o.quantity}</td>
                            <td style={{ padding: "11px 16px", fontWeight: 600, color: T.green }}>₹{o.totalPrice?.toLocaleString("en-IN")}</td>
                            <td style={{ padding: "11px 16px" }}><Badge status={o.status} T={T} /></td>
                            <td style={{ padding: "11px 16px", color: T.muted, whiteSpace: "nowrap" }}>{new Date(o.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              </>
            )}

            {/* Actions */}
            <SectionLabel delay={0.6} T={T}>Quick Actions</SectionLabel>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: 12 }}>
              {actions.map((a, i) => <ActionBtn key={a.label} {...a} delay={0.62 + i * 0.05} navigate={navigate} T={T} />)}
            </div>
          </>
        )}

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}
          style={{ textAlign: "center", color: T.muted, fontSize: "0.68rem", marginTop: 60, letterSpacing: "0.1em", opacity: 0.4 }}>
          FARMORA · {new Date().getFullYear()} · Connecting Farmers to Markets
        </motion.p>
      </div>
    </div>
  );
};

export default Dashboard;
