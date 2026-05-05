import { useNavigate } from "react-router-dom";

const SellerDashboard = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h2>Seller Dashboard</h2>

      <button
        onClick={() => navigate("/seller/add-product")}
        className="bg-green-600 text-white px-4 py-2"
      >
        + Add Product
      </button>
    </div>
  );
};

export default SellerDashboard;