import React, { useState } from 'react';
import {
  Package,
  KeyRound,
  Plus,
  Trash2,
  Edit3,
  Copy,
  Check,
  Eye,
  EyeOff,
  ExternalLink,
  ShieldCheck,
  LogOut,
  RefreshCw,
  Search,
  MessageCircle,
  Tag
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Product } from '../types';
import { INITIAL_PRODUCTS } from '../data/defaultProducts';

interface AdminDashboardProps {
  onClose: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onClose }) => {
  const {
    products,
    accessKeys,
    logoutAdmin,
    addProduct,
    updateProduct,
    deleteProduct,
    generateAccessKey,
    revokeAccessKey,
    resetAllData,
    whatsappNumber
  } = useStore();

  const [activeTab, setActiveTab] = useState<'products' | 'keys' | 'rules'>('products');
  const [searchTerm, setSearchTerm] = useState('');

  // Password Generation Form state
  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id || '');
  const [buyerName, setBuyerName] = useState('');
  const [buyerWhatsapp, setBuyerWhatsapp] = useState('');
  const [buyerNotes, setBuyerNotes] = useState('');
  const [lastGeneratedKey, setLastGeneratedKey] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState(false);

  // New Product Modal state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [productForm, setProductForm] = useState({
    title: '',
    category: 'app' as Product['category'],
    categoryLabel: 'Aplicativo Mobile',
    shortDescription: '',
    fullDescription: '',
    price: 499,
    originalPrice: 799,
    imageUrl: INITIAL_PRODUCTS[0]?.imageUrl || '',
    hiddenDownloadLink: '',
    techStack: 'React Native, Node.js, TypeScript',
    features: 'Código 100% aberto\nSuporte na instalação\nSem royalties',
    demoUrl: '',
    isAvailable: true
  });

  // Reveal hidden download link toggle in table
  const [revealedLinks, setRevealedLinks] = useState<Record<string, boolean>>({});

  const toggleRevealLink = (productId: string) => {
    setRevealedLinks((prev) => ({ ...prev, [productId]: !prev[productId] }));
  };

  const handleOpenNewProduct = () => {
    setEditingProductId(null);
    setProductForm({
      title: '',
      category: 'app',
      categoryLabel: 'Aplicativo Mobile',
      shortDescription: '',
      fullDescription: '',
      price: 500,
      originalPrice: 800,
      imageUrl: INITIAL_PRODUCTS[0]?.imageUrl || '',
      hiddenDownloadLink: 'https://drive.google.com/drive/folders/novo-projeto-sourcecode',
      techStack: 'React, Node.js, Tailwind',
      features: 'Código-fonte completo\nDocumentação de instalação\nPronto para produção',
      demoUrl: '',
      isAvailable: true
    });
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod: Product) => {
    setEditingProductId(prod.id);
    setProductForm({
      title: prod.title,
      category: prod.category,
      categoryLabel: prod.categoryLabel,
      shortDescription: prod.shortDescription,
      fullDescription: prod.fullDescription,
      price: prod.price,
      originalPrice: prod.originalPrice || prod.price * 1.4,
      imageUrl: prod.imageUrl,
      hiddenDownloadLink: prod.hiddenDownloadLink,
      techStack: prod.techStack.join(', '),
      features: prod.features.join('\n'),
      demoUrl: prod.demoUrl || '',
      isAvailable: prod.isAvailable
    });
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();

    const techArray = productForm.techStack
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const featuresArray = productForm.features
      .split('\n')
      .map((f) => f.trim())
      .filter(Boolean);

    const categoryLabels: Record<string, string> = {
      app: 'Aplicativo Mobile',
      saas: 'Sistema SaaS',
      website: 'Site Institucional',
      ecommerce: 'Loja Virtual',
      script: 'Script & Automação'
    };

    if (editingProductId) {
      updateProduct(editingProductId, {
        title: productForm.title,
        category: productForm.category,
        categoryLabel: categoryLabels[productForm.category] || 'Software',
        shortDescription: productForm.shortDescription,
        fullDescription: productForm.fullDescription,
        price: Number(productForm.price),
        originalPrice: Number(productForm.originalPrice),
        imageUrl: productForm.imageUrl,
        hiddenDownloadLink: productForm.hiddenDownloadLink,
        techStack: techArray,
        features: featuresArray,
        demoUrl: productForm.demoUrl,
        isAvailable: productForm.isAvailable
      });
    } else {
      addProduct({
        title: productForm.title,
        category: productForm.category,
        categoryLabel: categoryLabels[productForm.category] || 'Software',
        shortDescription: productForm.shortDescription,
        fullDescription: productForm.fullDescription,
        price: Number(productForm.price),
        originalPrice: Number(productForm.originalPrice),
        imageUrl: productForm.imageUrl,
        hiddenDownloadLink: productForm.hiddenDownloadLink,
        techStack: techArray,
        features: featuresArray,
        demoUrl: productForm.demoUrl,
        isAvailable: productForm.isAvailable
      });
    }

    setIsProductModalOpen(false);
  };

  const handleGenerateKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductId || !buyerName) return;

    const newKey = generateAccessKey(
      selectedProductId,
      buyerName,
      buyerWhatsapp || 'Não informado',
      buyerNotes || 'Venda confirmada via WhatsApp'
    );

    setLastGeneratedKey(newKey.code);
    setBuyerName('');
    setBuyerWhatsapp('');
    setBuyerNotes('');
  };

  const getWhatsappMessageToSend = (code: string) => {
    const keyItem = accessKeys.find((k) => k.code === code);
    const prod = products.find((p) => p.id === keyItem?.productId);
    const buyer = keyItem ? keyItem.buyerName : 'Cliente';
    const prodTitle = prod ? prod.title : 'Produto';

    return `Olá ${buyer}! Pagamento confirmado com sucesso para o produto:

📦 *${prodTitle}*

🔑 *Sua Senha Exclusiva de Download:*
👉 *${code}*

Para resgatar seu código-fonte:
1. Acesse o nosso site
2. Clique no botão "Resgatar Download" no topo da página
3. Digite sua senha acima para liberar o link do Google Drive/GitHub!`;
  };

  const copyToClipboard = (text: string, type: 'key' | 'message') => {
    navigator.clipboard.writeText(text);
    if (type === 'key') {
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
    } else {
      setCopiedMessage(true);
      setTimeout(() => setCopiedMessage(false), 2000);
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.categoryLabel.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.techStack.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-16">
      {/* Top Bar for Admin */}
      <div className="bg-slate-900 border-b border-slate-800 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-sm sm:text-base">
                  Painel de Controle do Administrador
                </span>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                  Acesso Autorizado
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Controle exclusivo de anúncios, preços e emissão de senhas de download
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 border border-slate-700 transition-colors cursor-pointer"
            >
              Ver Vitrine
            </button>
            <button
              onClick={() => {
                logoutAdmin();
                onClose();
              }}
              className="px-3 py-1.5 rounded-lg bg-red-950/60 hover:bg-red-900/60 text-red-300 text-xs border border-red-800/80 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sair</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3 mb-8 overflow-x-auto">
          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'products'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'bg-slate-900 text-slate-300 border border-slate-800 hover:text-white'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Gerenciar Produtos & Preços ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('keys')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'keys'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'bg-slate-900 text-slate-300 border border-slate-800 hover:text-white'
            }`}
          >
            <KeyRound className="w-4 h-4" />
            <span>Gerador de Senhas de Download ({accessKeys.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('rules')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'rules'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'bg-slate-900 text-slate-300 border border-slate-800 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Regras de Anúncios & WhatsApp</span>
          </button>
        </div>

        {/* TAB 1: PRODUCTS & PRICES MANAGEMENT */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            {/* Top Product Controls */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Filtrar por nome ou tecnologia..."
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleOpenNewProduct}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm transition-all shadow-md shadow-emerald-950/40 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Cadastrar Novo Produto</span>
                </button>
              </div>
            </div>

            {/* Products Table */}
            <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-slate-950 text-slate-400 uppercase text-[11px] tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4">Arte / Produto</th>
                      <th className="py-3 px-4">Categoria</th>
                      <th className="py-3 px-4">Preço (R$)</th>
                      <th className="py-3 px-4">Link de Download Oculto</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {filteredProducts.map((prod) => (
                      <tr key={prod.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={prod.imageUrl}
                              alt={prod.title}
                              className="w-12 h-9 rounded-lg object-cover bg-slate-950 shrink-0 border border-slate-800"
                            />
                            <div className="max-w-xs">
                              <span className="font-semibold text-white block truncate">
                                {prod.title}
                              </span>
                              <span className="text-[11px] text-slate-400 truncate block">
                                ID: #{prod.id}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap text-slate-300">
                          {prod.categoryLabel}
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white font-mono tabular-nums">
                              R$ {prod.price.toFixed(2)}
                            </span>
                            <div className="relative inline-block">
                              <input
                                type="number"
                                defaultValue={prod.price}
                                onBlur={(e) => {
                                  const val = parseFloat(e.target.value);
                                  if (!isNaN(val) && val > 0) {
                                    updateProduct(prod.id, { price: val });
                                  }
                                }}
                                className="w-20 px-2 py-1 rounded bg-slate-950 border border-slate-700 text-xs font-mono text-cyan-400 text-right focus:outline-none focus:border-cyan-500"
                                title="Altere e clique fora para salvar o novo preço"
                              />
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 max-w-xs">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-xs text-slate-400 truncate max-w-[180px]">
                              {revealedLinks[prod.id] ? prod.hiddenDownloadLink : '••••••••••••••••••••'}
                            </span>
                            <button
                              onClick={() => toggleRevealLink(prod.id)}
                              className="p-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
                              title={revealedLinks[prod.id] ? 'Ocultar link' : 'Ver link'}
                            >
                              {revealedLinks[prod.id] ? (
                                <EyeOff className="w-3.5 h-3.5" />
                              ) : (
                                <Eye className="w-3.5 h-3.5" />
                              )}
                            </button>
                            {revealedLinks[prod.id] && (
                              <a
                                href={prod.hiddenDownloadLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1 text-cyan-400 hover:text-cyan-300"
                                title="Testar link de download"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            )}
                          </div>
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <button
                            onClick={() =>
                              updateProduct(prod.id, { isAvailable: !prod.isAvailable })
                            }
                            className={`px-2.5 py-1 rounded text-xs font-semibold cursor-pointer ${
                              prod.isAvailable
                                ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800'
                                : 'bg-slate-800 text-slate-400 border border-slate-700'
                            }`}
                          >
                            {prod.isAvailable ? 'Ativo na Vitrine' : 'Pausado'}
                          </button>
                        </td>

                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleOpenEditProduct(prod)}
                              className="p-2 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition-colors cursor-pointer"
                              title="Editar Produto e Preço"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Deseja remover "${prod.title}" da vitrine?`)) {
                                  deleteProduct(prod.id);
                                }
                              }}
                              className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors cursor-pointer"
                              title="Excluir Produto"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ACCESS KEY & PASSWORD GENERATOR */}
        {activeTab === 'keys' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: Generator Form */}
            <div className="lg:col-span-5 space-y-6">
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center">
                    <KeyRound className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white font-['Outfit']">
                      Gerar Senha de Download
                    </h3>
                    <p className="text-xs text-slate-400">
                      Gere a chave exclusiva após confirmar o pagamento no WhatsApp.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleGenerateKey} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                      Selecione o Produto Vendido
                    </label>
                    <select
                      value={selectedProductId}
                      onChange={(e) => setSelectedProductId(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm focus:outline-none focus:border-cyan-500"
                    >
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.title} (R$ {p.price})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                      Nome do Comprador
                    </label>
                    <input
                      type="text"
                      value={buyerName}
                      onChange={(e) => setBuyerName(e.target.value)}
                      required
                      placeholder="Ex: Rafael Silva"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                      WhatsApp do Comprador
                    </label>
                    <input
                      type="text"
                      value={buyerWhatsapp}
                      onChange={(e) => setBuyerWhatsapp(e.target.value)}
                      placeholder="Ex: 48998091948"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                      Observação de Pagamento
                    </label>
                    <input
                      type="text"
                      value={buyerNotes}
                      onChange={(e) => setBuyerNotes(e.target.value)}
                      placeholder="Ex: Pix confirmado de R$ 850"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <KeyRound className="w-4 h-4 stroke-[2.5]" />
                    <span>Emitir Senha & Liberar Download</span>
                  </button>
                </form>

                {/* Generated Key Result */}
                {lastGeneratedKey && (
                  <div className="mt-6 p-4 rounded-xl bg-slate-950 border border-amber-500/40 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                        Senha Gerada com Sucesso:
                      </span>
                      <button
                        onClick={() => copyToClipboard(lastGeneratedKey, 'key')}
                        className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
                      >
                        {copiedKey ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedKey ? 'Copiada!' : 'Copiar'}</span>
                      </button>
                    </div>

                    <div className="p-3 bg-slate-900 rounded-lg text-center font-mono text-xl font-bold tracking-widest text-amber-300 select-all border border-slate-800">
                      {lastGeneratedKey}
                    </div>

                    <button
                      onClick={() =>
                        copyToClipboard(getWhatsappMessageToSend(lastGeneratedKey), 'message')
                      }
                      className="w-full py-2 px-3 rounded-lg bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-600/30 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors"
                    >
                      <MessageCircle className="w-4 h-4 text-emerald-400" />
                      <span>
                        {copiedMessage
                          ? 'Mensagem Completa Copiada!'
                          : 'Copiar Mensagem Pronta para o WhatsApp'}
                      </span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Right: History of Issued Keys */}
            <div className="lg:col-span-7">
              <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold text-white font-['Outfit']">
                    Histórico de Senhas Emitidas
                  </h3>
                  <span className="text-xs text-slate-400">
                    Total: {accessKeys.length} senhas
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                      <tr>
                        <th className="py-2.5 px-3">Senha / Código</th>
                        <th className="py-2.5 px-3">Comprador</th>
                        <th className="py-2.5 px-3">Produto</th>
                        <th className="py-2.5 px-3">Status</th>
                        <th className="py-2.5 px-3 text-right">Ação</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80">
                      {accessKeys.map((keyItem) => (
                        <tr key={keyItem.id} className="hover:bg-slate-800/40">
                          <td className="py-3 px-3 font-mono font-bold text-amber-400 whitespace-nowrap">
                            {keyItem.code}
                          </td>
                          <td className="py-3 px-3">
                            <span className="font-medium text-white block">{keyItem.buyerName}</span>
                            <span className="text-[11px] text-slate-400 font-mono">
                              {keyItem.buyerWhatsapp}
                            </span>
                          </td>
                          <td className="py-3 px-3 max-w-[160px] truncate text-slate-300">
                            {keyItem.productTitle}
                          </td>
                          <td className="py-3 px-3 whitespace-nowrap">
                            <span
                              className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                                keyItem.status === 'active'
                                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                                  : 'bg-red-950 text-red-400 border border-red-800'
                              }`}
                            >
                              {keyItem.status === 'active' ? 'Ativa' : 'Revogada'}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right whitespace-nowrap">
                            {keyItem.status === 'active' && (
                              <button
                                onClick={() => revokeAccessKey(keyItem.id)}
                                className="text-xs text-red-400 hover:text-red-300 font-medium cursor-pointer"
                              >
                                Revogar
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ADVERTISING RULES & CONTACT INFO */}
        {activeTab === 'rules' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white font-['Outfit']">
                    Política de Anúncios Exclusiva
                  </h3>
                  <p className="text-xs text-slate-400">
                    Garantia de segurança e curadoria total do administrador
                  </p>
                </div>
              </div>

              <div className="space-y-3 text-sm text-slate-300 leading-relaxed border-t border-slate-800 pt-4">
                <p>
                  <strong>1. Ninguém tem permissão para anunciar diretamente:</strong> Todos os anúncios na vitrine passam exclusivamente pela sua aprovação manual. Nenhum usuário externo pode publicar produtos sem a sua validação.
                </p>
                <p>
                  <strong>2. Botão "Anuncie Aqui" na Vitrine:</strong> Visitantes e outros desenvolvedores que quiserem anunciar seus produtos encontram um botão direto na vitrine que abre o WhatsApp <strong>(48) 99809-1948</strong> para negociar com você.
                </p>
                <p>
                  <strong>3. Liberação Segura por Senha:</strong> Todos os produtos contêm um link de download oculto. Quando um cliente adquire o software pelo WhatsApp, você emite a senha na aba <em>"Gerador de Senhas"</em>. O cliente usa essa senha no botão <em>"Resgatar Download"</em> para acessar os arquivos do projeto.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 block">WhatsApp de Contato Configurado:</span>
                  <span className="text-base font-bold text-white font-mono">
                    (48) 99809-1948
                  </span>
                </div>
                <a
                  href={`https://wa.me/55${whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Testar WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Reset data helper */}
            <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-300 block">
                  Restaurar Dados Padrão de Demonstração
                </span>
                <span className="text-[11px] text-slate-500">
                  Restaura os produtos e senhas originais se você desejar limpar testes.
                </span>
              </div>
              <button
                onClick={() => {
                  if (confirm('Deseja restaurar todos os produtos e senhas padrão?')) {
                    resetAllData();
                  }
                }}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Restaurar</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* MODAL: ADD / EDIT PRODUCT */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-6 sm:p-8 my-8">
            <h3 className="text-xl font-bold text-white font-['Outfit'] mb-4">
              {editingProductId ? 'Editar Produto e Preço' : 'Cadastrar Novo Produto na Vitrine'}
            </h3>

            <form onSubmit={handleSaveProduct} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Título do Produto
                </label>
                <input
                  type="text"
                  value={productForm.title}
                  onChange={(e) => setProductForm({ ...productForm, title: e.target.value })}
                  required
                  placeholder="Ex: App de Gestão Financeira Completo"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Categoria
                  </label>
                  <select
                    value={productForm.category}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        category: e.target.value as Product['category']
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-cyan-500"
                  >
                    <option value="app">Aplicativo Mobile</option>
                    <option value="saas">Sistema SaaS</option>
                    <option value="ecommerce">Loja Virtual</option>
                    <option value="website">Site Institucional</option>
                    <option value="script">Script & Automação</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Preço (R$)
                  </label>
                  <input
                    type="number"
                    value={productForm.price}
                    onChange={(e) =>
                      setProductForm({ ...productForm, price: parseFloat(e.target.value) || 0 })
                    }
                    required
                    min="1"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Link de Download Oculto (Google Drive, GitHub, ZIP etc.)
                </label>
                <input
                  type="text"
                  value={productForm.hiddenDownloadLink}
                  onChange={(e) =>
                    setProductForm({ ...productForm, hiddenDownloadLink: e.target.value })
                  }
                  required
                  placeholder="https://drive.google.com/drive/folders/seu-arquivo-secreto"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm font-mono focus:outline-none focus:border-cyan-500"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  🔒 Este link nunca é exposto na vitrine pública. Ele só é liberado para quem inserir a senha gerada.
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  URL da Arte / Imagem de Capa
                </label>
                <input
                  type="text"
                  value={productForm.imageUrl}
                  onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })}
                  required
                  placeholder="URL da imagem ou selecione um preset abaixo..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-cyan-500 mb-2"
                />
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[11px] text-slate-400">Presets rápidos:</span>
                  {INITIAL_PRODUCTS.map((initProd, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setProductForm({ ...productForm, imageUrl: initProd.imageUrl })}
                      className="px-2 py-1 text-[11px] rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors cursor-pointer"
                    >
                      {initProd.categoryLabel}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Descrição Curta (para a Vitrine)
                </label>
                <input
                  type="text"
                  value={productForm.shortDescription}
                  onChange={(e) =>
                    setProductForm({ ...productForm, shortDescription: e.target.value })
                  }
                  required
                  placeholder="Resumo em 1 ou 2 frases para o card da vitrine..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Descrição Completa
                </label>
                <textarea
                  value={productForm.fullDescription}
                  onChange={(e) =>
                    setProductForm({ ...productForm, fullDescription: e.target.value })
                  }
                  rows={3}
                  required
                  placeholder="Detalhes completos sobre o sistema..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Tecnologias (separadas por vírgula)
                </label>
                <input
                  type="text"
                  value={productForm.techStack}
                  onChange={(e) => setProductForm({ ...productForm, techStack: e.target.value })}
                  placeholder="React Native, Node.js, PostgreSQL"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Itens Inclusos / Recursos (um por linha)
                </label>
                <textarea
                  value={productForm.features}
                  onChange={(e) => setProductForm({ ...productForm, features: e.target.value })}
                  rows={3}
                  placeholder="Código-fonte 100% completo&#10;Manual de instalação&#10;Painel administrativo"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold shadow-md shadow-cyan-500/20 cursor-pointer"
                >
                  Salvar Produto na Vitrine
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
