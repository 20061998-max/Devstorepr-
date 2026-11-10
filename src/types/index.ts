export interface Product {
  id: string;
  title: string;
  category: 'app' | 'saas' | 'website' | 'script' | 'ecommerce';
  categoryLabel: string;
  shortDescription: string;
  fullDescription: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  hiddenDownloadLink: string;
  techStack: string[];
  features: string[];
  demoUrl?: string;
  isAvailable: boolean;
  createdAt: string;
}

export interface AccessKey {
  id: string;
  code: string;
  productId: string;
  productTitle: string;
  buyerName: string;
  buyerWhatsapp: string;
  createdAt: string;
  status: 'active' | 'used' | 'revoked';
  usedCount: number;
  notes?: string;
}
