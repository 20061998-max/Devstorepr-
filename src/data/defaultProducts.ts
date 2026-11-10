import { Product } from '../types';
import appDeliveryImg from '../assets/images/app_delivery_mockup_1794304771066.jpg';
import saasDashboardImg from '../assets/images/saas_dashboard_mockup_1794304772207.jpg';
import landingEcommerceImg from '../assets/images/landing_ecommerce_mockup_1794304772378.jpg';
import heroSoftwareImg from '../assets/images/hero_software_showcase_1794304770565.jpg';

export const DEFAULT_WHATSAPP_NUMBER = '48998091948';
export const ADMIN_USER = '12480670961';
export const ADMIN_PASS = 'admin2298';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-deliverio-01',
    title: 'Deliverio Pro - App de Delivery Completo (iOS, Android & Web)',
    category: 'app',
    categoryLabel: 'Aplicativo Mobile',
    shortDescription: 'App completo de delivery estilo iFood com rastreamento em tempo real, painel do restaurante e entregador.',
    fullDescription: 'Sistema completo pronto para publicar: Aplicativo para Clientes (React Native / Expo), Aplicativo para Entregadores com rotas no mapa, e Painel Web Administrativo do Lojista. Inclui gateway Pix automático, notificações push e suporte a cardápio digital customizável.',
    price: 850,
    originalPrice: 1290,
    imageUrl: appDeliveryImg,
    hiddenDownloadLink: 'https://drive.google.com/drive/folders/deliverio-pro-full-sourcecode-v34-production',
    techStack: ['React Native', 'Node.js', 'PostgreSQL', 'Socket.io', 'Tailwind'],
    features: [
      'Código-fonte 100% completo e livre de royalties',
      'Rastreamento em tempo real de pedidos e entregadores',
      'Integração nativa de Pix com confirmação automática',
      'Painel de controle com faturamento e estoque',
      'Manual passo a passo de publicação na Google Play e App Store'
    ],
    demoUrl: 'https://demo-deliverio.exemplo.com',
    isAvailable: true,
    createdAt: '2026-03-01'
  },
  {
    id: 'prod-zenith-02',
    title: 'Zenith CRM & SaaS Analytics Multi-Empresa',
    category: 'saas',
    categoryLabel: 'Sistema SaaS',
    shortDescription: 'Plataforma completa de gestão de clientes, funil de vendas, métricas de receita e cobranças recorrentes.',
    fullDescription: 'Software SaaS pronto para você monetizar. Conta com autenticação segura, separação multi-tenant de dados, relatórios financeiros dinâmicos, integração com Mercado Pago/Stripe para cobrança de assinaturas mensais e API REST documentada.',
    price: 1490,
    originalPrice: 2200,
    imageUrl: saasDashboardImg,
    hiddenDownloadLink: 'https://drive.google.com/drive/folders/zenith-saas-enterprise-core-bundle-2026',
    techStack: ['Next.js 15', 'TypeScript', 'Prisma', 'Tailwind CSS', 'Docker'],
    features: [
      'Multi-tenant com isolamento seguro por organização',
      'Assinaturas automatizadas com envio de faturas por e-mail',
      'Gráficos de receita recorrente (MRR), Churn e LTV',
      'Painel de superadministrador para criar e suspender planos',
      'Script de instalação simplificada com Docker'
    ],
    demoUrl: 'https://demo-zenith.exemplo.com',
    isAvailable: true,
    createdAt: '2026-03-04'
  },
  {
    id: 'prod-aura-03',
    title: 'Aura Luxe - E-commerce de Alta Conversão com Checkout Pix',
    category: 'ecommerce',
    categoryLabel: 'Loja Virtual',
    shortDescription: 'Loja virtual ultra-rápida, moderna e responsiva, com compra rápida em 1 clique e painel de pedidos.',
    fullDescription: 'Site de e-commerce profissional de alta performance com design minimalista de luxo. Inclui catálogo de produtos com variações de cor/tamanho, cálculo de frete Melhor Envio, checkout transparente Pix e cartão de crédito, e integração direta com WhatsApp para fechamento rápido de vendas.',
    price: 590,
    originalPrice: 890,
    imageUrl: landingEcommerceImg,
    hiddenDownloadLink: 'https://drive.google.com/drive/folders/aura-luxe-storefront-checkout-prod',
    techStack: ['Next.js', 'React', 'Tailwind CSS', 'SQLite/Postgres', 'Vercel Ready'],
    features: [
      'Carregamento instantâneo com nota 98+ no Google PageSpeed',
      'Checkout rápido com cupom de desconto e frete',
      'Disparo de comprovante de pedido no WhatsApp do cliente',
      'Painel administrativo para cadastrar produtos e fotos',
      'Design responsivo impecável para celulares e computadores'
    ],
    demoUrl: 'https://demo-auraluxe.exemplo.com',
    isAvailable: true,
    createdAt: '2026-03-05'
  },
  {
    id: 'prod-botmaster-04',
    title: 'AutoBot WhatsApp - Disparador & Funil Automático Anti-Ban',
    category: 'script',
    categoryLabel: 'Script & Automação',
    shortDescription: 'Sistema web para disparo em massa seguro, funis de mensagens e autoatendimento inteligente no WhatsApp.',
    fullDescription: 'Automação robusta desenvolvida para empresários e agências. Permite conectar múltiplos números via QR Code, simular digitação humana com pausas personalizadas para evitar bloqueios, agendamento de campanhas e integração via Webhooks com qualquer CRM.',
    price: 380,
    originalPrice: 620,
    imageUrl: heroSoftwareImg,
    hiddenDownloadLink: 'https://drive.google.com/drive/folders/autobot-whatsapp-marketing-engine-v4',
    techStack: ['Node.js', 'Express', 'Baileys', 'React', 'MongoDB/JSON'],
    features: [
      'Conexão de múltiplos chips WhatsApp simultaneamente',
      'Algoritmo anti-ban com intervalo inteligente e randomização de texto',
      'Importador de listas de contatos via planilha Excel/CSV',
      'Auto-resposta programada por palavras-chave',
      'Instalação em VPS Linux ou no seu computador com 1 clique'
    ],
    demoUrl: 'https://demo-autobot.exemplo.com',
    isAvailable: true,
    createdAt: '2026-03-08'
  }
];

export const INITIAL_ACCESS_KEYS = [
  {
    id: 'key-demo-01',
    code: 'PROD-DELIV-8921',
    productId: 'prod-deliverio-01',
    productTitle: 'Deliverio Pro - App de Delivery Completo (iOS, Android & Web)',
    buyerName: 'Carlos Mendes',
    buyerWhatsapp: '11987654321',
    createdAt: '2026-03-09',
    status: 'active' as const,
    usedCount: 0,
    notes: 'Pagamento confirmado via Pix no WhatsApp'
  }
];
