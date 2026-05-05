import StatsCard from "./StatsCard";

const SellerDashboard = ({ data }) => {
  return (
    <div className="grid md:grid-cols-3 gap-4">
      <StatsCard title="Orders" value={data.totalOrders} />
      <StatsCard title="Revenue" value={`₹${data.totalRevenue}`} />
    </div>
  );
};

export default SellerDashboard;