import React, { useState } from 'react';
import { MessageCircle, ExternalLink, KeyRound, Check, Code2, Layers } from 'lucide-react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';

interface ProductCardProps {
  product: Product;
  onOpenDetails: (product: Product) => void;
  onOpenRedeem: (productId: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onOpenDetails,
  onOpenRedeem
}) => {
  const { getBuyWhatsappLink } = useStore();
  const [imageError, setImageError] = useState(false);

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
    <article className="group flex flex-col rounded-2xl bg-slate-900/90 border border-slate-800/90 hover:border-slate-700 overflow-hidden shadow-lg hover:shadow-cyan-950/20 transition-all duration-200">
      {/* Product Image Area */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-950 cursor-pointer" onClick={() => onOpenDetails(product)}>
        {!imageError ? (
          <img
            src={product.imageUrl}
            alt={product.title}
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-slate-900 to-slate-950 text-slate-400">
            <Layers className="w-12 h-12 text-cyan-400/60 mb-2" />
            <span className="text-xs font-semibold text-slate-300 text-center">{product.title}</span>
            <span className="text-[11px] text-slate-500 mt-1">{product.categoryLabel}</span>
          </div>
        )}

        {/* Overlay subtle category tag */}
        <div className="absolute top-3 left-3">
          <span className="text-[11px] font-semibold px-2.5 py-1 rounded-md bg-slate-950/80 backdrop-blur-md text-cyan-300 border border-slate-800">
            {product.categoryLabel}
          </span>
        </div>

        {/* Available indicator */}
        <div className="absolute top-3 right-3">
          <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-emerald-950/80 backdrop-blur-md text-emerald-400 border border-emerald-800/60 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Pronto para entrega
          </span>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Tech Stack Unboxed Metadata */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-2 overflow-hidden text-ellipsis whitespace-nowrap">
            <Code2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span>{(product.techStack || []).slice(0, 3).join(' · ')}</span>
            {(product.techStack || []).length > 3 && (
              <span className="text-slate-500">+{(product.techStack || []).length - 3}</span>
            )}
          </div>

          {/* Title */}
          <h3
            onClick={() => onOpenDetails(product)}
            className="text-base sm:text-lg font-bold text-white hover:text-cyan-400 transition-colors line-clamp-2 cursor-pointer font-['Outfit'] mb-2"
          >
            {product.title}
          </h3>

          {/* Short Description */}
          <p className="text-slate-400 text-xs sm:text-sm line-clamp-2 leading-relaxed mb-4">
            {product.shortDescription}
          </p>

          {/* Key Bullet Highlights */}
          <ul className="space-y-1 mb-4 text-[12px] text-slate-300">
            {(product.features || []).slice(0, 2).map((feat, idx) => (
              <li key={idx} className="flex items-center gap-1.5 truncate">
                <Check className="w-3 h-3 text-cyan-400 shrink-0" />
                <span className="truncate">{feat}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Pricing & Actions */}
        <div className="pt-4 border-t border-slate-800/80">
          <div className="flex items-baseline justify-between mb-3.5">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-slate-400 block font-medium">
                Valor à vista (Pix)
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-xl sm:text-2xl font-black text-white font-mono tabular-nums tracking-tight">
                  {formattedPrice}
                </span>
                {formattedOriginalPrice && (
                  <span className="text-xs text-slate-500 line-through font-mono tabular-nums">
                    {formattedOriginalPrice}
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={() => onOpenDetails(product)}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>Detalhes</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>

          {/* Primary Action Buttons */}
          <div className="space-y-2">
            <a
              href={getBuyWhatsappLink(product)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-emerald-950/40 transition-all cursor-pointer active:scale-[0.99]"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Comprar Agora no WhatsApp</span>
            </a>

            <button
              onClick={() => onOpenRedeem(product.id)}
              className="w-full flex items-center justify-center gap-1.5 py-1.5 text-[11px] text-slate-400 hover:text-amber-300 transition-colors cursor-pointer"
            >
              <KeyRound className="w-3 h-3 text-amber-400" />
              <span>Já comprou? Desbloquear download com senha</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};
