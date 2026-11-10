import React from 'react';
import { X, MessageCircle, ShieldCheck, Check, Code2, Globe, KeyRound } from 'lucide-react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onOpenRedeem: (productId: string) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onOpenRedeem
}) => {
  const { getBuyWhatsappLink } = useStore();

  if (!product) return null;

  const formattedPrice = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(product.price);

  const formattedOriginalPrice = product.originalPrice
    ? new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(product.originalPrice)
    : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl overflow-hidden my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-950/70 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header & Hero Image */}
        <div className="relative aspect-[16/9] w-full bg-slate-950 overflow-hidden">
          <img
            src={product.imageUrl}
            alt={product.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
          <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between gap-4">
            <div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded bg-cyan-950/90 text-cyan-400 border border-cyan-800/80 inline-block mb-1">
                {product.categoryLabel}
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white font-['Outfit']">
                {product.title}
              </h2>
            </div>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
          {/* Tech Stack List */}
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              Tecnologias Utilizadas
            </span>
            <div className="flex flex-wrap gap-2">
              {(product.techStack || []).map((tech, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-800/90 text-slate-200 border border-slate-700/60"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Full Description */}
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              Sobre o Projeto
            </span>
            <p className="text-sm text-slate-300 leading-relaxed">
              {product.fullDescription}
            </p>
          </div>

          {/* Included Features */}
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              O que está incluso no pacote
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {(product.features || []).map((feat, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 text-xs text-slate-300"
                >
                  <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Demo URL if available */}
          {product.demoUrl && (
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-cyan-400" />
                <span className="text-xs text-slate-300">Demonstração Online Disponível</span>
              </div>
              <a
                href={product.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-cyan-400 hover:text-cyan-300 underline font-medium"
              >
                Abrir demonstração
              </a>
            </div>
          )}

          {/* Guarantee Box */}
          <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-800/40 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            <div className="text-xs text-cyan-200/90 leading-relaxed">
              <strong>Autorização & Entrega Segura:</strong> Nada é vendido automaticamente sem a aprovação do desenvolvedor. Ao clicar em comprar, você confirma os dados no WhatsApp (48) 99809-1948, realiza o pagamento seguro e recebe uma senha exclusiva para desbloquear o link de download direto nesta vitrine.
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-6 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-[11px] text-slate-400 uppercase tracking-wider block font-medium">
              Valor para Aquisição Imediata
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-white font-mono tabular-nums">
                {formattedPrice}
              </span>
              {formattedOriginalPrice && (
                <span className="text-sm text-slate-500 line-through font-mono tabular-nums">
                  {formattedOriginalPrice}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => {
                onClose();
                onOpenRedeem(product.id);
              }}
              className="px-3.5 py-2.5 rounded-xl border border-slate-700 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <KeyRound className="w-3.5 h-3.5 text-amber-400" />
              <span>Inserir Senha</span>
            </button>

            <a
              href={getBuyWhatsappLink(product)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm shadow-lg shadow-emerald-950/40 transition-all cursor-pointer whitespace-nowrap"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Comprar Agora no WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
