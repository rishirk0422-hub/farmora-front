import { Routes, Route } from "react-router-dom";
import { useSocketEvents } from "./hooks/useSocketEvents";

// Layouts
import { MainLayout } from "./layouts/MainLayout";
import DashboardLayout from "./layouts/DashboardLayout";

// Pages
import Home from "./pages/Home";
import About from "./pages/About";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";

// Components
import ProtectedRoute from "./components/common/ProtectedRoute";
import AddProduct from "./pages/AddProduct";
import SellerProducts from "./pages/SellerProducts";

function App() {
  // 🔔 Real-time socket listeners
  useSocketEvents();

  return (
    <Routes>
      {/* PUBLIC ROUTES WITH MAIN LAYOUT */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/dashboard" element={<Dashboard />} />

        {/* SELLER */}
        <Route path="/seller/add-product" element={<AddProduct />} />
        <Route path="/seller/products" element={<SellerProducts />} />

        {/* COMMON */}
        <Route path="/products" element={<Products />} />
        <Route path="/orders" element={<Orders />} />
      </Route>

      {/* AUTH ROUTES */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route
        path="/cart"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Cart />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/orders"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Orders />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* FALLBACK */}
      <Route
        path="*"
        element={<div className="text-center mt-20">404 Not Found</div>}
      />
    </Routes>
  );
}

export default App;