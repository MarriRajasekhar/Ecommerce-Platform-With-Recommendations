import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaShoppingCart, FaEye } from "react-icons/fa";
import { CartContext } from "../context/CartContext";

const Products = () => {
  const [products, setProducts] = useState([]);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await axios.get("http://localhost:5000/api/products");
      setProducts(res.data);
    };
    fetchProducts();
  }, []);

  return (
    <div className="p-10 bg-gradient-to-r from-gray-50 to-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold text-center mb-10 text-gray-800">Explore Our Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {products.map((product) => (
          <motion.div
            key={product._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-56 object-cover rounded-lg mb-4"
            />
            <h2 className="text-xl font-bold text-gray-800 mb-2">{product.name}</h2>
            <p className="text-lg font-semibold text-purple-600 mb-4">
              ₹{product.dynamicPrice?.toFixed(2)}
            </p>
            <div className="flex justify-between items-center">
              <Link to={`/products/${product._id}`}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors"
                >
                  <FaEye className="mr-2" />
                  View
                </motion.button>
              </Link>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                onClick={() => addToCart(product._id)}
              >
                <FaShoppingCart className="mr-2" />
                Add to Cart
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Products;