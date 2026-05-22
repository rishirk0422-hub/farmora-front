import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

import {
  Instagram,
  Facebook,
  Twitter,
  LinkedIn,
  Email,
  Phone
} from "@mui/icons-material";

const Footer = () => {
  const { user } = useAuth();

  return (
    <footer className="mt-16 px-4">
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-gray-400/40 to-transparent mb-8"></div>

     
      <div className="glass rounded-2xl p-8 shadow-xl">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          
          <div>
            <h2 className="text-2xl font-bold text-green-500 mb-3">
              Farmora 🌱
            </h2>
            <p className="text-sm opacity-80">
              Connecting farmers directly with consumers. Fresh,
              transparent, and fair.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-3">Quick Links</h3>
            <div className="flex flex-col gap-2 text-sm">
              <Link to="/" className="hover:text-green-400">Home</Link>
              <Link to="/products" className="hover:text-green-400">Products</Link>
              <Link to="/about" className="hover:text-green-400">About</Link>
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-3">Your Account</h3>
            <div className="flex flex-col gap-2 text-sm">
              {user ? (
                <>
                  <Link to="/dashboard" className="hover:text-green-400">
                    Dashboard
                  </Link>
                  <Link to="/orders" className="hover:text-green-400">
                    Orders
                  </Link>
                  <Link to="/cart" className="hover:text-green-400">
                    Cart
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/login" className="hover:text-green-400">
                    Login
                  </Link>
                  <Link to="/signup" className="hover:text-green-400">
                    Signup
                  </Link>
                </>
              )}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Reach Us</h3>

            <div className="flex flex-col gap-2 text-sm mb-4">
              <div className="flex items-center gap-2">
                <Email fontSize="small" />
                <span>rishirk0422@gmail.com</span>
              </div>

              <div className="flex items-center gap-2">
                <Phone fontSize="small" />
                <span>+91 9325143126</span>
              </div>
            </div>

            {/* SOCIAL ICONS */}
            <div className="flex gap-3">
              <a href="https://www.instagram.com">
                <Instagram className="hover:text-pink-500 transition" />
              </a>
              <a href="https://www.facebook.com">
                <Facebook className="hover:text-blue-500 transition" />
              </a>
              <a href="https://www.twitter.com">
                <Twitter className="hover:text-sky-400 transition" />
              </a>
              <a href="https://www.linkedin.com">
                <LinkedIn className="hover:text-blue-600 transition" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-gray-300/20 flex flex-col md:flex-row justify-between items-center text-sm opacity-70 gap-2">
          <p>© {new Date().getFullYear()} Farmora. All rights reserved.</p>

          <div className="flex gap-4">
            <span className="hover:text-green-400 cursor-pointer">
              Privacy Policy
            </span>
            <span className="hover:text-green-400 cursor-pointer">
              Terms
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;