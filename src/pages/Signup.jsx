import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { signupSchema } from "../utils/validators";
import api from "../services/api";
import { toast } from "react-toastify";
import Select from "react-select";
import { useNavigate } from "react-router-dom";

import {
  TextField,
  Button,
  Typography,
  Box
} from "@mui/material";

import { motion } from "framer-motion";

const roleOptions = [
  { value: "buyer", label: "Buyer" },
  { value: "seller", label: "Seller" }
];

const Signup = () => {
  const navigate = useNavigate();

  const {
    control,
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(signupSchema)
  });

  const onSubmit = async (data) => {
    try {
      await api.post("/auth/signup", data);
      toast.success("Signup successful! Verify OTP 🚀");

      // optional redirect after signup
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Error");
    }
  };

  return (
    <Box className="flex justify-center items-center min-h-screen p-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="glass p-8 w-full max-w-3xl"
      >
        {/* HEADER */}
        <div className="flex flex-col items-center mb-6">
          <Typography variant="h4" fontWeight="bold">
            Create Account
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Join Farmora Marketplace
          </Typography>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid md:grid-cols-2 gap-4"
        >
          {/* FULL NAME */}
          <TextField
            label="Full Name"
            {...register("fullName")}
            error={!!errors.fullName}
            helperText={errors.fullName?.message}
            fullWidth
          />

          {/* EMAIL */}
          <TextField
            label="Email"
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
            fullWidth
          />

          {/* PASSWORD */}
          <TextField
            label="Password"
            type="password"
            {...register("password")}
            error={!!errors.password}
            helperText={errors.password?.message}
            fullWidth
          />

          {/* CONFIRM PASSWORD */}
          <TextField
            label="Confirm Password"
            type="password"
            {...register("confirmPassword")}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
            fullWidth
          />

          {/* MOBILE */}
          <TextField
            label="Mobile"
            {...register("mobile")}
            error={!!errors.mobile}
            helperText={errors.mobile?.message}
            fullWidth
          />

          {/* ROLE SELECT */}
          <Controller
            name="role"
            control={control}
            render={({ field }) => (
              <div className="col-span-2">
                <Select
                  {...field}
                  options={roleOptions}
                  placeholder="Select Role"
                  onChange={(val) => field.onChange(val.value)}
                />
                {errors.role && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.role.message}
                  </p>
                )}
              </div>
            )}
          />

          {/* ADDRESS FIELDS */}
          <TextField
            label="Country"
            {...register("country")}
            error={!!errors.country}
            helperText={errors.country?.message}
            fullWidth
          />

          <TextField
            label="State"
            {...register("state")}
            error={!!errors.state}
            helperText={errors.state?.message}
            fullWidth
          />

          <TextField
            label="District"
            {...register("district")}
            error={!!errors.district}
            helperText={errors.district?.message}
            fullWidth
          />

          <TextField
            label="Tahsil"
            {...register("tahsil")}
            error={!!errors.tahsil}
            helperText={errors.tahsil?.message}
            fullWidth
          />

          <TextField
            label="Pincode"
            {...register("pincode")}
            error={!!errors.pincode}
            helperText={errors.pincode?.message}
            fullWidth
          />

          {/* SUBMIT BUTTON */}
          <Button
            type="submit"
            variant="contained"
            className="col-span-2"
            sx={{
              mt: 2,
              py: 1.5,
              borderRadius: "12px",
              background: "linear-gradient(90deg,#22c55e,#16a34a)",
              fontWeight: "bold"
            }}
          >
            Create Account 🚀
          </Button>

          {/* LOGIN REDIRECT */}
          <Box className="col-span-2 text-center mt-2">
            <Typography variant="body2">
              Already have an account?{" "}
              <span
                onClick={() => navigate("/login")}
                className="text-green-600 font-semibold cursor-pointer hover:underline"
              >
                Login instead
              </span>
            </Typography>
          </Box>
        </form>
      </motion.div>
    </Box>
  );
};

export default Signup;