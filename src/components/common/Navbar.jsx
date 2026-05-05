
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useTheme } from "../../hooks/useTheme";
import { TbLogout } from "react-icons/tb";
import { GiFruitTree } from "react-icons/gi";



import {
  IconButton,
  Avatar,
  Drawer,
  Box,
  Typography,
  Divider
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import ThemeToggle from "./ToggleThemeButton";

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning ☀️";
  if (hour < 18) return "Good Afternoon 🌤️";
  return "Good Evening 🌙";
};

const Navbar = () => {
  const { user, logout } = useAuth();
  const { dark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [open, setOpen] = useState(false);

const handleLogout = () => {
  logout(); // 🔥 use your context logout
  setOpen(false);
  navigate("/login", { replace: true });
};

  // 🔥 Nav links config
  const publicLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
  ];

  const privateLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Products", path: "/products" },
    { name: "Orders", path: "/orders" },
    { name: "Dashboard", path: "/dashboard" },
  ];

  const isActive = (path) =>
    location.pathname === path ? "text-green-400 font-semibold" : "hover:text-green-400";

  return (
    <>
      {/* NAVBAR */}
      <div className="fixed top-0 left-0 w-full z-50 px-4 pt-4">
        <div className="glass flex justify-between items-center px-6 py-3 rounded-2xl shadow-lg">
          {/* LOGO */}
          <Link to="/" className="text-2xl font-bold text-green-500 flex gap-2 items-center">
            Farmora {<GiFruitTree className="text-green-400" />}
          </Link>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex items-center gap-5">
            {(user ? privateLinks : publicLinks).map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={isActive(link.path)}
              >
                {link.name}
              </Link>
            ))}

            {/* THEME */}
            {/* <button onClick={toggleTheme} className="btn-gradient px-3 py-1">
              {dark ? "Light" : "Dark"}
            </button> */}
            <ThemeToggle dark={dark} toggleTheme={toggleTheme} />

            {/* AUTH */}
            {user ? (
              <>
                {/* USER INFO */}
                <div className="hidden lg:flex flex-col text-right mr-2">
                  <span className="text-sm font-medium">{user.fullName}</span>
                  <span className="text-xs opacity-70 uppercase">
                    {getGreeting() + " " + user?.role}
                  </span>
                </div>

                <Avatar
                  src={user?.profileImage?.url}
                  sx={{ width: 36, height: 36 }}
                />

                <button
                  onClick={handleLogout}
                  className="rounded-lg bg-gradient-to-r from-green-400 to-blue-500 px-2 py-1 bg-red-500"
                >
                  <TbLogout />
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-gradient px-4 py-1">
                  Login
                </Link>
                <Link to="/signup" className="btn-gradient px-4 py-1">
                  Signup
                </Link>
              </>
            )}
          </div>

          {/* MOBILE MENU BUTTON */}
          <div className="md:hidden">
            <IconButton onClick={() => setOpen(true)}>
              <MenuIcon className="text-white" />
            </IconButton>
          </div>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      <Drawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          sx: { background: "transparent", boxShadow: "none" },
        }}
      >
        <Box className="h-full w-80 p-4 flex justify-end">
          <div className="glass w-full h-full rounded-2xl p-5 flex flex-col justify-between shadow-xl">
            {/* TOP */}
            <div>
              {/* HEADER */}
              <div className="flex justify-between items-center mb-5">
                <Typography variant="h6">Menu</Typography>
                <IconButton onClick={() => setOpen(false)}>
                  <CloseIcon />
                </IconButton>
              </div>

              {/* USER PROFILE */}
              {user && (
                <>
                  <div className="flex flex-col items-center text-center mb-5">
                    <Avatar
                      src={user?.profileImage?.url}
                      sx={{ width: 70, height: 70, mb: 1 }}
                    />
                    <p className="font-semibold text-lg">{user.fullName}</p>
                    <p className="text-sm opacity-70">{getGreeting()}</p>
                  </div>

                  <Divider sx={{ mb: 2 }} />
                </>
              )}

              {/* NAV LINKS */}
              <div className="flex flex-col gap-3">
                {(user ? privateLinks : publicLinks).map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setOpen(false)}
                  >
                    <button className="btn-gradient w-full">{link.name}</button>
                  </Link>
                ))}

                <button onClick={toggleTheme} className="btn-gradient w-full">
                  {dark ? "Light Mode" : "Dark Mode"}
                </button>
              </div>
            </div>

            {/* BOTTOM */}
            <div className="flex flex-col gap-3">
              {user ? (
                <button
                  onClick={handleLogout}
                  className="btn-gradient w-full bg-red-500"
                >
                  Logout
                </button>
              ) : (
                <>
                  <Link to="/login" onClick={() => setOpen(false)}>
                    <button className="btn-gradient w-full">Login</button>
                  </Link>

                  <Link to="/signup" onClick={() => setOpen(false)}>
                    <button className="btn-gradient w-full">Signup</button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </Box>
      </Drawer>
    </>
  );
};

export default Navbar;
