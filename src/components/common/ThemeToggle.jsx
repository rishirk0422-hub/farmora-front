import { useTheme } from "../../hooks/useTheme";

const ThemeToggle = () => {
  const { dark, toggleTheme } = useTheme();

  return (
    <button onClick={toggleTheme} className="btn-gradient">
      {dark ? "Light Mode" : "Dark Mode"}
    </button>
  );
};

export default ThemeToggle;