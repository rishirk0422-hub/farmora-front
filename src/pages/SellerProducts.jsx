import { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Button,
} from "@mui/material";
import api from "../services/api";

const SellerProducts = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await api.get("/products");
      setProducts(res.data);
    };

    fetchProducts();
  }, []);

  return (
    <Box p={4}>
      <Typography variant="h4" mb={3}>
        My Products
      </Typography>

      <Grid container spacing={3}>
        {products.map((p) => (
          <Grid item xs={12} md={4} key={p._id}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h6">{p.title}</Typography>

                <Typography variant="body2" color="text.secondary" mt={1}>
                  {p.description}
                </Typography>

                <Typography mt={2}>
                  💰 Price: ₹{p.price}
                </Typography>

                <Typography>
                  📦 Stock: {p.quantity} {p.unit}
                </Typography>

                <Typography mt={1}>
                  📂 Category: <Chip label={p.category} size="small" />
                </Typography>

                <Button
                  variant="outlined"
                  color="primary"
                  sx={{ mt: 2 }}
                  fullWidth
                >
                  Edit Product
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default SellerProducts;