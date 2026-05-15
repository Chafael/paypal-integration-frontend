export type Category =
  | 'taladros-impacto'
  | 'hidrolavadoras'
  | 'pulidoras-acabados'
  | 'corte-construccion'
  | 'kits-multiherramientas';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  category: Category;
  brand: string;
  stock: number;
  specs: string[];
}

export const CATEGORY_LABELS: Record<Category, string> = {
  'taladros-impacto': 'Taladros e Impacto',
  'hidrolavadoras': 'Hidrolavadoras',
  'pulidoras-acabados': 'Pulidoras y Acabados',
  'corte-construccion': 'Corte y Construcción',
  'kits-multiherramientas': 'Kits y Multiherramientas',
};
