import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './components/HomePage';
import { Marketplace } from './components/Marketplace';
import { KurbanUnik } from './components/KurbanUnik';
import { NationalDashboard } from './components/NationalDashboard';
import { ArticlesPage } from './components/ArticlesPage';
import { BuyerDashboard } from './components/BuyerDashboard';
import { SellerDashboard } from './components/SellerDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { AboutPage, FaqPage, ContactPage } from './components/AboutFaqContactPages';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CheckoutModal } from './components/CheckoutModal';
import { CertificateModal } from './components/CertificateModal';
import { AiAssistantModal } from './components/AiAssistantModal';
import { CartDrawer } from './components/CartDrawer';

const MainContent: React.FC = () => {
  const { activeView } = useApp();

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <div>
        <Header />

        {activeView === 'home' && <HomePage />}
        {activeView === 'marketplace' && <Marketplace />}
        {activeView === 'kurban-unik' && <KurbanUnik />}
        {activeView === 'national-dashboard' && <NationalDashboard />}
        {activeView === 'articles' && <ArticlesPage />}
        {activeView === 'buyer-dashboard' && <BuyerDashboard />}
        {activeView === 'seller-dashboard' && <SellerDashboard />}
        {activeView === 'admin-dashboard' && <AdminDashboard />}
        {activeView === 'about' && <AboutPage />}
        {activeView === 'faq' && <FaqPage />}
        {activeView === 'contact' && <ContactPage />}
      </div>

      <Footer />

      {/* Global Modals & Drawers */}
      <ProductDetailModal />
      <CheckoutModal />
      <CertificateModal />
      <AiAssistantModal />
      <CartDrawer />
    </main>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
