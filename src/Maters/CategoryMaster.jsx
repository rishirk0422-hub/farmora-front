import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import api from "../services/api";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import {
  TextField,
  Button,
  Typography,
  Box,
  Modal,
  IconButton,
  Tooltip,
  Chip,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
  Category as CategoryIcon,
} from "@mui/icons-material";

// ─── Validation Schema ───────────────────────────────────────────────────────
const categorySchema = yup.object({
  category_name: yup
    .string()
    .required("Category name is required")
    .min(2, "Minimum 2 characters"),
  category_description: yup
    .string()
    .required("Description is required")
    .min(5, "Minimum 5 characters"),
});

// ─── Helpers ─────────────────────────────────────────────────────────────────
const fmtDate = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";

// ─── Component ───────────────────────────────────────────────────────────────
const CategoryMaster = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editRow, setEditRow] = useState(null); // null = add mode
  const [deleteId, setDeleteId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: yupResolver(categorySchema) });

  // ── Fetch ────────────────────────────────────────────────────────────────
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await api.get("/masters/categories");
      setCategories(res.data);
    } catch {
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // ── Open modal ───────────────────────────────────────────────────────────
  const openAdd = () => {
    setEditRow(null);
    reset({ category_name: "", category_description: "" });
    setModalOpen(true);
  };

  const openEdit = (row) => {
    setEditRow(row);
    reset({
      category_name: row.category_name,
      category_description: row.category_description,
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditRow(null);
    reset();
  };

  // ── Submit ───────────────────────────────────────────────────────────────
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
    } finally {
      setSubmitting(false);
    }
  };

  // ── Delete ───────────────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    try {
      await api.delete(`/masters/categories/${id}`);
      toast.success("Category deleted");
      setDeleteId(null);
      fetchCategories();
    } catch {
      toast.error("Delete failed");
    }
  };

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <Box className="pt-16 pb-6 px-6 min-h-screen">
      {/* ── Page Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between mb-6"
      >
        <Box className="flex items-center gap-3">
          <CategoryIcon sx={{ fontSize: 32, color: "#16a34a" }} />
          <Box>
            <Typography variant="h5" fontWeight="bold">
              Category Master
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Manage product categories
            </Typography>
          </Box>
        </Box>

        <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={openAdd}
            sx={{
              borderRadius: "12px",
              background: "linear-gradient(90deg,#22c55e,#16a34a)",
              fontWeight: "bold",
              px: 3,
              py: 1.2,
              boxShadow: "0 4px 15px rgba(34,197,94,0.3)",
            }}
          >
            Add New
          </Button>
        </motion.div>
      </motion.div>

      {/* ── Table ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="glass rounded-2xl overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr
                style={{
                  background: "linear-gradient(90deg,#22c55e22,#16a34a11)",
                  borderBottom: "1px solid #22c55e33",
                }}
              >
                {[
                  "ID",
                  "Category Name",
                  "Description",
                  "Created By",
                  "Created Date",
                  "Modified By",
                  "Modified Date",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left font-semibold text-green-700 whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="text-center py-12">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                      style={{
                        width: 32,
                        height: 32,
                        border: "3px solid #22c55e",
                        borderTopColor: "transparent",
                        borderRadius: "50%",
                        margin: "0 auto",
                      }}
                    />
                  </td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-gray-400">
                    No categories found. Add your first one!
                  </td>
                </tr>
              ) : (
                categories.map((row, i) => (
                  <motion.tr
                    key={row.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="border-b border-gray-100 hover:bg-green-50/30 transition-colors"
                  >
                    <td className="px-4 py-3 font-mono text-xs text-gray-400">
                      #{row.id}
                    </td>
                    <td className="px-4 py-3 font-semibold">{row.category_name}</td>
                    <td className="px-4 py-3 text-gray-600 max-w-xs truncate">
                      {row.category_description}
                    </td>
                    <td className="px-4 py-3">
                      <Chip
                        label={row.created_by || "System"}
                        size="small"
                        sx={{ background: "#dcfce7", color: "#16a34a", fontWeight: 600 }}
                      />
                    </td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                      {fmtDate(row.created_date)}
                    </td>
                    <td className="px-4 py-3">
                      <Chip
                        label={row.last_modified_by || "—"}
                        size="small"
                        sx={{ background: "#f0fdf4", color: "#15803d" }}
                      />
                    </td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                      {fmtDate(row.last_modified_date)}
                    </td>
                    <td className="px-4 py-3">
                      <Box className="flex gap-1">
                        <Tooltip title="Edit">
                          <IconButton
                            size="small"
                            onClick={() => openEdit(row)}
                            sx={{ color: "#16a34a", "&:hover": { background: "#dcfce7" } }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            onClick={() => setDeleteId(row.id)}
                            sx={{ color: "#ef4444", "&:hover": { background: "#fee2e2" } }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* ── Add / Edit Modal ── */}
      <Modal open={modalOpen} onClose={closeModal}>
        <AnimatePresence>
          {modalOpen && (
            <Box
              sx={{
                position: "fixed",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                p: 2,
                backdropFilter: "blur(4px)",
                backgroundColor: "rgba(0,0,0,0.4)",
              }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.88, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.88, y: 30 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                style={{
                  background: "rgba(255,255,255,0.97)",
                  borderRadius: 20,
                  padding: 32,
                  width: "100%",
                  maxWidth: 520,
                  boxShadow: "0 25px 60px rgba(0,0,0,0.2)",
                  position: "relative",
                }}
              >
                {/* Modal Header */}
                <Box className="flex items-center justify-between mb-6">
                  <Box className="flex items-center gap-2">
                    <CategoryIcon sx={{ color: "#16a34a" }} />
                    <Typography variant="h6" fontWeight="bold">
                      {editRow ? "Edit Category" : "Add New Category"}
                    </Typography>
                  </Box>
                  <IconButton onClick={closeModal} size="small">
                    <CloseIcon />
                  </IconButton>
                </Box>

                {/* Modal Form */}
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="flex flex-col gap-4"
                >
                  <TextField
                    label="Category Name"
                    {...register("category_name")}
                    error={!!errors.category_name}
                    helperText={errors.category_name?.message}
                    fullWidth
                    autoFocus
                    sx={{ "& .MuiOutlinedInput-root.Mui-focused fieldset": { borderColor: "#16a34a" } }}
                  />
                  <TextField
                    label="Category Description"
                    {...register("category_description")}
                    error={!!errors.category_description}
                    helperText={errors.category_description?.message}
                    fullWidth
                    multiline
                    rows={3}
                    sx={{ "& .MuiOutlinedInput-root.Mui-focused fieldset": { borderColor: "#16a34a" } }}
                  />

                  <Box className="flex gap-3 mt-2">
                    <Button
                      fullWidth
                      variant="outlined"
                      onClick={closeModal}
                      sx={{ borderRadius: "12px", borderColor: "#d1d5db", color: "#6b7280" }}
                    >
                      Cancel
                    </Button>
                    <motion.div
                      style={{ flex: 1 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        disabled={submitting}
                        sx={{
                          borderRadius: "12px",
                          background: "linear-gradient(90deg,#22c55e,#16a34a)",
                          fontWeight: "bold",
                          py: 1.4,
                          boxShadow: "0 4px 15px rgba(34,197,94,0.3)",
                        }}
                      >
                        {submitting
                          ? "Saving..."
                          : editRow
                          ? "Update Category"
                          : "Add Category 🚀"}
                      </Button>
                    </motion.div>
                  </Box>
                </form>
              </motion.div>
            </Box>
          )}
        </AnimatePresence>
      </Modal>

      {/* ── Delete Confirm Modal ── */}
      <Modal open={!!deleteId} onClose={() => setDeleteId(null)}>
        <Box
          sx={{
            position: "fixed",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backdropFilter: "blur(4px)",
            backgroundColor: "rgba(0,0,0,0.4)",
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              background: "#fff",
              borderRadius: 16,
              padding: 28,
              maxWidth: 380,
              width: "90%",
              textAlign: "center",
            }}
          >
            <DeleteIcon sx={{ fontSize: 48, color: "#ef4444", mb: 1 }} />
            <Typography variant="h6" fontWeight="bold" mb={1}>
              Delete Category?
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
              This action cannot be undone.
            </Typography>
            <Box className="flex gap-3">
              <Button
                fullWidth
                variant="outlined"
                onClick={() => setDeleteId(null)}
                sx={{ borderRadius: "10px" }}
              >
                Cancel
              </Button>
              <Button
                fullWidth
                variant="contained"
                onClick={() => handleDelete(deleteId)}
                sx={{
                  borderRadius: "10px",
                  background: "#ef4444",
                  "&:hover": { background: "#dc2626" },
                }}
              >
                Delete
              </Button>
            </Box>
          </motion.div>
        </Box>
      </Modal>
    </Box>
  );
};

export default CategoryMaster;
