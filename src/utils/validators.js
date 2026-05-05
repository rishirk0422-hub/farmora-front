import * as yup from "yup";

export const signupSchema = yup.object({
  fullName: yup.string().required(),
  email: yup.string().email().required(),
  password: yup.string().min(6).required(),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match"),
  mobile: yup.string().required(),
  role: yup.string().required(),
  country: yup.string().required(),
  state: yup.string().required(),
  district: yup.string().required(),
  tahsil: yup.string().required(),
  pincode: yup.string().required()
});

export const loginSchema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().required()
});