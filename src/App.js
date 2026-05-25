import { Route, Routes } from "react-router-dom";
import { useSocketEvents } from "./hooks/useSocketEvents";

// Layouts
import { MainLayout } from "./layouts/MainLayout";

// Pages
import About from "./pages/About";
import Cart from "./pages/Cart";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Orders from "./pages/Orders";
import ProductDetails from "./pages/ProductDetails";
import Products from "./pages/Products";
import Signup from "./pages/Signup";

// Components
import ProtectedRoute from "./components/common/ProtectedRoute";
import AddProduct from "./pages/AddProduct";
import SellerProducts from "./pages/SellerProducts";

// Masters
import CategoryMaster from "./Maters/CategoryMaster";

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

        {/* Masters */}
        <Route path="/masters/category" element={<CategoryMaster />} />


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