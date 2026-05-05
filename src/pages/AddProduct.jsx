import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  MenuItem,
  Grid,
} from "@mui/material";
import api from "../services/api"
import { useNavigate } from "react-router-dom";

const AddProduct = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    quantity: "",
    unit: "kg",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    setImage(file);

    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();

      Object.keys(form).forEach((key) => {
        formData.append(key, form[key]);
      });

      if (image) formData.append("images", image);

      await api.post("/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Product added 🚀");
      navigate("/seller/products");

    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  return (
    <Box display="flex" justifyContent="center" mt={4} pt={5} >
      <Paper sx={{ p: 3, width: 600, borderRadius: 3 }}>
        
        <Typography variant="h6" mb={2}>
          Add Product
        </Typography>

        {/* GRID FORM */}
        <Grid container spacing={2}>

          <Grid item xs={6}>
            <TextField
              size="small"
              fullWidth
              label="Title"
              name="title"
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              size="small"
              fullWidth
              label="Category"
              name="category"
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              size="small"
              fullWidth
              label="Price"
              type="number"
              name="price"
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              size="small"
              fullWidth
              label="Quantity"
              type="number"
              name="quantity"
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              size="small"
              select
              fullWidth
              label="Unit"
              name="unit"
              value={form.unit}
              onChange={handleChange}
            >
              <MenuItem value="kg">Kg</MenuItem>
              <MenuItem value="quintal">Quintal</MenuItem>
              <MenuItem value="ton">Ton</MenuItem>
            </TextField>
          </Grid>

          {/* DESCRIPTION FULL WIDTH */}
          <Grid item xs={12}>
            <TextField
              size="small"
              fullWidth
              multiline
              rows={2}
              label="Description"
              name="description"
              onChange={handleChange}
            />
          </Grid>

        </Grid>

        {/* IMAGE UPLOAD */}
        <Box mt={2}>
          <Button
            variant="outlined"
            component="label"
            size="small"
          >
            Upload Image
            <input type="file" hidden onChange={handleImage} />
          </Button>
        </Box>

        {/* PREVIEW */}
        {preview && (
          <Box mt={2}>
            <img
              src={preview}
              alt="preview"
              className="rounded-lg w-full h-40 object-cover"
            />
          </Box>
        )}

        {/* SUBMIT */}
        <Button
          fullWidth
          variant="contained"
          color="success"
          sx={{ mt: 3 }}
          onClick={handleSubmit}
        >
          Add Product
        </Button>

      </Paper>
    </Box>
  );
};

export default AddProduct;