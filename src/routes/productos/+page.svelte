<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { animate, stagger } from 'motion';
  import { getProducts } from '$lib/api';
  import { CATEGORY_LABELS } from '$lib/types';
  import type { Product, Category } from '$lib/types';

  let products: Product[] = $state([]);
  let filtered: Product[] = $state([]);
  let loading = $state(true);
  let error = $state('');
  let activeCategory: Category | 'all' = $state('all');

  const categories: { id: Category | 'all'; label: string }[] = [
    { id: 'all', label: 'Todo' },
    { id: 'taladros-impacto', label: 'Taladros e Impacto' },
    { id: 'hidrolavadoras', label: 'Hidrolavadoras' },
    { id: 'pulidoras-acabados', label: 'Pulidoras' },
    { id: 'corte-construccion', label: 'Corte y Construcción' },
    { id: 'kits-multiherramientas', label: 'Kits' },
  ];

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(price);

  const categoryEmoji: Record<string, string> = {
    'taladros-impacto': '🔩',
    'hidrolavadoras': '💧',
    'pulidoras-acabados': '✨',
    'corte-construccion': '⚡',
    'kits-multiherramientas': '🧰',
  };

  function filterBy(cat: Category | 'all') {
    activeCategory = cat;
    filtered = cat === 'all' ? products : products.filter((p) => p.category === cat);
    setTimeout(() => {
      animate('.product-card', { opacity: [0, 1], y: [20, 0] }, { duration: 0.3, delay: stagger(0.05) });
    }, 10);
  }

  onMount(async () => {
    try {
      const cat = $page.url.searchParams.get('categoria') as Category | null;
      products = await getProducts();
      filtered = products;
      if (cat && cat in CATEGORY_LABELS) {
        filterBy(cat as Category);
      } else {
        setTimeout(() => {
          animate('.product-card', { opacity: [0, 1], y: [20, 0] }, { duration: 0.3, delay: stagger(0.05) });
        }, 50);
      }
    } catch (e) {
      error = 'No se pudo conectar al servidor.';
    } finally {
      loading = false;
    }
  });
</script>

<svelte:head>
  <title>Catálogo — Vultus</title>
</svelte:head>

<div class="min-h-screen px-6 md:px-12 lg:px-20 py-12">

  <!-- Header -->
  <div class="mb-10">
    <h1 class="text-5xl font-bold text-white mb-2">Catálogo</h1>
    <p class="text-zinc-500 text-lg">{filtered.length} productos disponibles</p>
  </div>

  <!-- Filtros -->
  <div class="flex gap-3 flex-wrap mb-12">
    {#each categories as cat}
      <button
        onclick={() => filterBy(cat.id)}
        class="px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer {activeCategory === cat.id
          ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
          : 'bg-zinc-900 text-zinc-400 hover:text-white border border-white/5 hover:border-white/20'}"
      >
        {cat.label}
      </button>
    {/each}
  </div>

  <!-- Loading -->
  {#if loading}
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {#each Array(8) as _}
        <div class="bg-zinc-900 rounded-2xl h-80 animate-pulse border border-white/5"></div>
      {/each}
    </div>

  <!-- Error -->
  {:else if error}
    <div class="text-center py-32">
      <p class="text-5xl mb-6">⚠️</p>
      <p class="text-zinc-400 text-xl mb-2">{error}</p>
      <p class="text-zinc-600 text-sm">Asegúrate de que el backend corre en <code class="text-amber-500">localhost:3000</code></p>
    </div>

  <!-- Grid -->
  {:else}
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {#each filtered as product (product.id)}
        <a
          href="/productos/{product.id}"
          class="product-card group bg-zinc-900 hover:bg-zinc-800/80 border border-white/5 hover:border-amber-500/25 rounded-2xl overflow-hidden transition-all duration-300 opacity-0 flex flex-col hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-500/5"
        >
          <!-- Imagen placeholder -->
          <div class="h-52 bg-zinc-800 flex items-center justify-center border-b border-white/5 relative overflow-hidden">
            <div class="absolute inset-0 bg-gradient-to-br from-zinc-700/30 to-transparent"></div>
            <span class="text-6xl z-10 group-hover:scale-110 transition-transform duration-300">
              {categoryEmoji[product.category] ?? '🔧'}
            </span>
            <!-- Badge stock -->
            <div class="absolute top-3 right-3">
              <span class="text-xs px-2 py-1 rounded-full {product.stock > 20 ? 'bg-green-500/10 text-green-400 border border-green-500/20' : product.stock > 5 ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}">
                {product.stock > 20 ? 'En stock' : product.stock > 5 ? 'Pocas unidades' : 'Últimas'}
              </span>
            </div>
          </div>

          <div class="p-5 flex flex-col flex-1">
            <span class="text-xs text-amber-500 font-semibold tracking-wide uppercase mb-2">{product.brand}</span>
            <h3 class="text-white text-base font-medium leading-snug mb-4 flex-1 line-clamp-2">{product.name}</h3>

            <div class="flex items-center justify-between">
              <span class="text-white text-xl font-bold">{formatPrice(product.price)}</span>
              <span class="text-xs text-zinc-500 group-hover:text-amber-500 transition-colors flex items-center gap-1">
                Ver detalle <span class="group-hover:translate-x-1 transition-transform inline-block">→</span>
              </span>
            </div>
          </div>
        </a>
      {/each}
    </div>
  {/if}
</div>
