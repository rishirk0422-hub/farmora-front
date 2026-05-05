import { useAuth } from "../../hooks/useAuth";
import { useTheme } from "../../hooks/useTheme";
import { getThemeColors } from "../../theme/theme";

const AnimatedBackground = () => {
  const { user } = useAuth();
  const { dark } = useTheme();

  const role = user?.role || "buyer";
  const colors = getThemeColors(role, dark);

  return (
    <div
      className="fixed inset-0 -z-10 blur-3xl opacity-40"
      style={{
        background: `
          radial-gradient(circle at 20% 20%, #22c55e30, transparent),
          radial-gradient(circle at 80% 30%, #3b82f630, transparent),
          radial-gradient(circle at 50% 80%, #8b5cf630, transparent)
        `,
        filter: "blur(60px)",
        backgroundSize: "600% 600%",
        animation: "gradientMove 12s ease infinite",
      }}
    />
  );
};

export default AnimatedBackground;
