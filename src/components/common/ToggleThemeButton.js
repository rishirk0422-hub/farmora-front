
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";

const ThemeToggle = ({ dark, toggleTheme }) => {
  return (
    <button
      onClick={toggleTheme}
      className="
        relative w-16 h-8 flex items-center
        rounded-full px-1
        transition duration-300
        bg-gray-200 dark:bg-gray-700
        shadow-inner
      "
    >
      {/* ICONS */}
      <LightModeIcon fontSize="small" className="absolute left-2 text-yellow-500 text-sm" />
      <DarkModeIcon fontSize="small" className="absolute right-2 text-blue-400 text-sm" />

      {/* TOGGLE CIRCLE */}
      <div
        className={`
          w-6 h-6 rounded-full
          bg-white dark:bg-gray-900
          shadow-md
          transform transition duration-300
          flex items-center justify-center
          ${dark ? "translate-x-8" : "translate-x-0"}
        `}
      >
        {dark ? (
          <DarkModeIcon className="text-blue-400 text-xs" />
        ) : (
          <LightModeIcon className="text-yellow-500 text-xs" />
        )}
      </div>
    </button>
  );
};

export default ThemeToggle;

