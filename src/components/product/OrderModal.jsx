
import { useState } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button
} from "@mui/material";
import api from "../../services/api"
import { toast } from "react-hot-toast";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  borderRadius: "16px",
  padding: "24px"
};

const OrderModal = ({ open, handleClose, product }) => {
  const [quantity, setQuantity] = useState(1);
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  const handleOrder = async () => {
    try {
      setLoading(true);

      await api.post("/orders", {
        productId: product._id,
        quantity,
        deliveryAddress: address
      });

      toast.success("Order placed successfully 🚀");
      handleClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          ...style,
          bgcolor: "background.paper",
          boxShadow: 24
        }}
      >
        <Typography variant="h6" mb={2}>
          Place Order
        </Typography>

        <TextField
          fullWidth
          label="Product"
          value={product.title}
          disabled
          margin="normal"
        />

        <TextField
          fullWidth
          type="number"
          label="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          margin="normal"
        />

        <TextField
          fullWidth
          label="Delivery Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          margin="normal"
          multiline
          rows={3}
        />

        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 2 }}
          onClick={handleOrder}
          disabled={loading}
        >
          {loading ? "Placing..." : "Confirm Order"}
        </Button>
      </Box>
    </Modal>
  );
};

export default OrderModal;
