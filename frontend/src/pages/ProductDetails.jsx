import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { CartContext } from "../context/CartContext";
import { motion } from "framer-motion";
import { FaShoppingCart, FaStar, FaArrowLeft } from "react-icons/fa";
import { Link } from "react-router-dom";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchProduct = async () => {
      const res = await axios.get(`http://localhost:5000/api/products/${id}`);
      setProduct(res.data);
    };
    fetchProduct();
  }, [id]);

  if (!product)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-gray-50 to-gray-100">
        <p className="text-lg text-gray-600">Loading...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-50 to-gray-100 p-10">
      <Link to="/products">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center text-gray-600 hover:text-gray-800 mb-6"
        >
          <FaArrowLeft className="mr-2" />
          Back to Products
        </motion.button>
      </Link>
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-2xl p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Product Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center items-center"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-96 object-cover rounded-2xl shadow-lg"
            />
          </motion.div>

          {/* Product Details */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col justify-center"
          >
            <h1 className="text-4xl font-bold text-gray-800 mb-4">{product.name}</h1>
            <p className="text-lg text-gray-600 mb-6">{product.description}</p>
            <div className="flex items-center mb-6">
              <div className="flex text-yellow-500">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className="text-xl" />
                ))}
              </div>
              <span className="ml-2 text-gray-600">(4.5/5)</span>
            </div>
            <p className="text-3xl font-bold text-purple-600 mb-8">
              ₹{product.dynamicPrice.toFixed(2)}
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => addToCart(product._id)}
              className="flex items-center justify-center bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-8 py-4 rounded-lg hover:shadow-lg transition-all"
            >
              <FaShoppingCart className="mr-3" />
              Add to Cart
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;