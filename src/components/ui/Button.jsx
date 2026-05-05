const Button = ({ children, ...props }) => {
    return (
      <button
        {...props}
        className="btn-gradient px-4 py-2 rounded-xl w-full"
      >
        {children}
      </button>
    );
  };
  
  export default Button;