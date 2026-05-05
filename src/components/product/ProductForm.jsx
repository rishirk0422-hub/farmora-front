import { useForm } from "react-hook-form";
import api from "../../services/api";
import { toast } from "react-toastify";

const ProductForm = () => {
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      Object.keys(data).forEach(key => {
        if (key === "images") {
          for (let file of data.images) {
            formData.append("images", file);
          }
        } else {
          formData.append(key, data[key]);
        }
      });

      await api.post("/products", formData);
      toast.success("Product added!");
    } catch {
      toast.error("Error");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <input {...register("title")} placeholder="Title" />
      <input {...register("price")} placeholder="Price" />
      <input type="file" multiple {...register("images")} />
      <button className="btn-gradient">Add Product</button>
    </form>
  );
};

export default ProductForm;