
import { useState } from "react";
import Card from "../ui/Card";
import { Chip } from "@mui/material";
import { getImageUrl } from "../../utils/getImageUrl";
import Loader from "../common/Loader";
import OrderModal from "./OrderModal";

const InfoRow = ({ label, value }) => (
  <div className="flex justify-between text-sm">
    <span className="text-gray-500 dark:text-gray-400">{label}</span>
    <span className="font-medium text-gray-800 dark:text-gray-200">
      {value}
    </span>
  </div>
);

const ProductCard = ({ product }) => {
  const [imgLoading, setImgLoading] = useState(true);
  const [imgError, setImgError] = useState(false);
  const [open, setOpen] = useState(false);

  const imageUrl = getImageUrl(product.images?.[0]?.url);

  return (
    <>
      <Card
        className="
        overflow-hidden rounded-2xl
        transition duration-300
        bg-white dark:bg-gray-900
        border border-gray-200 dark:border-gray-600
        hover:border-green-400 dark:hover:border-green-500

        shadow-md hover:shadow-xl
        dark:shadow-[0_4px_20px_rgba(255,255,255,0.08)]
        dark:hover:shadow-[0_6px_25px_rgba(255,255,255,0.15)]
      "
      >
        {/* IMAGE */}
        <div className="relative h-48 w-full bg-gray-100 dark:bg-gray-800">
          {imgLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader />
            </div>
          )}

          <img
            src={!imgError ? product.url : "https://via.placeholder.com/300"}
            alt={product.title}
            className={`h-48 w-full object-cover transition duration-300 ${
              imgLoading ? "opacity-0" : "opacity-100"
            }`}
            onLoad={() => setImgLoading(false)}
            onError={() => {
              setImgError(true);
              setImgLoading(false);
            }}
          />

          <div className="absolute top-2 right-2">
            <Chip label={product.category} size="small" color="success" />
          </div>
        </div>

        {/* CONTENT */}
        <div className="p-4 space-y-3">
          <h3 className="font-bold text-lg text-green-600 dark:text-green-400">
            {product.title}
          </h3>

          <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">
            ₹{product.price}
          </p>

          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
            {product.description}
          </p>

          <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800 space-y-1">
            <InfoRow
              label="Available"
              value={`${product.quantity} ${product.unit}`}
            />
            <InfoRow
              label="Seller"
              value={product.seller?.fullName || "N/A"}
            />
            <InfoRow
              label="District"
              value={product.seller?.address?.district || "N/A"}
            />
          </div>

          {/* BUY BUTTON */}
          <button
            onClick={() => setOpen(true)}
            disabled={product.quantity === 0}
            className="w-full btn-gradient py-2 disabled:opacity-50"
          >
            {product.quantity === 0 ? "Out of Stock" : "Buy Now"}
          </button>
        </div>
      </Card>

      {/* ORDER MODAL */}
      <OrderModal
        open={open}
        handleClose={() => setOpen(false)}
        product={product}
      />
    </>
  );
};

export default ProductCard;

