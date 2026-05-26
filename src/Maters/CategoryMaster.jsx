import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import api from "../services/api";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import {
  TextField, Button, Typography, Box,
  Modal, IconButton, Tooltip, Chip,
} from "@mui/material";
import {
  Add as AddIcon, Edit as EditIcon,
  Delete as DeleteIcon, Close as CloseIcon,
  Category as CategoryIcon,
} from "@mui/icons-material";

const categorySchema = yup.object({
  category_name: yup.string().required("Category name is required").min(2, "Min 2 characters"),
  category_description: yup.string().required("Description is required").min(5, "Min 5 characters"),
});

const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";

// ── Reusable modal button row ─────────────────────────────────────────────────
const ModalActions = ({ onCancel, submitting, editRow, label }) => (
  <Box sx={{ display: "flex", gap: 1.5, mt: 2 }}>
    <Button
      onClick={onCancel}
      variant="outlined"
      size="small"
      sx={{
        borderRadius: "10px",
        borderColor: "#d1d5db",
        color: "#6b7280",
        px: 2.5,
        py: 0.8,
        fontSize: "0.8rem",
        whiteSpace: "nowrap",
        minWidth: "auto",
        flexShrink: 0,
      }}
    >
      Cancel
    </Button>
    <motion.div style={{ flex: 1 }} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
      <Button
        type="submit"
        variant="contained"
        fullWidth
        disabled={submitting}
        size="small"
        sx={{
          borderRadius: "10px",
          background: "linear-gradient(90deg,#22c55e,#16a34a)",
          fontWeight: "bold",
          py: 0.9,
          fontSize: "0.85rem",
          whiteSpace: "nowrap",
          boxShadow: "0 4px 15px rgba(34,197,94,0.3)",
        }}
      >
        {submitting ? "Saving..." : editRow ? `Update ${label}` : `Add ${label}`}
      </Button>
    </motion.div>
  </Box>
);

const CategoryMaster = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editRow, setEditRow] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } =
    useForm({ resolver: yupResolver(categorySchema) });

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await api.get("/masters/categories");
      setCategories(res.data);
    } catch { toast.error("Failed to load categories"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchCategories(); }, []);

  const openAdd = () => {
    setEditRow(null);
    reset({ category_name: "", category_description: "" });
    setModalOpen(true);
  };
  const openEdit = (row) => {
    setEditRow(row);
    reset({ category_name: row.category_name, category_description: row.category_description });
    setModalOpen(true);
  };
  const closeModal = () => { setModalOpen(false); setEditRow(null); reset(); };

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);
      if (editRow) {
        await api.put(`/masters/categories/${editRow.id}`, data);
        toast.success("Category updated ✅");
      } else {
        await api.post("/masters/categories", data);
        toast.success("Category added 🚀");
      }
      closeModal();
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally { setSubmitting(false); }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/masters/categories/${id}`);
      toast.success("Category deleted");
      setDeleteId(null);
      fetchCategories();
    } catch { toast.error("Delete failed"); }
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, minHeight: "100vh" }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between",pt:6, mb: 3, flexWrap: "wrap", gap: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <CategoryIcon sx={{ fontSize: { xs: 26, sm: 32 }, color: "#16a34a" }} />
            <Box>
              <Typography variant="h5" fontWeight="bold" sx={{ fontSize: { xs: "1.1rem", sm: "1.5rem" } }}>
                Category Master
              </Typography>
              <Typography variant="body2" color="text.secondary">Manage product categories</Typography>
            </Box>
          </Box>
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={openAdd}
              size="small"
              sx={{
                borderRadius: "10px",
                background: "linear-gradient(90deg,#22c55e,#16a34a)",
                fontWeight: "bold",
                px: { xs: 2, sm: 3 },
                py: { xs: 0.8, sm: 1 },
                fontSize: { xs: "0.8rem", sm: "0.875rem" },
                whiteSpace: "nowrap",
                boxShadow: "0 4px 15px rgba(34,197,94,0.3)",
              }}
            >
              Add New
            </Button>
          </motion.div>
        </Box>
      </motion.div>

      {/* Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
        className="glass rounded-2xl overflow-hidden">
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", fontSize: "0.875rem", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "linear-gradient(90deg,#22c55e22,#16a34a11)", borderBottom: "1px solid #22c55e33" }}>
                {["ID", "Category Name", "Description", "Created By", "Created Date", "Modified By", "Modified Date", "Actions"].map(h => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600, color: "#16a34a", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} style={{ textAlign: "center", padding: 48 }}>
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    style={{ width: 32, height: 32, border: "3px solid #22c55e", borderTopColor: "transparent", borderRadius: "50%", margin: "0 auto" }} />
                </td></tr>
              ) : categories.length === 0 ? (
                <tr><td colSpan={8} style={{ textAlign: "center", padding: 48, color: "#9ca3af" }}>No categories found. Add your first one!</td></tr>
              ) : categories.map((row, i) => (
                <motion.tr key={row.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                  style={{ borderBottom: "1px solid #f3f4f6" }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(34,197,94,0.04)"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <td style={{ padding: "12px 16px", fontFamily: "monospace", fontSize: "0.75rem", color: "#9ca3af" }}>#{row.id}</td>
                  <td style={{ padding: "12px 16px", fontWeight: 600 }}>{row.category_name}</td>
                  <td style={{ padding: "12px 16px", color: "#6b7280", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{row.category_description}</td>
                  <td style={{ padding: "12px 16px" }}><Chip label={row.created_by || "System"} size="small" sx={{ background: "#dcfce7", color: "#16a34a", fontWeight: 600 }} /></td>
                  <td style={{ padding: "12px 16px", color: "#6b7280", whiteSpace: "nowrap" }}>{fmtDate(row.created_date)}</td>
                  <td style={{ padding: "12px 16px" }}><Chip label={row.last_modified_by || "—"} size="small" sx={{ background: "#f0fdf4", color: "#15803d" }} /></td>
                  <td style={{ padding: "12px 16px", color: "#6b7280", whiteSpace: "nowrap" }}>{fmtDate(row.last_modified_date)}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <Box sx={{ display: "flex", gap: 0.5 }}>
                      <Tooltip title="Edit"><IconButton size="small" onClick={() => openEdit(row)} sx={{ color: "#16a34a", "&:hover": { background: "#dcfce7" } }}><EditIcon sx={{ fontSize: 18 }} /></IconButton></Tooltip>
                      <Tooltip title="Delete"><IconButton size="small" onClick={() => setDeleteId(row.id)} sx={{ color: "#ef4444", "&:hover": { background: "#fee2e2" } }}><DeleteIcon sx={{ fontSize: 18 }} /></IconButton></Tooltip>
                    </Box>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Add/Edit Modal */}
      <Modal open={modalOpen} onClose={closeModal}>
        <AnimatePresence>
          {modalOpen && (
            <Box sx={{ position: "fixed", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", p: { xs: 1.5, sm: 2 }, backdropFilter: "blur(4px)", backgroundColor: "rgba(0,0,0,0.4)" }}>
              <motion.div
                initial={{ opacity: 0, scale: 0.88, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.88, y: 30 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                style={{ background: "rgba(255,255,255,0.97)", borderRadius: 20, padding: "24px", width: "100%", maxWidth: 500, boxShadow: "0 25px 60px rgba(0,0,0,0.2)" }}
              >
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <CategoryIcon sx={{ color: "#16a34a" }} />
                    <Typography variant="h6" fontWeight="bold" sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}>
                      {editRow ? "Edit Category" : "Add New Category"}
                    </Typography>
                  </Box>
                  <IconButton onClick={closeModal} size="small"><CloseIcon fontSize="small" /></IconButton>
                </Box>
                <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <TextField label="Category Name" {...register("category_name")} error={!!errors.category_name} helperText={errors.category_name?.message} fullWidth autoFocus size="small"
                    sx={{ "& .MuiOutlinedInput-root.Mui-focused fieldset": { borderColor: "#16a34a" } }} />
                  <TextField label="Category Description" {...register("category_description")} error={!!errors.category_description} helperText={errors.category_description?.message} fullWidth multiline rows={3} size="small"
                    sx={{ "& .MuiOutlinedInput-root.Mui-focused fieldset": { borderColor: "#16a34a" } }} />
                  <ModalActions onCancel={closeModal} submitting={submitting} editRow={editRow} label="Category" />
                </form>
              </motion.div>
            </Box>
          )}
        </AnimatePresence>
      </Modal>

      {/* Delete Modal */}
      <Modal open={!!deleteId} onClose={() => setDeleteId(null)}>
        <Box sx={{ position: "fixed", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", p: 2, backdropFilter: "blur(4px)", backgroundColor: "rgba(0,0,0,0.4)" }}>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            style={{ background: "#fff", borderRadius: 16, padding: 28, maxWidth: 360, width: "100%", textAlign: "center" }}>
            <DeleteIcon sx={{ fontSize: 44, color: "#ef4444", mb: 1 }} />
            <Typography variant="h6" fontWeight="bold" mb={0.5}>Delete Category?</Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>This action cannot be undone.</Typography>
            <Box sx={{ display: "flex", gap: 1.5 }}>
              <Button fullWidth variant="outlined" size="small" onClick={() => setDeleteId(null)} sx={{ borderRadius: "10px", py: 0.9 }}>Cancel</Button>
              <Button fullWidth variant="contained" size="small" onClick={() => handleDelete(deleteId)} sx={{ borderRadius: "10px", py: 0.9, background: "#ef4444", "&:hover": { background: "#dc2626" } }}>Delete</Button>
            </Box>
          </motion.div>
        </Box>
      </Modal>
    </Box>
  );
};

export default CategoryMaster;
