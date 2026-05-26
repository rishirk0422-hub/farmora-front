
// import { useState } from "react";
// import { Link, useNavigate, useLocation } from "react-router-dom";
// import { useAuth } from "../../hooks/useAuth";
// import { useTheme } from "../../hooks/useTheme";
// import { TbLogout } from "react-icons/tb";
// import { GiFruitTree } from "react-icons/gi";



// import {
//   IconButton,
//   Avatar,
//   Drawer,
//   Box,
//   Typography,
//   Divider
// } from "@mui/material";

// import MenuIcon from "@mui/icons-material/Menu";
// import CloseIcon from "@mui/icons-material/Close";
// import ThemeToggle from "./ToggleThemeButton";

// const getGreeting = () => {
//   const hour = new Date().getHours();
//   if (hour < 12) return "Good Morning ☀️";
//   if (hour < 18) return "Good Afternoon 🌤️";
//   return "Good Evening 🌙";
// };

// const Navbar = () => {
//   const { user, logout } = useAuth();
//   const { dark, toggleTheme } = useTheme();
//   const navigate = useNavigate();
//   const location = useLocation();

//   const [open, setOpen] = useState(false);

// const handleLogout = () => {
//   logout(); // 🔥 use your context logout
//   setOpen(false);
//   navigate("/login", { replace: true });
// };

//   // 🔥 Nav links config
//   const publicLinks = [
//     { name: "Home", path: "/" },
//     { name: "About", path: "/about" },
//   ];

//   const privateLinks = [
//     { name: "Home", path: "/" },
//     { name: "About", path: "/about" },
//     { name: "Products", path: "/products" },
//     { name: "Orders", path: "/orders" },
//     { name: "Dashboard", path: "/dashboard" },
//     { name: "Category Master", path: "/masters/category" },
//     { name: "Unit Master", path: "/masters/unit" },
//   ];

//   const isActive = (path) =>
//     location.pathname === path ? "text-green-400 font-semibold" : "hover:text-green-400";

//   return (
//     <>
//       {/* NAVBAR */}
//       <div className="fixed top-0 left-0 w-full z-50 px-4 pt-4">
//         <div className="glass flex justify-between items-center px-6 py-3 rounded-2xl shadow-lg">
//           {/* LOGO */}
//           <Link to="/" className="text-2xl font-bold text-green-500 flex gap-2 items-center">
//             Farmora {<GiFruitTree className="text-green-400" />}
//           </Link>

//           {/* DESKTOP MENU */}
//           <div className="hidden md:flex items-center gap-5">
//             {(user ? privateLinks : publicLinks).map((link) => (
//               <Link
//                 key={link.path}
//                 to={link.path}
//                 className={isActive(link.path)}
//               >
//                 {link.name}
//               </Link>
//             ))}

//             {/* THEME */}
//             {/* <button onClick={toggleTheme} className="btn-gradient px-3 py-1">
//               {dark ? "Light" : "Dark"}
//             </button> */}
//             <ThemeToggle dark={dark} toggleTheme={toggleTheme} />

//             {/* AUTH */}
//             {user ? (
//               <>
//                 {/* USER INFO */}
//                 <div className="hidden lg:flex flex-col text-right mr-2">
//                   <span className="text-sm font-medium">{user.fullName}</span>
//                   <span className="text-xs opacity-70 uppercase">
//                     {getGreeting() + " " + user?.role}
//                   </span>
//                 </div>

//                 <Avatar
//                   src={user?.profileImage?.url}
//                   sx={{ width: 36, height: 36 }}
//                 />

//                 <button
//                   onClick={handleLogout}
//                   className="rounded-lg bg-gradient-to-r from-green-400 to-blue-500 px-2 py-1 bg-red-500"
//                 >
//                   <TbLogout />
//                 </button>
//               </>
//             ) : (
//               <>
//                 <Link to="/login" className="btn-gradient px-4 py-1">
//                   Login
//                 </Link>
//                 <Link to="/signup" className="btn-gradient px-4 py-1">
//                   Signup
//                 </Link>
//               </>
//             )}
//           </div>

//           {/* MOBILE MENU BUTTON */}
//           <div className="md:hidden">
//             <IconButton onClick={() => setOpen(true)}>
//               <MenuIcon className="text-white" />
//             </IconButton>
//           </div>
//         </div>
//       </div>

//       {/* MOBILE DRAWER */}
//       <Drawer
//         anchor="right"
//         open={open}
//         onClose={() => setOpen(false)}
//         PaperProps={{
//           sx: { background: "transparent", boxShadow: "none" },
//         }}
//       >
//         <Box className="h-full w-80 p-4 flex justify-end">
//           <div className="glass w-full h-full rounded-2xl p-5 flex flex-col justify-between shadow-xl">
//             {/* TOP */}
//             <div>
//               {/* HEADER */}
//               <div className="flex justify-between items-center mb-5">
//                 <Typography variant="h6">Menu</Typography>
//                 <IconButton onClick={() => setOpen(false)}>
//                   <CloseIcon />
//                 </IconButton>
//               </div>

//               {/* USER PROFILE */}
//               {user && (
//                 <>
//                   <div className="flex flex-col items-center text-center mb-5">
//                     <Avatar
//                       src={user?.profileImage?.url}
//                       sx={{ width: 70, height: 70, mb: 1 }}
//                     />
//                     <p className="font-semibold text-lg">{user.fullName}</p>
//                     <p className="text-sm opacity-70">{getGreeting()}</p>
//                   </div>

//                   <Divider sx={{ mb: 2 }} />
//                 </>
//               )}

//               {/* NAV LINKS */}
//               <div className="flex flex-col gap-3">
//                 {(user ? privateLinks : publicLinks).map((link) => (
//                   <Link
//                     key={link.path}
//                     to={link.path}
//                     onClick={() => setOpen(false)}
//                   >
//                     <button className="btn-gradient w-full">{link.name}</button>
//                   </Link>
//                 ))}

//                 <button onClick={toggleTheme} className="btn-gradient w-full">
//                   {dark ? "Light Mode" : "Dark Mode"}
//                 </button>
//               </div>
//             </div>

//             {/* BOTTOM */}
//             <div className="flex flex-col gap-3">
//               {user ? (
//                 <button
//                   onClick={handleLogout}
//                   className="btn-gradient w-full bg-red-500"
//                 >
//                   Logout
//                 </button>
//               ) : (
//                 <>
//                   <Link to="/login" onClick={() => setOpen(false)}>
//                     <button className="btn-gradient w-full">Login</button>
//                   </Link>

//                   <Link to="/signup" onClick={() => setOpen(false)}>
//                     <button className="btn-gradient w-full">Signup</button>
//                   </Link>
//                 </>
//               )}
//             </div>
//           </div>
//         </Box>
//       </Drawer>
//     </>
//   );
// };

// export default Navbar;



import { useState, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useTheme } from "../../hooks/useTheme";
import { TbLogout } from "react-icons/tb";
import { GiFruitTree } from "react-icons/gi";
import { MdCategory, MdStraighten } from "react-icons/md";
import { HiSparkles } from "react-icons/hi2";
import { IoChevronDown } from "react-icons/io5";

import {
  IconButton,
  Avatar,
  Drawer,
  Box,
  Typography,
  Divider,
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

// ─── Masters config ───────────────────────────────────────────────────────────
const masterItems = [
  {
    name: "Category Master",
    path: "/masters/category",
    icon: MdCategory,
    description: "Manage product categories",
    accent: "from-green-400 to-emerald-500",
    bg: "rgba(52,211,153,0.08)",
  },
  {
    name: "Unit Master",
    path: "/masters/unit",
    icon: MdStraighten,
    description: "Define measurement units",
    accent: "from-blue-400 to-cyan-500",
    bg: "rgba(96,165,250,0.08)",
  },
];

// ─── Masters Dropdown ─────────────────────────────────────────────────────────
const MastersDropdown = ({ location }) => {
  const [hovered, setHovered] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const timeoutRef = useRef(null);

  const open = () => {
    clearTimeout(timeoutRef.current);
    setHovered(true);
  };
  const close = () => {
    timeoutRef.current = setTimeout(() => setHovered(false), 120);
  };

  const isActive = masterItems.some((m) => location.pathname === m.path);

  return (
    <div
      className="relative"
      onMouseEnter={open}
      onMouseLeave={close}
    >
      {/* Trigger */}
      <button
        className={`flex items-center gap-1.5 transition-colors duration-200 select-none ${
          isActive ? "text-green-400 font-semibold" : "hover:text-green-400"
        }`}
      >
        <HiSparkles
          className={`text-sm transition-colors ${isActive ? "text-green-400" : "text-green-500/70"}`}
        />
        Masters
        <IoChevronDown
          className={`text-xs transition-transform duration-300 ${hovered ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown Panel */}
      <div
        style={{
          opacity: hovered ? 1 : 0,
          transform: hovered ? "translateY(0) scale(1)" : "translateY(-8px) scale(0.97)",
          pointerEvents: hovered ? "auto" : "none",
          transition: "opacity 0.22s ease, transform 0.22s cubic-bezier(.4,0,.2,1)",
        }}
        className="absolute top-[calc(100%+14px)] left-1/2 -translate-x-1/2 z-[100]"
      >
        {/* Arrow */}
        <div
          className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45"
          style={{
            background: "rgba(255,255,255,0.06)",
            borderTop: "1px solid rgba(255,255,255,0.12)",
            borderLeft: "1px solid rgba(255,255,255,0.12)",
          }}
        />

        {/* Card */}
        <div
          className="rounded-2xl p-2 w-64 shadow-2xl"
          style={{
            background: "rgba(15, 25, 20, 0.72)",
            backdropFilter: "blur(24px) saturate(1.6)",
            WebkitBackdropFilter: "blur(24px) saturate(1.6)",
            border: "1px solid rgba(255,255,255,0.10)",
            boxShadow:
              "0 8px 40px rgba(0,0,0,0.45), 0 0 0 1px rgba(74,222,128,0.06)",
          }}
        >
          {/* Header */}
          <div className="px-3 pt-2 pb-3">
            <p className="text-[10px] uppercase tracking-[0.18em] text-green-400/60 font-semibold">
              Master Configuration
            </p>
          </div>

          {/* Items */}
          <div className="flex flex-col gap-1">
            {masterItems.map((item) => {
              const Icon = item.icon;
              const active = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onMouseEnter={() => setHoveredItem(item.path)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <div
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 cursor-pointer group"
                    style={{
                      background:
                        hoveredItem === item.path || active
                          ? item.bg
                          : "transparent",
                      border:
                        active
                          ? "1px solid rgba(74,222,128,0.18)"
                          : "1px solid transparent",
                    }}
                  >
                    {/* Icon bubble */}
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-gradient-to-br ${item.accent} transition-transform duration-200 group-hover:scale-110`}
                      style={{ boxShadow: `0 2px 10px rgba(0,0,0,0.25)` }}
                    >
                      <Icon className="text-white text-sm" />
                    </div>

                    {/* Text */}
                    <div className="flex flex-col leading-tight">
                      <span
                        className={`text-sm font-medium transition-colors ${
                          active ? "text-green-400" : "text-white/90 group-hover:text-white"
                        }`}
                      >
                        {item.name}
                      </span>
                      <span className="text-[11px] text-white/40 group-hover:text-white/55 transition-colors">
                        {item.description}
                      </span>
                    </div>

                    {/* Active dot */}
                    {active && (
                      <div className="ml-auto w-1.5 h-1.5 rounded-full bg-green-400 shadow-[0_0_6px_2px_rgba(74,222,128,0.5)]" />
                    )}
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Footer */}
          <div
            className="mx-3 mt-3 mb-1 pt-2.5 flex items-center gap-1.5"
            style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
          >
            <HiSparkles className="text-green-400/50 text-xs" />
            <p className="text-[10px] text-white/25">Farmora Master Data</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Main Navbar ──────────────────────────────────────────────────────────────
const Navbar = () => {
  const { user, logout } = useAuth();
  const { dark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [open, setOpen] = useState(false);
  const [mastersOpen, setMastersOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate("/login", { replace: true });
  };

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
    location.pathname === path
      ? "text-green-400 font-semibold"
      : "hover:text-green-400";

  return (
    <>
      {/* NAVBAR */}
      <div className="fixed top-0 left-0 w-full z-50 px-4 pt-4">
        <div className="glass flex justify-between items-center px-6 py-3 rounded-2xl shadow-lg">
          {/* LOGO */}
          <Link
            to="/"
            className="text-2xl font-bold text-green-500 flex gap-2 items-center"
          >
            Farmora {<GiFruitTree className="text-green-400" />}
          </Link>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex items-center gap-5">
            {(user ? privateLinks : publicLinks).map((link) => (
              <Link key={link.path} to={link.path} className={isActive(link.path)}>
                {link.name}
              </Link>
            ))}

            {/* ✨ MASTERS DROPDOWN — only for logged-in users */}
            {user && <MastersDropdown location={location} />}

            <ThemeToggle dark={dark} toggleTheme={toggleTheme} />

            {/* AUTH */}
            {user ? (
              <>
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
                  className="rounded-lg bg-gradient-to-r from-green-400 to-blue-500 px-2 py-1"
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

                {/* MASTERS ACCORDION (mobile) */}
                {user && (
                  <div className="flex flex-col gap-1.5">
                    <button
                      className="btn-gradient w-full flex items-center justify-between px-4"
                      onClick={() => setMastersOpen((p) => !p)}
                    >
                      <span className="flex items-center gap-2">
                        <HiSparkles className="text-green-300" /> Masters
                      </span>
                      <IoChevronDown
                        className={`transition-transform duration-300 ${mastersOpen ? "rotate-180" : ""}`}
                      />
                    </button>

                    <div
                      style={{
                        maxHeight: mastersOpen ? "200px" : "0px",
                        opacity: mastersOpen ? 1 : 0,
                        overflow: "hidden",
                        transition: "max-height 0.3s ease, opacity 0.25s ease",
                      }}
                      className="flex flex-col gap-1.5 pl-2"
                    >
                      {masterItems.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setOpen(false)}
                          >
                            <button
                              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all text-left
                                bg-gradient-to-r ${item.accent} bg-opacity-10`}
                              style={{
                                background: item.bg,
                                border: "1px solid rgba(255,255,255,0.08)",
                              }}
                            >
                              <div
                                className={`w-7 h-7 rounded-lg flex items-center justify-center bg-gradient-to-br ${item.accent}`}
                              >
                                <Icon className="text-white text-xs" />
                              </div>
                              <span className="text-sm font-medium">{item.name}</span>
                            </button>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}

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
