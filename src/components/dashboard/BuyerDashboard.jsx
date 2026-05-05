import StatsCard from "./StatsCard";

const BuyerDashboard = ({ data }) => {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <StatsCard title="Orders" value={data.totalOrders} />
    </div>
  );
};

export default BuyerDashboard;