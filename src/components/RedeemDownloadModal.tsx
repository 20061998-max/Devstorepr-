import React, { useState, useEffect } from 'react';
import { X, KeyRound, Download, CheckCircle2, AlertCircle, MessageCircle, ExternalLink, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Product, AccessKey } from '../types';

interface RedeemDownloadModalProps {
  isOpen: boolean;
  preSelectedProductId?: string | null;
  onClose: () => void;
}

export const RedeemDownloadModal: React.FC<RedeemDownloadModalProps> = ({
  isOpen,
  preSelectedProductId,
  onClose
}) => {
  const { verifyAccessKey, products, whatsappNumber } = useStore();
  const [accessCode, setAccessCode] = useState('');
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [errorFeedback, setErrorFeedback] = useState<string | null>(null);
  const [unlockedData, setUnlockedData] = useState<{ product: Product; key: AccessKey } | null>(null);

  useEffect(() => {
    if (preSelectedProductId) {
      setSelectedProductId(preSelectedProductId);
    } else {
      setSelectedProductId('');
    }
    setAccessCode('');
    setErrorFeedback(null);
    setUnlockedData(null);
  }, [isOpen, preSelectedProductId]);

  if (!isOpen) return null;

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorFeedback(null);

    const result = verifyAccessKey(accessCode, selectedProductId || undefined);
    if (result.success && result.product && result.key) {
      setUnlockedData({
        product: result.product,
        key: result.key
      });
    } else {
      setErrorFeedback(result.message);
    }
  };

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

        {!unlockedData ? (
          <div>
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mb-4">
              <KeyRound className="w-6 h-6" />
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-white font-['Outfit'] mb-1">
              Resgatar Link de Download
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mb-6">
              Digite a senha/chave exclusiva que você recebeu do desenvolvedor no WhatsApp após a confirmação do pagamento.
            </p>

            {errorFeedback && (
              <div className="mb-4 p-3.5 rounded-xl bg-red-950/60 border border-red-800/80 text-red-300 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
                <div className="leading-snug">{errorFeedback}</div>
              </div>
            )}

            <form onSubmit={handleVerify} className="space-y-4">
              {products.length > 0 && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Produto (Opcional)
                  </label>
                  <select
                    value={selectedProductId}
                    onChange={(e) => setSelectedProductId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm focus:outline-none focus:border-cyan-500"
                  >
                    <option value="">Qualquer Produto Comprado</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Sua Senha / Chave de Acesso
                </label>
                <input
                  type="text"
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value)}
                  required
                  placeholder="Ex: PROD-DELIV-8921"
                  className="w-full px-3.5 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white text-base font-mono tracking-wider placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 uppercase"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Dica: Verifique a mensagem enviada no seu WhatsApp pelo número (48) 99809-1948.
                </span>
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <KeyRound className="w-4 h-4 stroke-[2.5]" />
                <span>Desbloquear Link de Download</span>
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-slate-800 text-center">
              <span className="text-xs text-slate-400 block mb-1">
                Ainda não comprou ou não recebeu sua chave?
              </span>
              <a
                href={`https://wa.me/55${whatsappNumber}?text=${encodeURIComponent('Olá! Fiz uma compra mas ainda não recebi minha senha de acesso ao download. Poderia me ajudar?')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-medium"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Falar com o Administrador no WhatsApp</span>
              </a>
            </div>
          </div>
        ) : (
          /* UNLOCKED SUCCESS STATE */
          <div className="text-center space-y-4 animate-fade-in">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8 stroke-[2]" />
            </div>

            <div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 inline-flex items-center gap-1 mb-2">
                <Sparkles className="w-3 h-3 text-emerald-400" />
                Acesso Autorizado pelo Desenvolvedor
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white font-['Outfit']">
                Download Desbloqueado!
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Comprador identificado: <strong className="text-white">{unlockedData.key.buyerName}</strong>
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-left flex items-center gap-3">
              <img
                src={unlockedData.product.imageUrl}
                alt={unlockedData.product.title}
                className="w-14 h-14 rounded-lg object-cover bg-slate-900 border border-slate-800 shrink-0"
              />
              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-bold text-white truncate">
                  {unlockedData.product.title}
                </h4>
                <p className="text-xs text-slate-400 truncate">
                  {unlockedData.product.categoryLabel} · Pacote Completo de Código-Fonte
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-800/50 text-left space-y-2">
              <span className="text-xs font-semibold text-cyan-300 uppercase tracking-wider block">
                Link Oficial de Download Seguro:
              </span>
              <a
                href={unlockedData.product.hiddenDownloadLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4 stroke-[2.5]" />
                <span>Acessar Arquivos & Download</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <span className="text-[11px] text-slate-400 block text-center mt-1">
                Link de alta velocidade (Google Drive / Armazenamento Cloud)
              </span>
            </div>

            <div className="text-xs text-slate-400 text-left space-y-1 bg-slate-950/60 p-3 rounded-lg border border-slate-800">
              <div className="font-semibold text-white">Instruções de Instalação:</div>
              <div>1. Descompacte o arquivo .ZIP baixado no seu computador.</div>
              <div>2. Abra o arquivo README.md com o passo a passo de configuração.</div>
              <div>3. Qualquer dúvida, chame o desenvolvedor no WhatsApp (48) 99809-1948.</div>
            </div>

            <button
              onClick={() => {
                setUnlockedData(null);
                setAccessCode('');
                onClose();
              }}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
            >
              Concluir & Fechar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
