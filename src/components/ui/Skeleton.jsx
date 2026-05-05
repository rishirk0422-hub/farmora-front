const Skeleton = ({ className }) => {
    return (
      <div
        className={`animate-pulse bg-gray-300 dark:bg-gray-700 rounded ${className}`}
      />
    );
  };
  
  export default Skeleton;