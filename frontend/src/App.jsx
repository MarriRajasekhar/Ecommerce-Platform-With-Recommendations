import AppRoutes from "./routes";
import Navbar from "./components/Navbar";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Navbar />
        <AppRoutes />
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
