<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { getProductById } from '$lib/api';
  import { cart } from '$lib/cart.svelte';
  import { CATEGORY_LABELS } from '$lib/types';
  import type { Product } from '$lib/types';

  let product: Product | null = $state(null);
  let loading = $state(true);
  let error = $state('');

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(price);

  onMount(async () => {
    try {
      const id = $page.params.id;
      product = await getProductById(id);
    } catch (e) {
      error = 'Producto no encontrado.';
    } finally {
      loading = false;
    }
  });
</script>

<svelte:head>
  <title>{product?.name ?? 'Producto'} — Vultus</title>
</svelte:head>

{#if loading}
  <div class="flex items-center justify-center min-h-screen">
    <p class="text-zinc-400">Cargando...</p>
  </div>
{:else if error || !product}
  <div class="flex items-center justify-center min-h-screen">
    <div class="text-center">
      <p class="text-zinc-400 text-xl mb-4">{error || 'Producto no encontrado'}</p>
      <a href="/productos" class="text-amber-500">← Volver al catálogo</a>
    </div>
  </div>
{:else}
  <div class="max-w-[1400px] mx-auto px-6 py-16">
    <h1 class="text-4xl font-bold text-white mb-4">{product.name}</h1>
    <p class="text-zinc-400 mb-6">{product.description}</p>
    <p class="text-3xl text-white font-bold mb-8">{formatPrice(product.price)}</p>
    <button onclick={() => { if (product) cart.add(product, 1); }}
      class="bg-amber-500 text-black font-bold px-8 py-4 rounded-xl">
      Agregar al carrito
    </button>
  </div>
{/if}