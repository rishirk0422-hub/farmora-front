import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="px-6 pb-6 pt-16">
      <h1 className="text-2xl font-bold mb-6">
        {user?.role === "seller"
          ? "👨‍🌾 Seller Dashboard"
          : "🛒 Buyer Dashboard"}
      </h1>
      {user?.role === "seller" && (
        <div className="space-y-4">
          <button
            onClick={() => navigate("/seller/add-product")}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            ➕ Add Product
          </button>

          <button
            onClick={() => navigate("/seller/products")}
            className="bg-blue-600 text-white px-4 py-2 rounded ml-2"
          >
            📦 My Products
          </button>

          <button
            onClick={() => navigate("/orders")}
            className="bg-purple-600 text-white px-4 py-2 rounded ml-2"
          >
            📑 Incoming Orders
          </button>
        </div>
      )}
      {user?.role === "buyer" && (
        <div className="space-y-4">
          <button
            onClick={() => navigate("/products")}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            🛒 Browse Products
          </button>

          <button
            onClick={() => navigate("/orders")}
            className="bg-blue-600 text-white px-4 py-2 rounded ml-2"
          >
            📦 My Orders
          </button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;