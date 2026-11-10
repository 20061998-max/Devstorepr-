import React, { useState } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { AdminDashboard } from './components/AdminDashboard';
import { RedeemDownloadModal } from './components/RedeemDownloadModal';
import { AdvertiseModal } from './components/AdvertiseModal';
import { Footer } from './components/Footer';
import { Product } from './types';
import { MessageCircle, PackageOpen, Sparkles, ShieldCheck } from 'lucide-react';

const StoreContent: React.FC = () => {
  const { products, isAdminLoggedIn, whatsappNumber } = useStore();

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals state
  const [selectedProductForDetail, setSelectedProductForDetail] = useState<Product | null>(null);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState<boolean>(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState<boolean>(false);
  const [isAdvertiseModalOpen, setIsAdvertiseModalOpen] = useState<boolean>(false);
  const [isRedeemModalOpen, setIsRedeemModalOpen] = useState<boolean>(false);
  const [redeemProductId, setRedeemProductId] = useState<string | null>(null);

  // Filter products by category, search and availability (public vitrine shows available ones)
  const availableProducts = products.filter((p) => p.isAvailable);

  const filteredProducts = availableProducts.filter((product) => {
    const matchesCategory =
      activeCategory === 'all' || product.category === activeCategory;

    const matchesSearch =
      searchQuery.trim() === '' ||
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.techStack.some((tech) =>
        tech.toLowerCase().includes(searchQuery.toLowerCase())
      ) ||
      product.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const handleOpenRedeem = (productId?: string) => {
    setRedeemProductId(productId || null);
    setIsRedeemModalOpen(true);
  };

  // If admin panel is full screen requested
  if (isAdminLoggedIn && isAdminPanelOpen) {
    return <AdminDashboard onClose={() => setIsAdminPanelOpen(false)} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-['Plus_Jakarta_Sans']">
      {/* Top Banner Notice */}
      <div className="bg-gradient-to-r from-slate-900 via-cyan-950 to-slate-900 border-b border-cyan-900/40 py-2 px-4 text-center text-xs text-cyan-200">
        <span className="font-semibold text-white">✨ Vitrine Oficial DevStore:</span> Softwares prontos com entrega direta e autorização via WhatsApp <strong>(48) 99809-1948</strong>.
      </div>

      {/* Main Top Navigation */}
      <Navbar
        onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
        onOpenAdminPanel={() => setIsAdminPanelOpen(true)}
        onOpenAdvertiseModal={() => setIsAdvertiseModalOpen(true)}
        onOpenRedeemModal={() => handleOpenRedeem()}
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
      />

      {/* Hero Showcase Banner */}
      <HeroBanner
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        onOpenRedeemModal={() => handleOpenRedeem()}
        onOpenAdvertiseModal={() => setIsAdvertiseModalOpen(true)}
      />

      {/* Product Showcase (Vitrine) */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Vitrine Disponível</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-['Outfit']">
              {activeCategory === 'all'
                ? 'Todos os Softwares e Sistemas Prontos'
                : activeCategory === 'app'
                ? 'Aplicativos Mobile Completos'
                : activeCategory === 'saas'
                ? 'Plataformas SaaS e Sistemas Web'
                : activeCategory === 'ecommerce'
                ? 'Lojas Virtuais e E-commerce'
                : 'Scripts, Bots e Automações'}
            </h2>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span>
              Exibindo <strong className="text-white">{filteredProducts.length}</strong> de{' '}
              {availableProducts.length} projetos
            </span>
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onOpenDetails={(prod) => setSelectedProductForDetail(prod)}
                onOpenRedeem={(prodId) => handleOpenRedeem(prodId)}
              />
            ))}
          </div>
        ) : (
          /* Empty Search State */
          <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-12 text-center max-w-lg mx-auto">
            <PackageOpen className="w-12 h-12 text-slate-500 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white mb-2 font-['Outfit']">
              Nenhum projeto encontrado
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              Não encontramos nenhum aplicativo ou site correspondente a "{searchQuery}".
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('all');
              }}
              className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 text-xs font-bold hover:bg-cyan-400 transition-colors cursor-pointer"
            >
              Ver Todos os Softwares da Vitrine
            </button>
          </div>
        )}

        {/* Curation & Safety Banner */}
        <section className="mt-16 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/80 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Garantia de Qualidade & Entrega</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white font-['Outfit']">
              Tem um aplicativo ou site e quer anunciar aqui?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Aqui ninguém anuncia livremente sem avaliação prévia. Nós analisamos a integridade do seu código e publicamos na vitrine para que você venda com segurança.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <button
              onClick={() => setIsAdvertiseModalOpen(true)}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-950/40 transition-all flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Solicitar Anúncio no WhatsApp</span>
            </button>
          </div>
        </section>
      </main>

      {/* Floating WhatsApp Action Button */}
      <a
        href={`https://wa.me/55${whatsappNumber}?text=${encodeURIComponent('Olá! Acessei a vitrine DevStore e gostaria de mais informações.')}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-30 flex items-center gap-2.5 px-4 py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm shadow-2xl shadow-emerald-950/80 hover:scale-105 active:scale-95 transition-all cursor-pointer border border-emerald-400/40 group"
        title="Falar no WhatsApp (48) 99809-1948"
      >
        <MessageCircle className="w-5 h-5 fill-current" />
        <span className="hidden sm:inline">WhatsApp (48) 99809-1948</span>
      </a>

      {/* Footer */}
      <Footer
        onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
        onOpenRedeemModal={() => handleOpenRedeem()}
        onOpenAdvertiseModal={() => setIsAdvertiseModalOpen(true)}
      />

      {/* Modals */}
      <ProductDetailModal
        product={selectedProductForDetail}
        onClose={() => setSelectedProductForDetail(null)}
        onOpenRedeem={(productId) => {
          setSelectedProductForDetail(null);
          handleOpenRedeem(productId);
        }}
      />

      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onSuccess={() => setIsAdminPanelOpen(true)}
      />

      <RedeemDownloadModal
        isOpen={isRedeemModalOpen}
        preSelectedProductId={redeemProductId}
        onClose={() => setIsRedeemModalOpen(false)}
      />

      <AdvertiseModal
        isOpen={isAdvertiseModalOpen}
        onClose={() => setIsAdvertiseModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <StoreContent />
    </StoreProvider>
  );
}
