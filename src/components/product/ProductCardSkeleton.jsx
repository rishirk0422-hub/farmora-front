import { Skeleton, Card, CardContent } from "@mui/material";

const ProductCardSkeleton = () => {
  return (
    <Card className="rounded-2xl shadow-md">
      {/* IMAGE */}
      <Skeleton variant="rectangular" height={192} />

      <CardContent>
        <Skeleton className="dark:bg-gray-700" variant="text" height={30} width="70%" />
        <Skeleton className="dark:bg-gray-700" variant="text" height={25} width="40%" />

        <div className="mt-2 space-y-1">
          <Skeleton className="dark:bg-gray-700" variant="text" height={20} width="90%" />
          <Skeleton className="dark:bg-gray-700" variant="text" height={20} width="80%" />
          <Skeleton className="dark:bg-gray-700" variant="text" height={20} width="85%" />
          <Skeleton className="dark:bg-gray-700" variant="text" height={20} width="75%" />
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCardSkeleton;