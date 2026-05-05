import { motion } from "framer-motion";

const Card = ({ children }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="glass p-4 rounded-2xl shadow-md"
    >
      {children}
    </motion.div>
  );
};

export default Card;