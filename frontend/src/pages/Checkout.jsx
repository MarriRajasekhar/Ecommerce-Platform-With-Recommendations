import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const { cart } = useContext(CartContext);
  const navigate = useNavigate();

  const handleCheckout = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/orders/place",
        {},
        { headers: { Authorization: token } }
      );
      alert("Order placed successfully!");
      navigate("/orders");
    } catch (error) {
      console.error("Checkout failed", error);
    }
  };

  return (
    <div className="p-10 text-center">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      <p className="text-lg">Total Items: {cart.length}</p>
      <button
        onClick={handleCheckout}
        className="mt-6 bg-green-500 text-white px-5 py-2 rounded-lg hover:bg-green-600"
      >
        Confirm Order
      </button>
    </div>
  );
};

export default Checkout;
