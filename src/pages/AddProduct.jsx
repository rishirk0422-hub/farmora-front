import { useState, useEffect } from "react";
import {
  Box, TextField, Button, Typography, Paper,
  MenuItem, Grid, CircularProgress, InputAdornment,
} from "@mui/material";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

const AddProduct = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    quantity: "",
    unit: "",
  });

  const [categories, setCategories] = useState([]);
  const [units, setUnits] = useState([]);
  const [loadingMasters, setLoadingMasters] = useState(true);

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // ── Fetch masters on mount ────────────────────────────────────────────────
  useEffect(() => {
    const fetchMasters = async () => {
      try {
        const [catRes, unitRes] = await Promise.all([
          api.get("/masters/categories"),
          api.get("/masters/units"),
        ]);
        setCategories(catRes.data);
        setUnits(unitRes.data);
      } catch {
        console.error("Failed to load masters");
      } finally {
        setLoadingMasters(false);
      }
    };
    fetchMasters();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      const formData = new FormData();
      Object.keys(form).forEach((key) => formData.append(key, form[key]));
      if (image) formData.append("images", image);

      await api.post("/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Product added 🚀");
      navigate("/seller/products");
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box display="flex" justifyContent="center" mt={4} pt={5}>
      <Paper sx={{ p: 3, width: 600, borderRadius: 3 }}>
        <Typography variant="h6" mb={2}>
          Add Product
        </Typography>

        <Grid container spacing={2}>
          {/* Title */}
          <Grid item xs={6}>
            <TextField size="small" fullWidth label="Title" name="title" onChange={handleChange} />
          </Grid>

          {/* Category — dynamic */}
          <Grid item xs={6}>
            <TextField
              size="small"
              select
              fullWidth
              label="Category"
              name="category"
              value={form.category}
              onChange={handleChange}
              InputProps={loadingMasters ? {
                endAdornment: <InputAdornment position="end"><CircularProgress size={16} /></InputAdornment>
              } : {}}
            >
              {categories.length === 0 && !loadingMasters ? (
                <MenuItem disabled value="">No categories found</MenuItem>
              ) : (
                categories.map((cat) => (
                  <MenuItem key={cat.id} value={cat.category_name}>
                    {cat.category_name}
                  </MenuItem>
                ))
              )}
            </TextField>
          </Grid>

          {/* Price */}
          <Grid item xs={6}>
            <TextField size="small" fullWidth label="Price" type="number" name="price" onChange={handleChange} />
          </Grid>

          {/* Quantity */}
          <Grid item xs={6}>
            <TextField size="small" fullWidth label="Quantity" type="number" name="quantity" onChange={handleChange} />
          </Grid>

          {/* Unit — dynamic */}
          <Grid item xs={6}>
            <TextField
              size="small"
              select
              fullWidth
              label="Unit"
              name="unit"
              value={form.unit}
              onChange={handleChange}
              InputProps={loadingMasters ? {
                endAdornment: <InputAdornment position="end"><CircularProgress size={16} /></InputAdornment>
              } : {}}
            >
              {units.length === 0 && !loadingMasters ? (
                <MenuItem disabled value="">No units found</MenuItem>
              ) : (
                units.map((unit) => (
                  <MenuItem key={unit.id} value={unit.unit_symbol}>
                    {unit.unit_name} ({unit.unit_symbol})
                  </MenuItem>
                ))
              )}
            </TextField>
          </Grid>

          {/* Description */}
          <Grid item xs={12}>
            <TextField size="small" fullWidth multiline rows={2} label="Description" name="description" onChange={handleChange} />
          </Grid>
        </Grid>

        {/* Image Upload */}
        <Box mt={2}>
          <Button variant="outlined" component="label" size="small">
            Upload Image
            <input type="file" hidden onChange={handleImage} accept="image/*" />
          </Button>
        </Box>

        {preview && (
          <Box mt={2}>
            <img src={preview} alt="preview" className="rounded-lg w-full h-40 object-cover" />
          </Box>
        )}

        <Button
          fullWidth
          variant="contained"
          color="success"
          sx={{ mt: 3 }}
          onClick={handleSubmit}
          disabled={submitting}
        >
          {submitting ? "Adding..." : "Add Product"}
        </Button>
      </Paper>
    </Box>
  );
};

export default AddProduct;
