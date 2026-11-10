import React from 'react';
import { ShieldCheck, MessageCircle, Lock, LayoutDashboard, LogOut, KeyRound } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface NavbarProps {
  onOpenAdminLogin: () => void;
  onOpenAdminPanel: () => void;
  onOpenAdvertiseModal: () => void;
  onOpenRedeemModal: () => void;
  activeCategory: string;
  onSelectCategory: (cat: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAdminLogin,
  onOpenAdminPanel,
  onOpenAdvertiseModal,
  onOpenRedeemModal,
  activeCategory,
  onSelectCategory,
}) => {
  const { isAdminLoggedIn, logoutAdmin } = useStore();

  return (
    <header className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onSelectCategory('all')}
            className="flex items-center gap-2.5 text-left group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-5 h-5 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-white flex items-center gap-1.5 font-['Outfit']">
                DEVSTORE
                <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  PRO
                </span>
              </span>
              <p className="text-[11px] text-slate-400 leading-none hidden sm:block">
                Apps, Sites & Soluções Digitais
              </p>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-300">
          <button
            onClick={() => onSelectCategory('all')}
            className={`transition-colors whitespace-nowrap cursor-pointer ${
              activeCategory === 'all'
                ? 'text-cyan-400 font-semibold'
                : 'hover:text-white text-slate-300'
            }`}
          >
            Vitrine Completa
          </button>
          <button
            onClick={() => onSelectCategory('app')}
            className={`transition-colors whitespace-nowrap cursor-pointer ${
              activeCategory === 'app'
                ? 'text-cyan-400 font-semibold'
                : 'hover:text-white text-slate-300'
            }`}
          >
            Apps Mobile
          </button>
          <button
            onClick={() => onSelectCategory('saas')}
            className={`transition-colors whitespace-nowrap cursor-pointer ${
              activeCategory === 'saas'
                ? 'text-cyan-400 font-semibold'
                : 'hover:text-white text-slate-300'
            }`}
          >
            SaaS & Web
          </button>
          <button
            onClick={() => onSelectCategory('ecommerce')}
            className={`transition-colors whitespace-nowrap cursor-pointer ${
              activeCategory === 'ecommerce'
                ? 'text-cyan-400 font-semibold'
                : 'hover:text-white text-slate-300'
            }`}
          >
            Lojas Virtuais
          </button>
          <button
            onClick={onOpenRedeemModal}
            className="flex items-center gap-1.5 text-amber-400 hover:text-amber-300 font-medium transition-colors whitespace-nowrap cursor-pointer"
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Resgatar Download</span>
          </button>
        </nav>

        {/* Zone 3: Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Anuncie Aqui Button */}
          <button
            onClick={onOpenAdvertiseModal}
            className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg bg-emerald-600/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-600/25 hover:border-emerald-500/50 transition-all whitespace-nowrap cursor-pointer shadow-sm hover:shadow-emerald-950/40"
            title="Solicitar anúncio de seu software via WhatsApp 48998091948"
          >
            <MessageCircle className="w-4 h-4 text-emerald-400" />
            <span className="hidden xs:inline">Anuncie Aqui</span>
            <span className="xs:hidden">Anunciar</span>
          </button>

          {/* Administração Button */}
          {isAdminLoggedIn ? (
            <div className="flex items-center gap-1.5">
              <button
                onClick={onOpenAdminPanel}
                className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 hover:brightness-110 transition-all whitespace-nowrap cursor-pointer shadow-md shadow-cyan-500/20"
              >
                <LayoutDashboard className="w-4 h-4 stroke-[2.5]" />
                <span>Painel Admin</span>
              </button>
              <button
                onClick={logoutAdmin}
                className="p-2 text-slate-400 hover:text-red-400 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                title="Sair do modo administrador"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAdminLogin}
              className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg bg-slate-900 text-slate-200 border border-slate-700/80 hover:bg-slate-800 hover:text-white hover:border-slate-600 transition-all whitespace-nowrap cursor-pointer"
              title="Acessar painel do administrador"
            >
              <Lock className="w-3.5 h-3.5 text-cyan-400" />
              <span>Administração</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
