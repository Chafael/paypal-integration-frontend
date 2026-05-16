<script lang="ts">
  import { onMount } from 'svelte';
  import { getProducts } from '$lib/api';
  import type { Product, Category } from '$lib/types';

  let products: Product[] = $state([]);
  let filtered: Product[] = $state([]);
  let loading = $state(true);
  let activeCategory: Category | 'all' = $state('all');

  const categories = [
    { id: 'all', label: 'Todo' },
    { id: 'taladros-impacto', label: 'Taladros e Impacto' },
    { id: 'hidrolavadoras', label: 'Hidrolavadoras' },
    { id: 'pulidoras-acabados', label: 'Pulidoras' },
    { id: 'corte-construccion', label: 'Corte y Construcción' },
    { id: 'kits-multiherramientas', label: 'Kits' },
  ];

  function filterBy(cat: Category | 'all') {
    activeCategory = cat;
    filtered = cat === 'all' ? products : products.filter((p) => p.category === cat);
  }

  onMount(async () => {
    try {
      products = await getProducts();
      filtered = products;
    } catch (e) {
      console.error(e);
    } finally {
      loading = false;
    }
  });
</script>

<svelte:head>
  <title>Catálogo — Vultus</title>
</svelte:head>

<div class="max-w-[1400px] mx-auto px-6 py-16">
  <h1 class="text-4xl font-bold text-white mb-8">Catálogo</h1>

  <div class="flex gap-3 mb-10 flex-wrap">
    {#each categories as cat}
      <button onclick={() => filterBy(cat.id as Category | 'all')}
        class="px-4 py-2 rounded-full text-sm {activeCategory === cat.id ? 'bg-amber-500 text-black font-bold' : 'bg-zinc-900 text-zinc-400 border border-white/10 hover:text-white'}">
        {cat.label}
      </button>
    {/each}
  </div>

  {#if loading}
    <p class="text-zinc-500">Cargando...</p>
  {:else}
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {#each filtered as product}
        <a href="/productos/{product.id}" class="bg-zinc-900 rounded-2xl overflow-hidden flex flex-col">
          <div class="h-[200px] bg-zinc-800 flex items-center justify-center">
            <span class="text-6xl">??</span>
          </div>
          <div class="p-4">
            <h3 class="text-white font-semibold mb-1">{product.name}</h3>
            <p class="text-amber-500 font-bold">{product.price} {product.currency}</p>
          </div>
        </a>
      {/each}
    </div>
  {/if}
</div>
