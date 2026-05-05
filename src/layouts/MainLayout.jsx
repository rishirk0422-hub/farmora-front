import { Outlet } from "react-router-dom";
import AnimatedBackground from "../components/common/AnimatedBackground";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";

export const MainLayout = () => {
  return (
    <div>
      <AnimatedBackground />
      <div className="m-5">
      <Navbar />
      </div>
      <main className="p-4 min-h-screen">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};