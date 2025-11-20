import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { motion } from "framer-motion";
import { FaBox, FaClock, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { Link } from "react-router-dom";

const Orders = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [recommended, setRecommended] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/orders", {
          headers: { Authorization: token },
        });
        setOrders(res.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    const fetchRecommendations = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/orders/recommendations", {
          headers: { Authorization: token },
        });
        setRecommended(res.data);
      } catch (error) {
        console.error("Error fetching recommendations:", error);
      }
    };

    fetchOrders();
    fetchRecommendations();
  }, []);

  if (!user)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-gray-50 to-gray-100">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Please Log In</h1>
        <p className="text-lg text-gray-600 mb-6">You need to log in to view your orders.</p>
        <Link
          to="/login"
          className="bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 transition-colors"
        >
          Log In
        </Link>
      </div>
    );

  return (
    <div className="p-10 bg-gradient-to-r from-gray-50 to-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold text-center mb-10 text-gray-800">Your Orders</h1>
      
      {orders.length === 0 ? (
        <div className="text-center">
          <p className="text-lg text-gray-600">No orders yet. Start shopping!</p>
          <Link
            to="/products"
            className="mt-4 inline-block bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 transition-colors"
          >
            Explore Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {orders.map((order, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">Order #{order._id}</h2>
                <div
                  className={`flex items-center text-sm font-semibold ${
                    order.status === "Delivered"
                      ? "text-green-500"
                      : order.status === "Pending"
                      ? "text-yellow-500"
                      : "text-red-500"
                  }`}
                >
                  {order.status === "Delivered" ? (
                    <FaCheckCircle className="mr-2" />
                  ) : order.status === "Pending" ? (
                    <FaClock className="mr-2" />
                  ) : (
                    <FaTimesCircle className="mr-2" />
                  )}
                  {order.status}
                </div>
              </div>
              <p className="text-lg font-semibold text-purple-600 mb-4">
                Total: ₹{order.totalAmount.toFixed(2)}
              </p>
              <ul className="space-y-2">
                {order.items.map((item, i) => (
                  <li key={i} className="flex items-center text-gray-600">
                    <FaBox className="mr-2 text-gray-400" />
                    {item.quantity} x {item.product.name}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      )}

      {/* Recommended Products */}
      {recommended.length > 0 && (
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">🔥 Recommended for You</h2>
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

export default Orders;
