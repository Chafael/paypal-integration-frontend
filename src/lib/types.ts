export type Category =
  | 'taladros-impacto'
  | 'hidrolavadoras'
  | 'pulidoras-acabados'
  | 'corte-construccion';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  category: Category;
  brand: string;
  stock: number;
}
