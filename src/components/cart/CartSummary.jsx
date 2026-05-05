const CartSummary = ({ total }) => {
    return (
      <div className="glass p-4 mt-4">
        <h3>Total: ₹{total}</h3>
        <button className="btn-gradient mt-2">Checkout</button>
      </div>
    );
  };
  
  export default CartSummary;