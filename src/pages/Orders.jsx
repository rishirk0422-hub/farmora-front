import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../services/api";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../hooks/useTheme";
import { toast } from "react-toastify";

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Inter:wght@400;500;600&display=swap');`;

const tokens = (dark) => ({
  bg:         dark ? "#080f1a"                : "#f0fdf4",
  card:       dark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.9)",
  cardBorder: dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)",
  text:       dark ? "#e2e8f0"               : "#0f1a10",
  muted:      dark ? "rgba(255,255,255,0.38)": "rgba(0,0,0,0.45)",
  subBg:      dark ? "rgba(255,255,255,0.04)": "rgba(0,0,0,0.03)",
  green:  "#16c784",
  blue:   "#3d9cf5",
  amber:  "#f5a623",
  purple: "#a78bfa",
});

const STATUS = {
  pending:   { label: "Pending",   color: "#f5a623" },
  accepted:  { label: "Accepted",  color: "#3d9cf5" },
  completed: { label: "Completed", color: "#16c784" },
};

const Badge = ({ status }) => {
  const s = STATUS[status] || { label: status, color: "#888" };
  return <span style={{ fontSize: "0.7rem", fontWeight: 700, color: s.color, background: s.color + "18", padding: "3px 10px", borderRadius: 20, whiteSpace: "nowrap" }}>{s.label}</span>;
};

const getImg = (images) => {
  const url = images?.[0]?.url;
  if (!url) return "https://via.placeholder.com/64";
  if (url.startsWith("http")) return url;
  return `${process.env.REACT_APP_SOCKET_URL}/${url}`;
};

const Empty = ({ label, T }) => (
  <div style={{ textAlign: "center", padding: "80px 20px", color: T.muted }}>
    <div style={{ fontSize: 52, marginBottom: 12 }}>📭</div>
    <p style={{ fontFamily: "'Syne',sans-serif", fontSize: "1.1rem", fontWeight: 700, color: T.text, marginBottom: 6 }}>No orders yet</p>
    <p style={{ fontSize: "0.82rem" }}>{label}</p>
  </div>
);

const OrderCard = ({ order, role, onStatusChange, T }) => {
  const [loading, setLoading] = useState(false);
  const isSeller = role === "seller";
  const canAccept   = isSeller  && order.status === "pending";
  const canComplete = !isSeller && order.status === "accepted";

  const handleAction = async (newStatus) => {
    try {
      setLoading(true);
      await api.patch(`/orders/${order._id}/status`, { status: newStatus });
      toast.success(newStatus === "accepted" ? "Order accepted ✅" : "Order marked as completed 🎉");
      onStatusChange();
    } catch (err) {
      toast.error(err.response?.data?.message || "Action failed");
    } finally { setLoading(false); }
  };

  return (
    <motion.div layout initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      style={{ background: T.card, border: `1px solid ${T.cardBorder}`, borderRadius: 18, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
      {/* status top line */}
      <div style={{ height: 3, background: STATUS[order.status]?.color || T.muted, opacity: 0.7 }} />
      <div style={{ padding: "18px 20px" }}>
        {/* product row */}
        <div style={{ display: "flex", gap: 14, alignItems: "flex-start", marginBottom: 16 }}>
          <img src={getImg(order.product?.images)} alt={order.product?.title}
            style={{ width: 64, height: 64, borderRadius: 12, objectFit: "cover", flexShrink: 0, border: `1px solid ${T.cardBorder}` }}
            onError={e => { e.target.src = "https://via.placeholder.com/64"; }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, flexWrap: "wrap" }}>
              <h3 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "0.95rem", color: T.green, margin: 0 }}>
                {order.product?.title || "Product"}
              </h3>
              <Badge status={order.status} />
            </div>
            <p style={{ color: T.muted, fontSize: "0.72rem", marginTop: 3 }}>
              {order.product?.category} · #{order._id.slice(-6).toUpperCase()}
            </p>
          </div>
        </div>

        {/* info grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 12px", marginBottom: 16 }}>
          {[
            isSeller ? { label: "Buyer", value: order.buyer?.fullName || "N/A" } : { label: "Product", value: order.product?.title || "N/A" },
            { label: "Quantity", value: order.quantity },
            { label: "Amount",   value: `₹${order.totalPrice?.toLocaleString("en-IN")}` },
            { label: "Date",     value: new Date(order.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) },
          ].map(({ label, value }) => (
            <div key={label}>
              <p style={{ fontSize: "0.65rem", color: T.muted, letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600, marginBottom: 1 }}>{label}</p>
              <p style={{ fontSize: "0.82rem", color: T.text, fontWeight: 500 }}>{value}</p>
            </div>
          ))}
        </div>

        {/* address */}
        {order.deliveryAddress && (
          <div style={{ background: T.subBg, border: `1px solid ${T.cardBorder}`, borderRadius: 10, padding: "9px 12px", marginBottom: 16 }}>
            <p style={{ fontSize: "0.65rem", color: T.muted, letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600, marginBottom: 3 }}>📍 Delivery Address</p>
            <p style={{ fontSize: "0.8rem", color: T.text }}>{order.deliveryAddress}</p>
          </div>
        )}

        {/* actions */}
        <AnimatePresence>
          {canAccept && (
            <motion.button initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              onClick={() => handleAction("accepted")} disabled={loading}
              style={{ width: "100%", padding: "10px", borderRadius: 12, border: "none", background: "linear-gradient(90deg,#16c784,#0ea85e)", color: "#fff", fontWeight: 700, fontSize: "0.82rem", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1 }}>
              {loading ? "Processing..." : "✅ Accept Order"}
            </motion.button>
          )}
          {canComplete && (
            <motion.button initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              onClick={() => handleAction("completed")} disabled={loading}
              style={{ width: "100%", padding: "10px", borderRadius: 12, border: "none", background: "linear-gradient(90deg,#3d9cf5,#2563eb)", color: "#fff", fontWeight: 700, fontSize: "0.82rem", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1 }}>
              {loading ? "Processing..." : "🎉 Mark as Received"}
            </motion.button>
          )}
          {order.status === "completed" && (
            <div style={{ textAlign: "center", fontSize: "0.78rem", color: "#16c784", fontWeight: 600, padding: "8px 0" }}>✅ Order completed</div>
          )}
          {order.status === "pending" && !isSeller && (
            <div style={{ textAlign: "center", fontSize: "0.78rem", color: "#f5a623", fontWeight: 600, padding: "8px 0" }}>⏳ Waiting for seller to accept</div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

const Tabs = ({ active, onChange, counts, T }) => (
  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
    {["all","pending","accepted","completed"].map((t) => (
      <button key={t} onClick={() => onChange(t)}
        style={{ padding: "6px 16px", borderRadius: 50, border: "none", cursor: "pointer", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "capitalize", transition: "all 0.2s",
          background: active === t ? "#16c784" : T.subBg,
          color: active === t ? "#fff" : T.muted,
          boxShadow: active === t ? "0 0 12px #16c78444" : "none",
          outline: active === t ? "none" : `1px solid ${T.cardBorder}`,
        }}>
        {t === "all" ? "All" : t.charAt(0).toUpperCase() + t.slice(1)} ({counts[t]})
      </button>
    ))}
  </div>
);

const Orders = () => {
  const { user } = useAuth();
  const { dark } = useTheme();
  const T = tokens(dark);
  const isSeller = user?.role === "seller";

  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState("all");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get(isSeller ? "/orders/seller" : "/orders/buyer");
      setOrders(res.data);
    } catch { toast.error("Failed to load orders"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchOrders(); }, [isSeller]);

  const counts = {
    all:       orders.length,
    pending:   orders.filter(o => o.status === "pending").length,
    accepted:  orders.filter(o => o.status === "accepted").length,
    completed: orders.filter(o => o.status === "completed").length,
  };
  const filtered = filter === "all" ? orders : orders.filter(o => o.status === filter);

  return (
    <div style={{ minHeight: "100vh", background: T.bg, fontFamily: "'Inter', sans-serif", color: T.text, transition: "background 0.3s, color 0.3s" }}>
      <style>{FONTS}</style>

      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        <div style={{ position: "absolute", top: 0, left: "10%", width: 450, height: 450, borderRadius: "50%", background: `radial-gradient(circle, #16c784${dark?"10":"16"} 0%, transparent 65%)` }} />
        <div style={{ position: "absolute", bottom: "10%", right: "5%", width: 350, height: 350, borderRadius: "50%", background: `radial-gradient(circle, #3d9cf5${dark?"0d":"12"} 0%, transparent 65%)` }} />
      </div>

      <div style={{ position: "relative", zIndex: 1, maxWidth: 1100, margin: "0 auto", padding: "96px 20px 80px" }}>

        {/* header */}
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ marginBottom: 28 }}>
          <p style={{ color: T.muted, fontSize: "0.68rem", letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 600, marginBottom: 4 }}>
            {isSeller ? "Seller Panel" : "Buyer Panel"}
          </p>
          <h1 style={{ fontFamily: "'Syne',sans-serif", fontSize: "clamp(1.6rem,4vw,2.4rem)", fontWeight: 800, margin: 0, lineHeight: 1.1, color: T.text }}>
            {isSeller ? "Incoming Orders" : "My Orders"}<span style={{ color: "#16c784" }}>.</span>
          </h1>
          <p style={{ color: T.muted, fontSize: "0.8rem", marginTop: 6 }}>
            {isSeller ? "Accept orders from buyers and track fulfilment" : "Track your purchases and confirm delivery"}
          </p>
        </motion.div>

        <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          style={{ height: 1, background: "linear-gradient(90deg,#16c78455,transparent)", marginBottom: 24, transformOrigin: "left" }} />

        {/* summary chips */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 20 }}>
          {[
            { label: "Total",     value: counts.all,       color: T.text  },
            { label: "Pending",   value: counts.pending,   color: "#f5a623" },
            { label: "Accepted",  value: counts.accepted,  color: "#3d9cf5" },
            { label: "Completed", value: counts.completed, color: "#16c784" },
          ].map(({ label, value, color }) => (
            <div key={label} style={{ background: T.card, border: `1px solid ${T.cardBorder}`, borderRadius: 10, padding: "8px 16px", display: "flex", gap: 8, alignItems: "center", boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}>
              <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "1rem", color }}>{value}</span>
              <span style={{ fontSize: "0.72rem", color: T.muted, fontWeight: 500 }}>{label}</span>
            </div>
          ))}
        </motion.div>

        {/* tabs */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }} style={{ marginBottom: 24 }}>
          <Tabs active={filter} onChange={setFilter} counts={counts} T={T} />
        </motion.div>

        {/* grid */}
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: 80 }}>
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              style={{ width: 36, height: 36, border: "3px solid #16c784", borderTopColor: "transparent", borderRadius: "50%" }} />
          </div>
        ) : filtered.length === 0 ? (
          <Empty T={T} label={filter === "all"
            ? (isSeller ? "No orders placed for your products yet." : "You haven't placed any orders yet.")
            : `No ${filter} orders.`} />
        ) : (
          <motion.div layout style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
            <AnimatePresence>
              {filtered.map((order) => (
                <OrderCard key={order._id} order={order} role={user?.role} onStatusChange={fetchOrders} T={T} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Orders;
