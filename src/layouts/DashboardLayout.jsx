import Navbar from "../components/common/Navbar";

const DashboardLayout = ({ children }) => {
  return (
    <div>
      <Navbar />
      <div className="p-6">{children}</div>
    </div>
  );
};

export default DashboardLayout; 