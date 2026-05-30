"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useSession } from "next-auth/react";
import { apiDelete, apiGet, apiPatch, apiPost } from "./fetch";
import type { CartLine } from "@/modules/entities/Cart";

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  image: string | null;
  quantity: number;
  slug: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const toUI = (line: CartLine): CartItem => ({
  productId: String(line.productId),
  name: line.product.name,
  price: line.product.price,
  image: line.product.imageUrl,
  quantity: line.qty,
  slug: line.product.slug,
});

/**
 * Cart customer disinkronkan ke server (`/api/public/cart`) saat user
 * login, sehingga cart ikut berpindah lintas browser. Saat user belum
 * login, state lokal kosong — halaman produk sudah memaksa login sebelum
 * "Tambah ke Keranjang", jadi tidak ada akumulasi data tanpa identitas.
 */
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const { status } = useSession();
  const isAuthed = status === "authenticated";

  const refetch = useCallback(async () => {
    const res = await apiGet<CartLine[]>("/api/public/cart");
    if (res.success) {
      setItems(res.data.map(toUI));
    }
  }, []);

  useEffect(() => {
    if (status === "loading") return;
    if (isAuthed) {
      void refetch();
    } else {
      setItems([]);
    }
  }, [status, isAuthed, refetch]);

  // Optimistic update + fire API call. Tidak refetch tiap mutasi agar UI
  // tetap responsif; refetch dilakukan saat login berikutnya.
  const addItem = useCallback(
    async (item: CartItem) => {
      setItems((prev) => {
        const existing = prev.find((i) => i.productId === item.productId);
        if (existing) {
          return prev.map((i) =>
            i.productId === item.productId
              ? { ...i, quantity: i.quantity + item.quantity }
              : i,
          );
        }
        return [...prev, item];
      });
      if (isAuthed) {
        await apiPost<CartLine>("/api/public/cart", {
          productId: Number(item.productId),
          qty: item.quantity,
        });
      }
    },
    [isAuthed],
  );

  const removeItem = useCallback(
    async (productId: string) => {
      setItems((prev) => prev.filter((i) => i.productId !== productId));
      if (isAuthed) {
        await apiDelete(`/api/public/cart/${productId}`);
      }
    },
    [isAuthed],
  );

  const updateQuantity = useCallback(
    async (productId: string, quantity: number) => {
      if (quantity <= 0) {
        await removeItem(productId);
        return;
      }
      setItems((prev) =>
        prev.map((i) => (i.productId === productId ? { ...i, quantity } : i)),
      );
      if (isAuthed) {
        await apiPatch<CartLine>(`/api/public/cart/${productId}`, {
          qty: quantity,
        });
      }
    },
    [isAuthed, removeItem],
  );

  const clearCart = useCallback(async () => {
    setItems([]);
    if (isAuthed) {
      await apiDelete("/api/public/cart");
    }
  }, [isAuthed]);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
