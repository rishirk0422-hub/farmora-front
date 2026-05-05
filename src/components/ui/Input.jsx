const Input = ({ ...props }) => {
    return (
      <input
        {...props}
        className="w-full p-2 rounded-lg border dark:bg-gray-800"
      />
    );
  };
  
  export default Input;