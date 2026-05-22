import { useEffect, useState } from "react";
import api from "../services/api"
import ProductCard from "../components/product/ProductCard"
import ProductCardSkeleton from "../components/product/ProductCardSkeleton";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/products");
        setProducts(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="px-4 pb-4 pt-16">

      <h2 className="text-2xl font-bold mb-4">Products</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading &&
          Array.from({ length: 6 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        {!loading &&
          products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}

      </div>
    </div>
  );
};

export default Products;