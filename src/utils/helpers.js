export const formatCurrency = (value) => {
    return `₹${Number(value).toLocaleString()}`;
  };
  
  export const truncateText = (text, limit = 60) => {
    return text.length > limit
      ? text.substring(0, limit) + "..."
      : text;
  };