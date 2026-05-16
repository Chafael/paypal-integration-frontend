import type { Product } from './types';

export interface CartItem {
  product: Product;
  quantity: number;
}

export function createCart() {
  let items = $state<CartItem[]>([]);

  const totalItems = $derived(items.reduce((acc, item) => acc + item.quantity, 0));
  const totalPrice = $derived(items.reduce((acc, item) => acc + item.product.price * item.quantity, 0));

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

  function updateQuantity(productId: string, quantity: number) {
    const item = items.find(i => i.product.id === productId);
    if (item) {
      item.quantity = quantity;
    }
  }

  function clear() {
    items = [];
  }

  return {
    get items() { return items; },
    get totalItems() { return totalItems; },
    get totalPrice() { return totalPrice; },
    add,
    remove,
    updateQuantity,
    clear
  };
}

export const cart = createCart();
