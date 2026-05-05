import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    api.get(`/products/${id}`).then(res => setProduct(res.data));
  }, [id]);

  if (!product) return <p>Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto">
      <img
        src={product.images?.[0]?.url}
        className="w-full h-60 object-cover rounded"
      />
      <h2 className="text-2xl font-bold mt-4">{product.title}</h2>
      <p>{product.description}</p>
      <p className="text-xl mt-2">₹{product.price}</p>
    </div>
  );
};

export default ProductDetails;