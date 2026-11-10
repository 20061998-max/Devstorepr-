import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, AccessKey } from '../types';
import {
  INITIAL_PRODUCTS,
  INITIAL_ACCESS_KEYS,
  DEFAULT_WHATSAPP_NUMBER,
  ADMIN_USER,
  ADMIN_PASS
} from '../data/defaultProducts';

interface StoreContextType {
  products: Product[];
  accessKeys: AccessKey[];
  isAdminLoggedIn: boolean;
  whatsappNumber: string;
  loginAdmin: (user: string, pass: string) => boolean;
  logoutAdmin: () => void;
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => Product;
  updateProduct: (id: string, updated: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  generateAccessKey: (productId: string, buyerName: string, buyerWhatsapp: string, notes?: string) => AccessKey;
  verifyAccessKey: (code: string, productId?: string) => { success: boolean; product?: Product; key?: AccessKey; message: string };
  revokeAccessKey: (keyId: string) => void;
  resetAllData: () => void;
  getBuyWhatsappLink: (product: Product) => string;
  getAdvertiseWhatsappLink: () => string;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PRODUCTS: 'devstore_products_v1',
  KEYS: 'devstore_keys_v1',
  ADMIN_SESSION: 'devstore_admin_session_v1',
  WHATSAPP: 'devstore_whatsapp_v1'
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Normalize any legacy image paths from early testing to current bundled image imports
          return parsed.map((item: Product) => {
            const initialMatch = INITIAL_PRODUCTS.find((p) => p.id === item.id);
            if (initialMatch && (!item.imageUrl || item.imageUrl.startsWith('/src/assets/images/'))) {
              return { ...item, imageUrl: initialMatch.imageUrl };
            }
            return item;
          });
        }
      }
    } catch {
      // fallback
    }
    return INITIAL_PRODUCTS;
  });

  const [accessKeys, setAccessKeys] = useState<AccessKey[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.KEYS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // fallback
    }
    return INITIAL_ACCESS_KEYS;
  });

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.ADMIN_SESSION) === 'true';
    } catch {
      return false;
    }
  });

  const [whatsappNumber] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.WHATSAPP) || DEFAULT_WHATSAPP_NUMBER;
    } catch {
      return DEFAULT_WHATSAPP_NUMBER;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    } catch {
      // quota or private mode
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.KEYS, JSON.stringify(accessKeys));
    } catch {
      // ignore
    }
  }, [accessKeys]);

  const loginAdmin = (user: string, pass: string): boolean => {
    const trimmedUser = user.trim();
    const trimmedPass = pass.trim();

    if (trimmedUser === ADMIN_USER && trimmedPass === ADMIN_PASS) {
      setIsAdminLoggedIn(true);
      try {
        localStorage.setItem(STORAGE_KEYS.ADMIN_SESSION, 'true');
      } catch {
        // ignore
      }
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
    try {
      localStorage.removeItem(STORAGE_KEYS.ADMIN_SESSION);
    } catch {
      // ignore
    }
  };

  const addProduct = (data: Omit<Product, 'id' | 'createdAt'>): Product => {
    const newProduct: Product = {
      ...data,
      id: `prod-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setProducts((prev) => [newProduct, ...prev]);
    return newProduct;
  };

  const updateProduct = (id: string, updated: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updated } : item))
    );
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((item) => item.id !== id));
  };

  const generateAccessKey = (
    productId: string,
    buyerName: string,
    buyerWhatsapp: string,
    notes?: string
  ): AccessKey => {
    const targetProduct = products.find((p) => p.id === productId);
    const prefix = targetProduct ? targetProduct.category.toUpperCase().slice(0, 4) : 'DEV';
    const randomCode = `${prefix}-${Math.floor(1000 + Math.random() * 9000)}-${Math.random().toString(36).substring(2, 5).toUpperCase()}`;

    const newKey: AccessKey = {
      id: `key-${Date.now()}`,
      code: randomCode,
      productId,
      productTitle: targetProduct ? targetProduct.title : 'Produto DevStore',
      buyerName: buyerName.trim(),
      buyerWhatsapp: buyerWhatsapp.trim(),
      createdAt: new Date().toISOString().split('T')[0],
      status: 'active',
      usedCount: 0,
      notes: notes || 'Venda validada e autorizada pelo administrador'
    };

    setAccessKeys((prev) => [newKey, ...prev]);
    return newKey;
  };

  const verifyAccessKey = (
    code: string,
    productId?: string
  ): { success: boolean; product?: Product; key?: AccessKey; message: string } => {
    const cleanCode = code.trim().toUpperCase();
    if (!cleanCode) {
      return { success: false, message: 'Por favor, digite a senha/código de acesso recebida pelo WhatsApp.' };
    }

    const foundKey = accessKeys.find(
      (k) => k.code.toUpperCase() === cleanCode && k.status === 'active'
    );

    if (!foundKey) {
      return {
        success: false,
        message: 'Senha de acesso inválida ou expirada. Verifique com o administrador no WhatsApp.'
      };
    }

    if (productId && foundKey.productId !== productId) {
      return {
        success: false,
        message: 'Esta senha pertence a outro produto do catálogo. Verifique o produto selecionado.'
      };
    }

    const product = products.find((p) => p.id === foundKey.productId);
    if (!product) {
      return {
        success: false,
        message: 'Produto vinculado a esta chave não foi localizado no catálogo.'
      };
    }

    // Increment used count
    setAccessKeys((prev) =>
      prev.map((k) =>
        k.id === foundKey.id ? { ...k, usedCount: (k.usedCount || 0) + 1 } : k
      )
    );

    return {
      success: true,
      product,
      key: foundKey,
      message: 'Chave validada com sucesso! O download foi liberado.'
    };
  };

  const revokeAccessKey = (keyId: string) => {
    setAccessKeys((prev) =>
      prev.map((k) => (k.id === keyId ? { ...k, status: 'revoked' } : k))
    );
  };

  const resetAllData = () => {
    setProducts(INITIAL_PRODUCTS);
    setAccessKeys(INITIAL_ACCESS_KEYS);
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
      localStorage.setItem(STORAGE_KEYS.KEYS, JSON.stringify(INITIAL_ACCESS_KEYS));
    } catch {
      // ignore
    }
  };

  const getBuyWhatsappLink = (product: Product): string => {
    const formattedPrice = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(product.price);

    const message = `Olá! Tenho interesse em adquirir o produto abaixo na sua vitrine:

*Produto:* ${product.title}
*Código:* #${product.id}
*Valor:* ${formattedPrice}

Gostaria de saber as formas de pagamento (Pix) e como recebo a senha de liberação do download.`;

    const encoded = encodeURIComponent(message);
    return `https://wa.me/55${whatsappNumber}?text=${encoded}`;
  };

  const getAdvertiseWhatsappLink = (): string => {
    const message = `Olá! Gostaria de solicitar o anúncio de um aplicativo/site na vitrine DevStore.

Gostaria de apresentar meu software para que você avalie o código e possamos combinar o anúncio com entrega segura.`;

    const encoded = encodeURIComponent(message);
    return `https://wa.me/55${whatsappNumber}?text=${encoded}`;
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        accessKeys,
        isAdminLoggedIn,
        whatsappNumber,
        loginAdmin,
        logoutAdmin,
        addProduct,
        updateProduct,
        deleteProduct,
        generateAccessKey,
        verifyAccessKey,
        revokeAccessKey,
        resetAllData,
        getBuyWhatsappLink,
        getAdvertiseWhatsappLink
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
