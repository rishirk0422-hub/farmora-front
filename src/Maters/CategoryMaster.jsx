import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import api from "../services/api";
import { useTheme } from "../hooks/useTheme";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import {
  TextField, Button, Typography, Box, Modal,
  IconButton, Tooltip, Chip, Pagination, Select,
  MenuItem, FormControl,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
  Category as CategoryIcon,
} from "@mui/icons-material";

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Inter:wght@400;500;600&display=swap');`;

const tokens = (dark) => ({
  bg:         dark ? "#080f1a"                 : "#f0fdf4",
  card:       dark ? "rgba(255,255,255,0.04)"  : "rgba(255,255,255,0.9)",
  cardBorder: dark ? "rgba(255,255,255,0.07)"  : "rgba(0,0,0,0.08)",
  text:       dark ? "#e2e8f0"                 : "#0f1a10",
  muted:      dark ? "rgba(255,255,255,0.38)"  : "rgba(0,0,0,0.45)",
  modalBg:    dark ? "rgba(10,20,30,0.97)"     : "rgba(255,255,255,0.98)",
  pageHover:  dark ? "rgba(22,199,132,0.15)"   : "rgba(22,199,132,0.18)",
  // chip colours — explicit per theme so they never go white-on-white in dark
  chipCreatedBg:  dark ? "rgba(22,199,132,0.15)"  : "#dcfce7",
  chipCreatedFg:  dark ? "#4ade80"                : "#16a34a",
  chipModifiedBg: dark ? "rgba(21,128,61,0.18)"   : "#f0fdf4",
  chipModifiedFg: dark ? "#86efac"                : "#15803d",
  chipSymbolBg:   dark ? "rgba(22,199,132,0.12)"  : "#dcfce7",
  chipSymbolFg:   dark ? "#4ade80"                : "#16a34a",
  inputSx: {
    "& .MuiOutlinedInput-root.Mui-focused fieldset": { borderColor: "#16c784" },
    "& .MuiInputLabel-root.Mui-focused": { color: "#16c784" },
  },
});

const schema = yup.object({
  category_name:        yup.string().required("Category name is required").min(2, "Min 2 characters"),
  category_description: yup.string().required("Description is required").min(5, "Min 5 characters"),
});

const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";

const toArray = (data) => {
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.data)) return data.data;
  if (data && Array.isArray(data.categories)) return data.categories;
  if (data && Array.isArray(data.results)) return data.results;
  return [];
};

const thRow = {
  padding: "12px 16px", textAlign: "left", fontWeight: 600,
  color: "#16c784", whiteSpace: "nowrap", fontSize: "0.75rem", letterSpacing: "0.06em",
};
const tdRow = { padding: "12px 16px" };

const ModalActions = ({ onCancel, submitting, editRow }) => (
  <Box sx={{ display: "flex", gap: 1.5, mt: 2 }}>
    <Button
      onClick={onCancel} variant="outlined" size="small"
      sx={{ borderRadius: "10px", borderColor: "#d1d5db", color: "#6b7280", px: 2.5, py: 0.8, fontSize: "0.8rem", whiteSpace: "nowrap", minWidth: "auto", flexShrink: 0 }}
    >
      Cancel
    </Button>
    <motion.div style={{ flex: 1 }} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
      <Button
        type="submit" variant="contained" fullWidth disabled={submitting} size="small"
        sx={{ borderRadius: "10px", background: "linear-gradient(90deg,#22c55e,#16a34a)", fontWeight: "bold", py: 0.9, fontSize: "0.85rem", whiteSpace: "nowrap", boxShadow: "0 4px 15px rgba(34,197,94,0.3)" }}
      >
        {submitting ? "Saving..." : editRow ? "Update Category" : "Add Category"}
      </Button>
    </motion.div>
  </Box>
);

const ROWS_OPTIONS = [5, 10, 20, 50];

const CategoryMaster = () => {
  const { dark } = useTheme();
  const T = tokens(dark);

  const [categories, setCategories] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [modalOpen, setModalOpen]   = useState(false);
  const [editRow, setEditRow]       = useState(null);
  const [deleteId, setDeleteId]     = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // pagination state
  const [page, setPage]               = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalPages, setTotalPages]   = useState(1);
  const [totalRows, setTotalRows]     = useState(0);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const loadCategories = async (p = page, limit = rowsPerPage) => {
    try {
      setLoading(true);
      const r = await api.get("/masters/categories", { params: { page: p, limit } });
      if (r.data && r.data.pagination) {
        setCategories(toArray(r.data.data));
        setTotalPages(r.data.pagination.totalPages);
        setTotalRows(r.data.pagination.total);
      } else {
        const all = toArray(r.data);
        setCategories(all);
        setTotalPages(1);
        setTotalRows(all.length);
      }
    } catch {
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadCategories(page, rowsPerPage); }, [page, rowsPerPage]); // eslint-disable-line

  const handlePageChange = (_, value) => setPage(value);

  const handleRowsChange = (e) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  };

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
  const close = () => { setModalOpen(false); setEditRow(null); reset(); };

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);
      if (editRow) {
        await api.put(`/masters/categories/${editRow.id}`, data);
        toast.success("Category updated ✅");
        loadCategories(page, rowsPerPage);
      } else {
        await api.post("/masters/categories", data);
        toast.success("Category added 🚀");
        setPage(1);
        loadCategories(1, rowsPerPage);
      }
      close();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/masters/categories/${id}`);
      toast.success("Deleted");
      setDeleteId(null);
      const newTotal      = totalRows - 1;
      const newTotalPages = Math.max(1, Math.ceil(newTotal / rowsPerPage));
      const safePage      = Math.min(page, newTotalPages);
      setPage(safePage);
      loadCategories(safePage, rowsPerPage);
    } catch {
      toast.error("Delete failed");
    }
  };

  // ── MUI Pagination sx — reads from T so it reacts to dark/light toggle ────
  const paginationSx = {
    "& .MuiPaginationItem-root": {
      color: T.muted,
      borderRadius: "8px",
      fontFamily: "'Inter', sans-serif",
      fontSize: "0.8rem",
      fontWeight: 500,
      transition: "all 0.15s",
      "&:hover": { background: T.pageHover, color: "#16c784" },
    },
    "& .MuiPaginationItem-root.Mui-selected": {
      background: "linear-gradient(135deg,#22c55e,#16a34a)",
      color: "#fff",
      fontWeight: 700,
      boxShadow: "0 3px 10px rgba(34,197,94,0.35)",
      "&:hover": { background: "linear-gradient(135deg,#16a34a,#15803d)" },
    },
    "& .MuiPaginationItem-ellipsis": { color: T.muted },
    "& .MuiPaginationItem-previousNext": {
      border: `1px solid ${T.cardBorder}`,
      color: dark ? "#16c784" : "#16a34a",
      "&:hover": { background: T.pageHover, borderColor: "#16c784" },
      "&.Mui-disabled": { opacity: 0.3, borderColor: T.cardBorder },
    },
  };

  const selectSx = {
    color: T.text,
    fontSize: "0.8rem",
    fontFamily: "'Inter', sans-serif",
    "& .MuiOutlinedInput-notchedOutline": { borderColor: T.cardBorder, borderRadius: "8px" },
    "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#16c784" },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#16c784" },
    "& .MuiSvgIcon-root": { color: T.muted },
    "& .MuiSelect-select": { py: 0.7, px: 1.4 },
  };

  const menuSx = {
    "& .MuiPaper-root": {
      background: T.modalBg,
      border: `1px solid ${T.cardBorder}`,
      borderRadius: "10px",
      boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
    },
    "& .MuiMenuItem-root": {
      fontSize: "0.8rem",
      color: T.text,
      fontFamily: "'Inter', sans-serif",
      "&:hover":               { background: T.pageHover, color: "#16c784" },
      "&.Mui-selected":        { background: dark ? "rgba(22,199,132,0.12)" : "rgba(22,199,132,0.1)", color: "#16c784", fontWeight: 600 },
      "&.Mui-selected:hover":  { background: T.pageHover },
    },
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: T.bg,
        fontFamily: "'Inter',sans-serif",
        color: T.text,
        transition: "background 0.3s, color 0.3s",
      }}
    >
      <style>{FONTS}</style>

      {/* ambient glow */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "15%",
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: `radial-gradient(circle,#16c784${
              dark ? "10" : "16"
            } 0%,transparent 65%)`,
          }}
        />
      </div>

      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: 1200,
          margin: "0 auto",
          padding: "96px 20px 80px",
        }}
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 28,
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <CategoryIcon
              sx={{ fontSize: { xs: 26, sm: 30 }, color: "#16c784" }}
            />
            <Box>
              <Typography
                variant="h5"
                fontWeight="800"
                sx={{
                  fontFamily: "'Syne',sans-serif",
                  color: T.text,
                  fontSize: { xs: "1.1rem", sm: "1.4rem" },
                }}
              >
                Category Master
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: T.muted, fontSize: "0.78rem" }}
              >
                Manage product categories
                {totalRows > 0 && (
                  <span
                    style={{ marginLeft: 8, color: "#16c784", fontWeight: 600 }}
                  >
                    · {totalRows} total
                  </span>
                )}
              </Typography>
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
        </motion.div>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.9 }}
          style={{
            height: 1,
            background: "linear-gradient(90deg,#16c78455,transparent)",
            marginBottom: 24,
            transformOrigin: "left",
          }}
        />

        {/* Table card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{
            background: T.card,
            border: `1px solid ${T.cardBorder}`,
            borderRadius: 18,
            overflow: "hidden",
            boxShadow: "0 2px 16px rgba(0,0,0,0.07)",
          }}
        >
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                fontSize: "0.85rem",
                borderCollapse: "collapse",
              }}
            >
              <thead>
                <tr
                  style={{
                    background: dark
                      ? "rgba(22,199,132,0.06)"
                      : "rgba(22,199,132,0.08)",
                    borderBottom: `1px solid ${T.cardBorder}`,
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
                    <th key={h} style={thRow}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={8}
                      style={{ textAlign: "center", padding: 48 }}
                    >
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          repeat: Infinity,
                          duration: 1,
                          ease: "linear",
                        }}
                        style={{
                          width: 32,
                          height: 32,
                          border: "3px solid #16c784",
                          borderTopColor: "transparent",
                          borderRadius: "50%",
                          margin: "0 auto",
                        }}
                      />
                    </td>
                  </tr>
                ) : categories.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      style={{
                        textAlign: "center",
                        padding: 48,
                        color: T.muted,
                      }}
                    >
                      No categories yet. Add your first one!
                    </td>
                  </tr>
                ) : (
                  categories.map((row, i) => (
                    <motion.tr
                      key={row.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                      style={{
                        borderBottom: `1px solid ${T.cardBorder}`,
                        transition: "background 0.15s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = dark
                          ? "rgba(22,199,132,0.04)"
                          : "rgba(22,199,132,0.05)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "transparent";
                      }}
                    >
                      <td
                        style={{
                          ...tdRow,
                          fontFamily: "monospace",
                          fontSize: "0.72rem",
                          color: T.muted,
                        }}
                      >
                        #{row.id}
                      </td>
                      <td style={{ ...tdRow, fontWeight: 600, color: T.text }}>
                        {row.category_name}
                      </td>
                      <td
                        style={{
                          ...tdRow,
                          color: T.muted,
                          maxWidth: 200,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {row.category_description}
                      </td>
                      <td style={tdRow}>
                        <Chip
                          label={row.created_by || "System"}
                          size="small"
                          sx={{
                            background: T.chipCreatedBg,
                            color: T.chipCreatedFg,
                            fontWeight: 600,
                            fontSize: "0.7rem",
                          }}
                        />
                      </td>
                      <td
                        style={{
                          ...tdRow,
                          color: T.muted,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {fmtDate(row.created_date)}
                      </td>
                      <td style={tdRow}>
                        <Chip
                          label={row.last_modified_by || "—"}
                          size="small"
                          sx={{
                            background: T.chipModifiedBg,
                            color: T.chipModifiedFg,
                            fontSize: "0.7rem",
                          }}
                        />
                      </td>
                      <td
                        style={{
                          ...tdRow,
                          color: T.muted,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {fmtDate(row.last_modified_date)}
                      </td>
                      <td style={tdRow}>
                        <Box sx={{ display: "flex", gap: 0.5 }}>
                          <Tooltip title="Edit">
                            <IconButton
                              size="small"
                              onClick={() => openEdit(row)}
                              sx={{
                                color: "#16c784",
                                "&:hover": { background: "#dcfce7" },
                              }}
                            >
                              <EditIcon sx={{ fontSize: 17 }} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton
                              size="small"
                              onClick={() => setDeleteId(row.id)}
                              sx={{
                                color: "#ef4444",
                                "&:hover": { background: "#fee2e2" },
                              }}
                            >
                              <DeleteIcon sx={{ fontSize: 17 }} />
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

          {/* Pagination footer */}
          {!loading && totalRows > 0 && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: { xs: "center", sm: "space-between" },
                flexWrap: "wrap",
                gap: 2,
                px: { xs: 2, sm: 3 },
                py: 2,
                borderTop: `1px solid ${T.cardBorder}`,
                background: dark
                  ? "rgba(22,199,132,0.03)"
                  : "rgba(22,199,132,0.04)",
              }}
            >
              {/* rows-per-page + range label */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  flexWrap: "wrap",
                }}
              >
                <Typography
                  sx={{
                    fontSize: "0.78rem",
                    color: T.muted,
                    whiteSpace: "nowrap",
                  }}
                >
                  Rows per page
                </Typography>
                <FormControl size="small">
                  <Select
                    value={rowsPerPage}
                    onChange={handleRowsChange}
                    sx={selectSx}
                    MenuProps={{ sx: menuSx }}
                  >
                    {ROWS_OPTIONS.map((n) => (
                      <MenuItem key={n} value={n}>
                        {n}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Typography
                  sx={{
                    fontSize: "0.78rem",
                    color: T.muted,
                    whiteSpace: "nowrap",
                  }}
                >
                  {`${(page - 1) * rowsPerPage + 1}–${Math.min(
                    page * rowsPerPage,
                    totalRows
                  )} of ${totalRows}`}
                </Typography>
              </Box>

              {/* page buttons */}
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                shape="rounded"
                size="small"
                siblingCount={1}
                boundaryCount={1}
                sx={paginationSx}
              />
            </Box>
          )}
        </motion.div>

        {/* Add / Edit Modal */}
        <Modal open={modalOpen} onClose={close}>
          <AnimatePresence>
            {modalOpen && (
              <Box
                sx={{
                  position: "fixed",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  p: { xs: 1.5, sm: 2 },
                  backdropFilter: "blur(6px)",
                  backgroundColor: "rgba(0,0,0,0.45)",
                }}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.88, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.88, y: 30 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  style={{
                    background: T.modalBg,
                    borderRadius: 20,
                    padding: "24px",
                    width: "100%",
                    maxWidth: 500,
                    boxShadow: "0 25px 60px rgba(0,0,0,0.25)",
                    border: `1px solid ${T.cardBorder}`,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      mb: 3,
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <CategoryIcon sx={{ color: "#16c784" }} />
                      <Typography
                        variant="h6"
                        fontWeight="800"
                        sx={{
                          fontFamily: "'Syne',sans-serif",
                          color: T.text,
                          fontSize: { xs: "1rem", sm: "1.2rem" },
                        }}
                      >
                        {editRow ? "Edit Category" : "Add New Category"}
                      </Typography>
                    </Box>
                    <IconButton
                      onClick={close}
                      size="small"
                      sx={{ color: T.muted }}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </Box>
                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 16,
                    }}
                  >
                    <TextField
                      label="Category Name"
                      {...register("category_name")}
                      error={!!errors.category_name}
                      helperText={errors.category_name?.message}
                      fullWidth
                      autoFocus
                      size="small"
                      sx={T.inputSx}
                      InputProps={{ style: { color: T.text } }}
                      InputLabelProps={{ style: { color: T.muted } }}
                    />
                    <TextField
                      label="Category Description"
                      {...register("category_description")}
                      error={!!errors.category_description}
                      helperText={errors.category_description?.message}
                      fullWidth
                      multiline
                      rows={3}
                      size="small"
                      sx={T.inputSx}
                      InputProps={{ style: { color: T.text } }}
                      InputLabelProps={{ style: { color: T.muted } }}
                    />
                    <ModalActions
                      onCancel={close}
                      submitting={submitting}
                      editRow={editRow}
                    />
                  </form>
                </motion.div>
              </Box>
            )}
          </AnimatePresence>
        </Modal>

        {/* Delete Confirm Modal */}
        <Modal open={!!deleteId} onClose={() => setDeleteId(null)}>
          <Box
            sx={{
              position: "fixed",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              p: 2,
              backdropFilter: "blur(6px)",
              backgroundColor: "rgba(0,0,0,0.45)",
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                background: T.modalBg,
                borderRadius: 16,
                padding: 28,
                maxWidth: 360,
                width: "100%",
                textAlign: "center",
                border: `1px solid ${T.cardBorder}`,
              }}
            >
              <DeleteIcon sx={{ fontSize: 44, color: "#ef4444", mb: 1 }} />
              <Typography
                variant="h6"
                fontWeight="bold"
                mb={0.5}
                sx={{ color: T.text }}
              >
                Delete Category?
              </Typography>
              <Typography variant="body2" sx={{ color: T.muted }} mb={3}>
                This action cannot be undone.
              </Typography>
              <Box sx={{ display: "flex", gap: 1.5 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  size="small"
                  onClick={() => setDeleteId(null)}
                  sx={{ borderRadius: "10px", py: 0.9 }}
                >
                  Cancel
                </Button>
                <Button
                  fullWidth
                  variant="contained"
                  size="small"
                  onClick={() => handleDelete(deleteId)}
                  sx={{
                    borderRadius: "10px",
                    py: 0.9,
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
      </div>
    </div>
  );
};

export default CategoryMaster;