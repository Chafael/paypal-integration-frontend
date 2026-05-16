import type { Product, Category } from './types';

const BASE = 'http://localhost:3000/api';

export const getProducts = async (): Promise<Product[]> => {
  const res = await fetch(`${BASE}/products`);
  if (!res.ok) throw new Error('Error al cargar productos');
  return res.json();
};

export const getProductById = async (id: string): Promise<Product> => {
  const res = await fetch(`${BASE}/products/${id}`);
  if (!res.ok) throw new Error('Producto no encontrado');
  return res.json();
};

export const getProductsByCategory = async (category: Category): Promise<Product[]> => {
  const res = await fetch(`${BASE}/products/category/${category}`);
  if (!res.ok) throw new Error('Error al cargar categoría');
  return res.json();
};
