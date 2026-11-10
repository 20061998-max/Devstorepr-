import React from 'react';
import { X, MessageCircle, ShieldCheck, CheckCircle2, Send, Lock } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface AdvertiseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdvertiseModal: React.FC<AdvertiseModalProps> = ({ isOpen, onClose }) => {
  const { getAdvertiseWhatsappLink, whatsappNumber } = useStore();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-700/80 shadow-2xl p-6 sm:p-8 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mb-4">
          <MessageCircle className="w-6 h-6" />
        </div>

        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center gap-1">
            <Lock className="w-3 h-3" />
            Curadoria Exclusiva
          </span>
          <span className="text-xs text-slate-400">WhatsApp Oficial</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-white font-['Outfit'] mb-2">
          Anuncie Seu Software Aqui
        </h2>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-5">
          Para proteger compradores e garantir códigos-fonte funcionais, <strong className="text-white">ninguém anuncia diretamente na vitrine</strong>. Todos os projetos são avaliados e publicados exclusivamente pelo administrador.
        </p>

        {/* Benefits & Steps */}
        <div className="space-y-3 mb-6 bg-slate-950/70 p-4 rounded-xl border border-slate-800 text-xs text-slate-300">
          <div className="font-semibold text-white mb-1">O que enviar na mensagem do WhatsApp:</div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>Nome do software e tipo (App Mobile, SaaS, Site, Script etc.)</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>Tecnologias utilizadas no desenvolvimento</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>Preço de venda desejado</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>Link de demonstração online ou vídeo de funcionamento</span>
          </div>
        </div>

        <a
          href={getAdvertiseWhatsappLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-950/50 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Send className="w-4 h-4" />
          <span>Falar com o Administrador no WhatsApp (48) 99809-1948</span>
        </a>

        <p className="text-[11px] text-slate-500 text-center mt-3">
          Atendimento direto e seguro com o desenvolvedor responsável.
        </p>
      </div>
    </div>
  );
};
