import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import api from "../services/api";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

// ── Fonts ─────────────────────────────────────────────────────────────────────
const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Inter:wght@400;500;600&display=swap');`;

// ── Palette ───────────────────────────────────────────────────────────────────
const C = {
  green:  "#16c784",
  blue:   "#3d9cf5",
  amber:  "#f5a623",
  purple: "#a78bfa",
  pink:   "#f472b6",
  red:    "#ef4444",
  bg:     "#080f1a",
  card:   "rgba(255,255,255,0.04)",
  border: "rgba(255,255,255,0.07)",
  text:   "#e2e8f0",
  muted:  "rgba(255,255,255,0.35)",
};

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
const ChartTip = ({ active, payload, label, prefix = "₹" }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#0f1d2e", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "10px 14px", fontSize: 12 }}>
      <p style={{ color: C.muted, marginBottom: 4 }}>{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color, fontWeight: 600 }}>
          {p.name}: {prefix}{p.value?.toLocaleString("en-IN")}
        </p>
      ))}
    </div>
  );
};

// ── Stat card ─────────────────────────────────────────────────────────────────
const Stat = ({ icon, label, value, prefix = "", suffix = "", accent, delay, sub }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: "20px 18px", position: "relative", overflow: "hidden" }}
  >
    <div style={{ position: "absolute", top: -24, right: -24, width: 80, height: 80, borderRadius: "50%", background: accent, opacity: 0.15, filter: "blur(24px)" }} />
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
      <span style={{ fontSize: "1.3rem" }}>{icon}</span>
      <span style={{ fontSize: "0.65rem", color: accent, background: accent + "18", padding: "3px 8px", borderRadius: 20, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>{label}</span>
    </div>
    <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.75rem", fontWeight: 800, color: C.text, lineHeight: 1 }}>
      <Counter to={value} prefix={prefix} suffix={suffix} />
    </div>
    {sub && <div style={{ fontSize: "0.72rem", color: C.muted, marginTop: 5 }}>{sub}</div>}
  </motion.div>
);

// ── Section label ─────────────────────────────────────────────────────────────
const SectionLabel = ({ children, delay = 0 }) => (
  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay }}
    style={{ color: C.muted, fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 700, marginBottom: 12, marginTop: 32 }}>
    {children}
  </motion.p>
);

// ── Chart card ────────────────────────────────────────────────────────────────
const ChartCard = ({ title, children, delay, span = 1 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    style={{
      background: C.card, border: `1px solid ${C.border}`, borderRadius: 16,
      padding: "20px", gridColumn: span > 1 ? `span ${span}` : undefined,
    }}
  >
    <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, color: C.text, fontSize: "0.9rem", marginBottom: 18 }}>{title}</p>
    {children}
  </motion.div>
);

// ── Action button ─────────────────────────────────────────────────────────────
const ActionBtn = ({ icon, label, path, accent, delay, navigate }) => (
  <motion.button
    initial={{ opacity: 0, scale: 0.93 }} animate={{ opacity: 1, scale: 1 }}
    transition={{ delay, duration: 0.4 }}
    whileHover={{ scale: 1.04, y: -3 }} whileTap={{ scale: 0.96 }}
    onClick={() => navigate(path)}
    style={{
      background: "transparent", border: `1px solid ${accent}33`,
      borderRadius: 14, padding: "16px 14px", cursor: "pointer",
      display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 8,
      transition: "border-color 0.2s, background 0.2s",
    }}
    onMouseEnter={e => { e.currentTarget.style.borderColor = accent + "88"; e.currentTarget.style.background = accent + "08"; }}
    onMouseLeave={e => { e.currentTarget.style.borderColor = accent + "33"; e.currentTarget.style.background = "transparent"; }}
  >
    <div style={{ width: 36, height: 36, borderRadius: 10, background: accent + "1a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>{icon}</div>
    <span style={{ fontSize: "0.78rem", fontWeight: 600, color: C.text, textAlign: "left", lineHeight: 1.3 }}>{label}</span>
  </motion.button>
);

// ── Status badge ──────────────────────────────────────────────────────────────
const Badge = ({ status }) => {
  const map = { pending: [C.amber, "Pending"], accepted: [C.blue, "Accepted"], completed: [C.green, "Completed"] };
  const [color, label] = map[status] || [C.muted, status];
  return (
    <span style={{ fontSize: "0.7rem", fontWeight: 700, color, background: color + "18", padding: "3px 9px", borderRadius: 20 }}>{label}</span>
  );
};

// ── DONUT custom label ────────────────────────────────────────────────────────
const DonutLabel = ({ cx, cy, total }) => (
  <>
    <text x={cx} y={cy - 8} textAnchor="middle" fill={C.text} style={{ fontFamily: "'Syne',sans-serif", fontSize: 22, fontWeight: 800 }}>{total}</text>
    <text x={cx} y={cy + 14} textAnchor="middle" fill={C.muted} style={{ fontSize: 11 }}>orders</text>
  </>
);

// ── MAIN ──────────────────────────────────────────────────────────────────────
const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
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

  const sellerActions = [
    { icon: "➕", label: "Add Product",      path: "/seller/add-product",   accent: C.green  },
    { icon: "📦", label: "My Products",      path: "/seller/products",      accent: C.blue   },
    { icon: "📑", label: "Orders",           path: "/orders",               accent: C.amber  },
    { icon: "🏷️", label: "Category Master", path: "/masters/categories",   accent: C.purple },
    { icon: "⚖️", label: "Unit Master",     path: "/masters/units",        accent: C.pink   },
    { icon: "👤", label: "Profile",          path: "/profile",              accent: C.green  },
  ];
  const buyerActions = [
    { icon: "🌾", label: "Browse Products", path: "/products", accent: C.green  },
    { icon: "📦", label: "My Orders",       path: "/orders",   accent: C.blue   },
    { icon: "👤", label: "Profile",         path: "/profile",  accent: C.purple },
  ];
  const actions = isSeller ? sellerActions : buyerActions;

  const catColors = [C.green, C.blue, C.amber, C.purple, C.pink, C.red];

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "'Inter', sans-serif", color: C.text }}>
      <style>{FONTS}</style>

      {/* bg glow */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        <div style={{ position: "absolute", top: 0, left: "15%", width: 500, height: 500, borderRadius: "50%", background: `radial-gradient(circle, ${C.green}12 0%, transparent 65%)` }} />
        <div style={{ position: "absolute", bottom: "10%", right: "5%", width: 400, height: 400, borderRadius: "50%", background: `radial-gradient(circle, ${C.blue}10 0%, transparent 65%)` }} />
      </div>

      <div style={{ position: "relative", zIndex: 1, maxWidth: 1160, margin: "0 auto", padding: "36px 20px 80px" }}>

        {/* ── Header ── */}
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }} style={{ marginBottom: 32, display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
          <div>
            <p style={{ color: C.muted, fontSize: "0.72rem", letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 600, marginBottom: 4 }}>{greeting} 👋</p>
            <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(1.7rem,4vw,2.6rem)", fontWeight: 800, margin: 0, lineHeight: 1.05 }}>
              {firstName}<span style={{ color: C.green }}>.</span>
            </h1>
            <p style={{ color: C.muted, fontSize: "0.8rem", marginTop: 5 }}>
              {isSeller ? "🌾 Seller · Farmora Marketplace" : "🛒 Buyer · Farmora Marketplace"}
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: (isSeller ? C.green : C.blue) + "12", border: `1px solid ${isSeller ? C.green : C.blue}30`, borderRadius: 50, padding: "7px 16px" }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: isSeller ? C.green : C.blue, boxShadow: `0 0 8px ${isSeller ? C.green : C.blue}` }} />
            <span style={{ color: isSeller ? C.green : C.blue, fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.08em" }}>{isSeller ? "SELLER" : "BUYER"}</span>
          </div>
        </motion.div>

        {/* ── Divider ── */}
        <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          style={{ height: 1, background: `linear-gradient(90deg, ${C.green}55, transparent)`, marginBottom: 0, transformOrigin: "left" }} />

        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 300 }}>
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              style={{ width: 36, height: 36, border: `3px solid ${C.green}`, borderTopColor: "transparent", borderRadius: "50%" }} />
          </div>
        ) : (
          <>
            {/* ── Stat cards ── */}
            <SectionLabel delay={0.1}>Overview</SectionLabel>
            {isSeller ? (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: 14 }}>
                <Stat icon="📦" label="Products"  value={data?.totalProducts || 0}  accent={C.green}  delay={0.12} sub={`${data?.activeProducts || 0} active`} />
                <Stat icon="📑" label="Orders"    value={data?.totalOrders || 0}    accent={C.blue}   delay={0.18} sub={`${data?.pendingOrders || 0} pending`} />
                <Stat icon="✅" label="Completed" value={data?.completedOrders || 0} accent={C.green}  delay={0.24} />
                <Stat icon="💰" label="Revenue"   value={data?.totalRevenue || 0}   accent={C.amber}  delay={0.30} prefix="₹" sub="from completed orders" />
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: 14 }}>
                <Stat icon="🛒" label="Orders"    value={data?.totalOrders || 0}    accent={C.green}  delay={0.12} />
                <Stat icon="⏳" label="Pending"   value={data?.pendingOrders || 0}  accent={C.amber}  delay={0.18} />
                <Stat icon="✅" label="Completed" value={data?.completedOrders || 0} accent={C.blue}   delay={0.24} />
                <Stat icon="💸" label="Spent"     value={data?.totalSpent || 0}     accent={C.purple} delay={0.30} prefix="₹" />
              </div>
            )}

            {/* ── Charts ── */}
            <SectionLabel delay={0.35}>Analytics</SectionLabel>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>

              {/* Area chart — revenue/spend trend */}
              <ChartCard title={isSeller ? "Revenue Trend (7 months)" : "Spend Trend (7 months)"} delay={0.38} span={2}>
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={data?.revenueTrend || []} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="gRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={C.green} stopOpacity={0.35} />
                        <stop offset="100%" stopColor={C.green} stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="gOrders" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={C.blue} stopOpacity={0.3} />
                        <stop offset="100%" stopColor={C.blue} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="month" tick={{ fill: C.muted, fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: C.muted, fontSize: 11 }} axisLine={false} tickLine={false} width={45} />
                    <Tooltip content={<ChartTip />} />
                    <Legend wrapperStyle={{ fontSize: 11, color: C.muted }} />
                    <Area type="monotone" dataKey={isSeller ? "revenue" : "spent"} name={isSeller ? "Revenue (₹)" : "Spent (₹)"} stroke={C.green} strokeWidth={2} fill="url(#gRevenue)" dot={{ fill: C.green, r: 3 }} activeDot={{ r: 5 }} />
                    <Area type="monotone" dataKey="orders" name="Orders" stroke={C.blue} strokeWidth={2} fill="url(#gOrders)" dot={{ fill: C.blue, r: 3 }} activeDot={{ r: 5 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartCard>

              {/* Donut — order status */}
              <ChartCard title="Order Status" delay={0.42}>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={data?.orderStatus || []}
                      cx="50%" cy="50%"
                      innerRadius={65} outerRadius={90}
                      paddingAngle={3} dataKey="value"
                      label={false}
                    >
                      {(data?.orderStatus || []).map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v) => [v, ""]} contentStyle={{ background: "#0f1d2e", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, fontSize: 12 }} />
                    <Legend wrapperStyle={{ fontSize: 11, color: C.muted }} />
                    {data?.totalOrders > 0 && (
                      <DonutLabel cx="50%" cy="50%" total={data?.totalOrders || 0} />
                    )}
                  </PieChart>
                </ResponsiveContainer>
              </ChartCard>

              {/* Bar chart — category breakdown (seller only) */}
              {isSeller && (
                <ChartCard title="Products by Category" delay={0.46}>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={data?.categoryBreakdown?.map(c => ({ name: c._id, count: c.count })) || []} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="name" tick={{ fill: C.muted, fontSize: 10 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: C.muted, fontSize: 11 }} axisLine={false} tickLine={false} width={30} />
                      <Tooltip contentStyle={{ background: "#0f1d2e", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, fontSize: 12 }} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
                      <Bar dataKey="count" name="Products" radius={[6, 6, 0, 0]}>
                        {(data?.categoryBreakdown || []).map((_, i) => (
                          <Cell key={i} fill={catColors[i % catColors.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </ChartCard>
              )}
            </div>

            {/* ── Recent orders table ── */}
            {data?.recentOrders?.length > 0 && (
              <>
                <SectionLabel delay={0.5}>Recent Orders</SectionLabel>
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.52 }}
                  style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, overflow: "hidden" }}>
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.82rem" }}>
                      <thead>
                        <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                          {(isSeller ? ["Buyer", "Product", "Qty", "Amount", "Status", "Date"] : ["Product", "Qty", "Amount", "Status", "Date"]).map(h => (
                            <th key={h} style={{ padding: "12px 16px", textAlign: "left", color: C.muted, fontWeight: 600, fontSize: "0.7rem", letterSpacing: "0.08em", textTransform: "uppercase", whiteSpace: "nowrap" }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {data.recentOrders.map((o, i) => (
                          <motion.tr key={o._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 + i * 0.05 }}
                            style={{ borderBottom: `1px solid ${C.border}` }}
                            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.025)"}
                            onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                            {isSeller && <td style={{ padding: "11px 16px", fontWeight: 500 }}>{o.buyer?.fullName || "—"}</td>}
                            <td style={{ padding: "11px 16px", color: C.text }}>{o.product?.title || "—"}</td>
                            <td style={{ padding: "11px 16px", color: C.muted }}>{o.quantity}</td>
                            <td style={{ padding: "11px 16px", fontWeight: 600, color: C.green }}>₹{o.totalPrice?.toLocaleString("en-IN")}</td>
                            <td style={{ padding: "11px 16px" }}><Badge status={o.status} /></td>
                            <td style={{ padding: "11px 16px", color: C.muted, whiteSpace: "nowrap" }}>{new Date(o.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              </>
            )}

            {/* ── Quick actions ── */}
            <SectionLabel delay={0.6}>Quick Actions</SectionLabel>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: 12 }}>
              {actions.map((a, i) => (
                <ActionBtn key={a.label} {...a} delay={0.62 + i * 0.05} navigate={navigate} />
              ))}
            </div>
          </>
        )}

        {/* footer */}
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}
          style={{ textAlign: "center", color: "rgba(255,255,255,0.12)", fontSize: "0.68rem", marginTop: 60, letterSpacing: "0.1em" }}>
          FARMORA · {new Date().getFullYear()} · Connecting Farmers to Markets
        </motion.p>
      </div>
    </div>
  );
};

export default Dashboard;
