
import { useEffect, useState } from "react";
import api from "../services/api";

const StatusBadge = ({ status }) => {
  const base =
    "px-2 py-1 rounded-full text-xs font-semibold text-white";

  const styles = {
    pending: "bg-yellow-500",
    accepted: "bg-blue-500",
    completed: "bg-green-600"
  };

  return (
    <span className={`${base} ${styles[status] || "bg-gray-500"}`}>
      {status}
    </span>
  );
};

const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get("/orders/seller");
        setOrders(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="px-4 pb-4 pt-16">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">
        Orders
      </h2>

      {/* EMPTY STATE */}
      {orders.length === 0 && (
        <p className="text-gray-500 dark:text-gray-400">
          No orders yet
        </p>
      )}

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {orders.map((order) => (
          <div
            key={order._id}
            className="
              rounded-2xl p-4
              bg-white dark:bg-gray-900
              border border-gray-200 dark:border-gray-600
              shadow-md hover:shadow-xl
              transition duration-300
              dark:shadow-[0_4px_20px_rgba(255,255,255,0.08)]
            "
          >
            {/* HEADER */}
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold text-lg text-green-600 dark:text-green-400">
                {order.product?.title || "Product"}
              </h3>

              <StatusBadge status={order.status} />
            </div>

            {/* BODY */}
            <div className="space-y-1 text-sm text-gray-700 dark:text-gray-300">

              <p>
                <span className="text-gray-500">Buyer:</span>{" "}
                {order.buyer?.fullName || "N/A"}
              </p>

              <p>
                <span className="text-gray-500">Quantity:</span>{" "}
                {order.quantity}
              </p>

              <p>
                <span className="text-gray-500">Total:</span>{" "}
                ₹{order.totalPrice}
              </p>

              <p>
                <span className="text-gray-500">Address:</span>{" "}
                {order.deliveryAddress || "N/A"}
              </p>

              <p className="text-xs text-gray-400 mt-2">
                {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
