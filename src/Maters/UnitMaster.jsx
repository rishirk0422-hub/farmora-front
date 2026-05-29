import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import api from "../services/api";
import { useTheme } from "../hooks/useTheme";
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
  Scale as ScaleIcon,
} from "@mui/icons-material";

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Inter:wght@400;500;600&display=swap');`;

const tokens = (dark) => ({
  bg: dark ? "#080f1a" : "#f0fdf4",
  card: dark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.9)",
  cardBorder: dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)",
  text: dark ? "#e2e8f0" : "#0f1a10",
  muted: dark ? "rgba(255,255,255,0.38)" : "rgba(0,0,0,0.45)",
  modalBg: dark ? "rgba(10,20,30,0.97)" : "rgba(255,255,255,0.98)",
  inputSx: {
    "& .MuiOutlinedInput-root.Mui-focused fieldset": { borderColor: "#16c784" },
    "& .MuiInputLabel-root.Mui-focused": { color: "#16c784" },
  },
});

const schema = yup.object({
  unit_name: yup.string().required("Unit name is required").min(1),
  unit_symbol: yup.string().required("Symbol is required").min(1),
  unit_description: yup.string().required("Description is required").min(5),
});

const fmtDate = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";

const ModalActions = ({ onCancel, submitting, editRow }) => (
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
        {submitting ? "Saving..." : editRow ? "Update Unit" : "Add Unit"}
      </Button>
    </motion.div>
  </Box>
);

const UnitMaster = () => {
  const { dark } = useTheme();
  const T = tokens(dark);
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editRow, setEditRow] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const fetch = async () => {
    try {
      setLoading(true);
      const r = await api.get("/masters/units");
      setUnits(r.data);
    } catch {
      toast.error("Failed to load units");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetch();
  }, []);

  const openAdd = () => {
    setEditRow(null);
    reset({ unit_name: "", unit_symbol: "", unit_description: "" });
    setModalOpen(true);
  };
  const openEdit = (r) => {
    setEditRow(r);
    reset({
      unit_name: r.unit_name,
      unit_symbol: r.unit_symbol,
      unit_description: r.unit_description,
    });
    setModalOpen(true);
  };
  const close = () => {
    setModalOpen(false);
    setEditRow(null);
    reset();
  };

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);
      editRow
        ? await api.put(`/masters/units/${editRow.id}`, data)
        : await api.post("/masters/units", data);
      toast.success(editRow ? "Unit updated ✅" : "Unit added 🚀");
      close();
      fetch();
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/masters/units/${id}`);
      toast.success("Deleted");
      setDeleteId(null);
      fetch();
    } catch {
      toast.error("Delete failed");
    }
  };

  const thRow = {
    padding: "12px 16px",
    textAlign: "left",
    fontWeight: 600,
    color: "#16c784",
    whiteSpace: "nowrap",
    fontSize: "0.75rem",
    letterSpacing: "0.06em",
  };
  const tdRow = { padding: "12px 16px" };

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
            right: "15%",
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: `radial-gradient(circle,#3d9cf5${
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
        {/* header */}
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
            <ScaleIcon
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
                Unit Master
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: T.muted, fontSize: "0.78rem" }}
              >
                Manage units of measurement
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

        {/* table */}
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
                    "Unit Name",
                    "Symbol",
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
                      colSpan={9}
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
                ) : units.length === 0 ? (
                  <tr>
                    <td
                      colSpan={9}
                      style={{
                        textAlign: "center",
                        padding: 48,
                        color: T.muted,
                      }}
                    >
                      No units yet. Add your first one!
                    </td>
                  </tr>
                ) : (
                  units.map((row, i) => (
                    <motion.tr
                      key={row.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                      style={{
                        borderBottom: `1px solid ${T.cardBorder}`,
                        transition: "background 0.15s",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = dark
                          ? "rgba(22,199,132,0.04)"
                          : "rgba(22,199,132,0.05)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "transparent")
                      }
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
                        {row.unit_name}
                      </td>
                      <td style={tdRow}>
                        <Chip
                          label={row.unit_symbol}
                          size="small"
                          sx={{
                            background: "#dcfce7",
                            color: "#16a34a",
                            fontWeight: 700,
                            fontFamily: "monospace",
                            fontSize: "0.72rem",
                          }}
                        />
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
                        {row.unit_description}
                      </td>
                      <td style={tdRow}>
                        <Chip
                          label={row.created_by || "System"}
                          size="small"
                          sx={{
                            background: "#dcfce7",
                            color: "#16a34a",
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
                            background: dark ? "#1a2e1a" : "#f0fdf4",
                            color: "#15803d",
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
        </motion.div>

        {/* Add/Edit Modal */}
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
                      <ScaleIcon sx={{ color: "#16c784" }} />
                      <Typography
                        variant="h6"
                        fontWeight="800"
                        sx={{
                          fontFamily: "'Syne',sans-serif",
                          color: T.text,
                          fontSize: { xs: "1rem", sm: "1.2rem" },
                        }}
                      >
                        {editRow ? "Edit Unit" : "Add New Unit"}
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
                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                        gap: 2,
                      }}
                    >
                      <TextField
                        label="Unit Name"
                        {...register("unit_name")}
                        error={!!errors.unit_name}
                        helperText={errors.unit_name?.message}
                        fullWidth
                        autoFocus
                        size="small"
                        placeholder="e.g. Kilogram"
                        sx={T.inputSx}
                        InputProps={{ style: { color: T.text } }}
                        InputLabelProps={{ style: { color: T.muted } }}
                      />
                      <TextField
                        label="Symbol"
                        {...register("unit_symbol")}
                        error={!!errors.unit_symbol}
                        helperText={errors.unit_symbol?.message}
                        fullWidth
                        size="small"
                        placeholder="e.g. kg"
                        sx={T.inputSx}
                        InputProps={{ style: { color: T.text } }}
                        InputLabelProps={{ style: { color: T.muted } }}
                      />
                    </Box>
                    <TextField
                      label="Unit Description"
                      {...register("unit_description")}
                      error={!!errors.unit_description}
                      helperText={errors.unit_description?.message}
                      fullWidth
                      multiline
                      rows={3}
                      size="small"
                      placeholder="e.g. Standard unit of mass"
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

        {/* Delete Modal */}
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
                Delete Unit?
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

export default UnitMaster;
