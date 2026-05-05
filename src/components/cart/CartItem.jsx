const CartItem = ({ item }) => {
    return (
      <div className="glass p-4 flex justify-between">
        <div>
          <h3>{item.product.title}</h3>
          <p>Qty: {item.quantity}</p>
        </div>
        <p>₹{item.product.price}</p>
      </div>
    );
  };
  
  export default CartItem;