import React from 'react';
import { ShieldCheck, MessageCircle, Lock, KeyRound } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface FooterProps {
  onOpenAdminLogin: () => void;
  onOpenRedeemModal: () => void;
  onOpenAdvertiseModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenAdminLogin,
  onOpenRedeemModal,
  onOpenAdvertiseModal
}) => {
  const { whatsappNumber } = useStore();

  return (
    <footer className="bg-slate-950 border-t border-slate-900 py-12 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span className="text-base font-extrabold text-white tracking-tight font-['Outfit']">
                DEVSTORE PRO
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed max-w-md text-xs sm:text-sm">
              Plataforma especializada na venda de aplicativos móveis, plataformas SaaS, lojas virtuais e códigos-fonte prontos. Toda transação é autorizada e liberada com senha exclusiva pelo desenvolvedor.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Canal Oficial WhatsApp: <strong>(48) 99809-1948</strong></span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Navegação
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button
                  onClick={onOpenAdvertiseModal}
                  className="hover:text-cyan-400 transition-colors cursor-pointer text-left"
                >
                  Anuncie Aqui no WhatsApp
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenRedeemModal}
                  className="hover:text-amber-400 transition-colors cursor-pointer text-left"
                >
                  Resgatar Download com Senha
                </button>
              </li>
              <li>
                <a
                  href={`https://wa.me/55${whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 transition-colors"
                >
                  Falar no WhatsApp Oficial
                </a>
              </li>
            </ul>
          </div>

          {/* Security & Admin */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Segurança & Acesso
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li className="text-slate-500">
                Entrega com liberação de senha individual
              </li>
              <li className="text-slate-500">
                Sem anúncio livre de terceiros
              </li>
              <li className="pt-2">
                <button
                  onClick={onOpenAdminLogin}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-colors cursor-pointer"
                >
                  <Lock className="w-3 h-3 text-cyan-400" />
                  <span>Área de Administração</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <p>© {new Date().getFullYear()} DevStore. Todos os direitos reservados. Nada é vendido sem autorização.</p>
          <p className="flex items-center gap-2">
            <span>Desenvolvido com padrão profissional</span>
            <span>·</span>
            <span>Atendimento: (48) 99809-1948</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
