import type { Product } from './types';

export interface CartItem {
  product: Product;
  quantity: number;
}

export function createCart() {
  let items = <CartItem[]>([]);

  function add(product: Product, quantity: number = 1) {
    const existing = items.find(i => i.product.id === product.id);
    if (existing) {
      existing.quantity += quantity;
    } else {
      items.push({ product, quantity });
    }
  }

  function remove(productId: string) {
    items = items.filter(i => i.product.id !== productId);
  }

  function clear() {
    items = [];
  }

  return {
    get items() { return items; },
    add,
    remove,
    clear
  };
}

export const cart = createCart();
