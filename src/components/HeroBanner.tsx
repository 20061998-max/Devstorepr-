import React from 'react';
import { Search, Sparkles, ShieldCheck, KeyRound, MessageCircle, CheckCircle2 } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface HeroBannerProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
  onOpenRedeemModal: () => void;
  onOpenAdvertiseModal: () => void;
}

const CATEGORIES = [
  { id: 'all', label: 'Todos os Projetos' },
  { id: 'app', label: 'Aplicativos Mobile' },
  { id: 'saas', label: 'SaaS & Web' },
  { id: 'ecommerce', label: 'E-commerce & Lojas' },
  { id: 'script', label: 'Scripts & Automações' }
];

export const HeroBanner: React.FC<HeroBannerProps> = ({
  searchQuery,
  setSearchQuery,
  activeCategory,
  setActiveCategory,
  onOpenRedeemModal,
  onOpenAdvertiseModal
}) => {
  const { whatsappNumber } = useStore();

  return (
    <section className="relative overflow-hidden border-b border-slate-800/60 bg-gradient-to-b from-slate-900/50 via-slate-950 to-slate-950 py-12 md:py-16">
      {/* Subtle background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 max-w-4xl h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Trust Notice */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/40 text-cyan-300 text-xs font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>Compra 100% Segura com Autorização Direta via WhatsApp</span>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-400 text-xs font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>WhatsApp Oficial: (48) 99809-1948</span>
          </div>
        </div>

        {/* Main Headline */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-[1.15] mb-4 font-['Outfit']">
            Vitrine Exclusiva de{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500">
              Apps, Sites & Sistemas Prontos
            </span>
          </h1>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed text-balance">
            Adquira soluções digitais completas com código-fonte aberto, sem mensalidades abusivas e com entrega validada diretamente pelo desenvolvedor.
          </p>
        </div>

        {/* Search Bar & Fast Actions */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative flex items-center">
            <Search className="absolute left-4 w-5 h-5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por aplicativo, site, nicho ou tecnologia (ex: Delivery, CRM, Pix)..."
              className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-sm shadow-xl transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 text-xs text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800 cursor-pointer"
              >
                Limpar
              </button>
            )}
          </div>
        </div>

        {/* Category Tabs (Interactive Segmented Control) */}
        <div className="flex items-center justify-center flex-wrap gap-2 mb-8">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                    : 'bg-slate-900/80 text-slate-300 border border-slate-800 hover:border-slate-700 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Security / How It Works Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-800/60 max-w-4xl mx-auto">
          <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-900/40 border border-slate-800/40">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-white">1. Escolha & Contate</h4>
              <p className="text-[12px] text-slate-400 leading-snug">
                Clique em "Comprar Agora" para falar direto no WhatsApp com o desenvolvedor.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-900/40 border border-slate-800/40">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
              <KeyRound className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-white">2. Receba a Senha Única</h4>
              <p className="text-[12px] text-slate-400 leading-snug">
                Após autorização do pagamento, o admin emite uma senha exclusiva no painel.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-900/40 border border-slate-800/40">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-white">3. Desbloqueie o Download</h4>
              <p className="text-[12px] text-slate-400 leading-snug">
                Insira a chave no site e tenha acesso imediato ao código-fonte e manuais.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
