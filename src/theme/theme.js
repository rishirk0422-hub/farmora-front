export const getThemeColors = (role, dark) => {
    if (role === "seller") {
      return dark
        ? ["#065f46", "#064e3b"]
        : ["#22c55e", "#16a34a"];
    } else {
      return dark
        ? ["#1e3a8a", "#1e40af"]
        : ["#3b82f6", "#2563eb"];
    }
  };