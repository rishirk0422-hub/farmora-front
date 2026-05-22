import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "../utils/validators";
import api from "../services/api";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

import { motion } from "framer-motion";
import { TextField, Button, Typography, Box } from "@mui/material";
import { useAuth } from "../hooks/useAuth";

const Login = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(loginSchema)
  });

  const { login } = useAuth();

const onSubmit = async (data) => {
  try {
    const res = await api.post("/auth/login", data);

    const { accessToken, user } = res.data;

    login(user, accessToken); 

    toast.success("Welcome back 🚀");
    navigate("/dashboard");

  } catch (err) {
    toast.error(err.response?.data?.message || "Login failed");
  }
};

  return (
    <Box className="flex justify-center items-center min-h-screen px-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="glass p-8 w-full max-w-md rounded-3xl relative overflow-hidden"
      >
        <Typography variant="h4" textAlign="center" mb={2} fontWeight="bold">
          Welcome Back 🌱
        </Typography>

        <Typography textAlign="center" mb={4} className="opacity-70">
          Login to your AgroLink account
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          <TextField
            label="Email"
            fullWidth
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
          />

          <TextField
            label="Password"
            type="password"
            fullWidth
            {...register("password")}
            error={!!errors.password}
            helperText={errors.password?.message}
          />

          <Button type="submit" fullWidth className="btn-primary mt-2">
            Login 🚀
          </Button>
        </form>

        <Typography textAlign="center" mt={3}>
          Don’t have an account?{" "}
          <Link to="/signup" className="text-green-400">
            Signup
          </Link>
        </Typography>
      </motion.div>
    </Box>
  );
};

export default Login;