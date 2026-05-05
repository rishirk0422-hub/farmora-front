const StatsCard = ({ title, value }) => {
    return (
      <div className="glass p-4 text-center">
        <h3 className="text-lg">{title}</h3>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    );
  };
  
  export default StatsCard;