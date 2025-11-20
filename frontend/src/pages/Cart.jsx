import { useContext, useState, useEffect } from "react";
import { CartContext } from "../context/CartContext";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaTrash, FaArrowRight } from "react-icons/fa";
import axios from "axios";

const Cart = () => {
  const { cart, removeFromCart } = useContext(CartContext);
  const [recommended, setRecommended] = useState([]);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        if (cart.length === 0) return;
        const cartItemIds = cart.map((item) => item.product._id);
        const res = await axios.post("http://localhost:5000/api/cart/users-also-bought", {
          cartItems: cartItemIds,
        });
        setRecommended(res.data);
      } catch (error) {
        console.error("Error fetching recommendations:", error);
      }
    };

    fetchRecommendations();
  }, [cart]);

  if (!cart.length)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-gray-50 to-gray-100">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Your Cart is Empty</h1>
        <Link
          to="/products"
          className="bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 transition-colors"
        >
          Explore Products
        </Link>
      </div>
    );

  const totalPrice = cart.reduce((total, item) => total + item.product.dynamicPrice * item.quantity, 0);

  return (
    <div className="p-10 bg-gradient-to-r from-gray-50 to-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold text-center mb-10 text-gray-800">Your Cart</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {cart.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">{item.product.name}</h2>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => removeFromCart(item.product._id)}
                className="text-red-500 hover:text-red-600"
              >
                <FaTrash className="text-xl" />
              </motion.button>
            </div>
            <p className="text-lg font-semibold text-purple-600 mb-2">
              ₹{item.product.dynamicPrice?.toFixed(2)}
            </p>
            <p className="text-gray-500 mb-4">Qty: {item.quantity}</p>
          </motion.div>
        ))}
      </div>
      <div className="mt-10 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Total: ₹{totalPrice?.toFixed(2)}
        </h2>
        <Link to="/checkout">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-purple-500 text-white px-8 py-3 rounded-lg hover:bg-purple-600 transition-colors flex items-center justify-center mx-auto"
          >
            Proceed to Checkout <FaArrowRight className="ml-2" />
          </motion.button>
        </Link>
      </div>

      {/* Users Also Bought Section */}
      {recommended.length > 0 && (
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">🛍 Users Also Bought</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recommended.map((product) => (
              <div key={product._id} className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg">
                <img src={product.image} alt={product.name} className="w-full h-48 object-cover rounded" />
                <h3 className="text-lg font-bold mt-2">{product.name}</h3>
                <p className="text-gray-600">₹{product.dynamicPrice.toFixed(2)}</p>
                <Link to={`/products/${product._id}`} className="block mt-3 text-purple-500 font-bold">
                  View Product
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
