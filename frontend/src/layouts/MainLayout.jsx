import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import PromoBar from '../components/PromoBar';
import Footer from '../components/Footer';
import CartDrawer from '../components/CartDrawer';

const MainLayout = () => (
  <div className="min-h-screen flex flex-col bg-wv-page pt-[calc(var(--wv-header-h)+var(--wv-promo-h))]">
    <Navbar />
    <PromoBar />
    <main className="flex-1 flex flex-col min-h-0">
      <Outlet />
    </main>
    <Footer />
    <CartDrawer />
  </div>
);

export default MainLayout;
