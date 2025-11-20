import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { motion } from "framer-motion";
import { FaShoppingCart, FaUser, FaSignOutAlt, FaBox, FaCog } from "react-icons/fa";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <motion.nav
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg"
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold flex items-center">
          <span className="text-white">SmartCart</span>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center space-x-8">
          <Link
            to="/products"
            className="flex items-center text-sm font-semibold hover:text-gray-200 transition-colors"
          >
            <FaBox className="mr-2" />
            Products
          </Link>
          <Link
            to="/cart"
            className="flex items-center text-sm font-semibold hover:text-gray-200 transition-colors"
          >
            <FaShoppingCart className="mr-2" />
            Cart
          </Link>

          {/* Conditional Links for Logged-In Users */}
          {user ? (
            <>
              <Link
                to="/orders"
                className="flex items-center text-sm font-semibold hover:text-gray-200 transition-colors"
              >
                <FaBox className="mr-2" />
                Orders
              </Link>
              {user.isAdmin && (
                <Link
                  to="/admin"
                  className="flex items-center text-sm font-semibold hover:text-gray-200 transition-colors"
                >
                  <FaCog className="mr-2" />
                  Admin
                </Link>
              )}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={logout}
                className="flex items-center bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
              >
                <FaSignOutAlt className="mr-2" />
                Logout
              </motion.button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="flex items-center text-sm font-semibold hover:text-gray-200 transition-colors"
              >
                <FaUser className="mr-2" />
                Login
              </Link>
              <Link
                to="/signup"
                className="flex items-center text-sm font-semibold hover:text-gray-200 transition-colors"
              >
                <FaUser className="mr-2" />
                Signup
              </Link>
            </>
          )}
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;