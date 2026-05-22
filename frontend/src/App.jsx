import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import ProductPage from './pages/Product';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import TrackOrder from './pages/TrackOrder';
import TrackLookup from './pages/TrackLookup';
import Account from './pages/Account';
import { CartProvider } from './context/CartContext';
import { OrdersProvider } from './context/OrdersContext';
import { AuthProvider } from './context/AuthContext';

const ProductRoute = () => {
  const { id } = useParams();
  return <ProductPage key={id} />;
};

const App = () => (
  <AuthProvider>
    <OrdersProvider>
      <CartProvider>
        <Router>
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/product/:id" element={<ProductRoute />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/track" element={<TrackLookup />} />
              <Route path="/track/:orderId" element={<TrackOrder />} />
              <Route path="/account" element={<Account />} />
            </Route>
            <Route path="/login" element={<Login />} />
          </Routes>
        </Router>
      </CartProvider>
    </OrdersProvider>
  </AuthProvider>
);

export default App;
