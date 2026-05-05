import { useEffect } from "react";
import { useSocket } from "./useSocket";
import { toast } from "react-toastify";

export const useSocketEvents = () => {
  const { socket } = useSocket();

  useEffect(() => {
    if (!socket) return;

    socket.on("newOrder", (data) => {
      toast.success("🛒 New Order Received!");
    });

    socket.on("orderUpdated", (data) => {
      toast.info("📦 Order Status Updated");
    });

    return () => {
      socket.off("newOrder");
      socket.off("orderUpdated");
    };
  }, [socket]);
};