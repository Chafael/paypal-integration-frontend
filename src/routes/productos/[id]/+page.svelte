<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { animate } from 'motion';
  import { getProductById } from '$lib/api';
  import { cart } from '$lib/cart.svelte';
  import { CATEGORY_LABELS } from '$lib/types';
  import type { Product } from '$lib/types';

  let product: Product | null = $state(null);
  let loading = $state(true);
  let error = $state('');

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(price);

  const categoryEmoji: Record<string, string> = {
    'taladros-impacto': '🔩',
    'hidrolavadoras': '💧',
    'pulidoras-acabados': '✨',
    'corte-construccion': '⚡',
    'kits-multiherramientas': '🧰',
  };

  onMount(async () => {
    try {
      const id = $page.params.id;
      product = await getProductById(id);
      setTimeout(() => {
        animate('.detail-left', { opacity: [0, 1], x: [-40, 0] }, { duration: 0.6, easing: 'ease-out' });
        animate('.detail-right', { opacity: [0, 1], x: [40, 0] }, { duration: 0.6, delay: 0.1, easing: 'ease-out' });
      }, 50);
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
  <div class="flex items-center justify-center min-h-[calc(100vh-64px)]">
    <div class="animate-pulse flex flex-col items-center gap-4">
      <div class="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
      <p class="text-zinc-500">Cargando producto...</p>
    </div>
  </div>
{:else if error || !product}
  <div class="flex items-center justify-center min-h-[calc(100vh-64px)]">
    <div class="text-center">
      <p class="text-5xl mb-6">🔍</p>
      <p class="text-zinc-400 text-xl mb-4">{error || 'Producto no encontrado'}</p>
      <a href="/productos" class="text-amber-500 hover:text-amber-400 transition-colors">← Volver al catálogo</a>
    </div>
  </div>
{:else}
  <div class="flex flex-col lg:flex-row min-h-screen -mt-16 relative">
    
    <!-- PANEL IZQUIERDO (Imagen) -->
    <div class="detail-left opacity-0 w-full lg:w-[55%] h-[60vh] lg:h-screen lg:sticky lg:top-0 bg-zinc-900 lg:rounded-r-[40px] flex items-center justify-center relative overflow-hidden z-0">
      <!-- Glow -->
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent"></div>
      
      <!-- Emoji (Imagen) -->
      <span class="text-[120px] z-10 drop-shadow-2xl scale-125">{categoryEmoji[product.category] ?? '🔧'}</span>
      
      <!-- Gradiente oscuro inferior -->
      <div class="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black to-transparent opacity-80 pointer-events-none"></div>
    </div>

    <!-- PANEL DERECHO (Info) -->
    <div class="detail-right opacity-0 w-full lg:w-[45%] px-6 py-12 lg:px-16 lg:pt-32 lg:pb-16 flex flex-col justify-center">
      
      <!-- Breadcrumb -->
      <div class="flex items-center gap-2 text-xs text-zinc-500 mb-8 uppercase tracking-widest font-semibold">
        <a href="/" class="hover:text-amber-500 transition-colors">Inicio</a>
        <span>/</span>
        <a href="/productos" class="hover:text-amber-500 transition-colors">Catálogo</a>
      </div>

      <!-- Badge Marca/Categoría -->
      <div class="flex items-center gap-3 mb-6">
        <span class="bg-amber-500/10 text-amber-500 border border-amber-500/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
          {product.brand}
        </span>
        <span class="text-zinc-400 text-sm">{CATEGORY_LABELS[product.category]}</span>
      </div>

      <!-- Nombre -->
      <h1 class="text-3xl lg:text-5xl font-bold text-white leading-tight mb-6">
        {product.name}
      </h1>

      <!-- Descripción -->
      <p class="text-zinc-400 text-lg leading-relaxed mb-10">
        {product.description}
      </p>

      <!-- Specs Pills (Grid 2 col) -->
      <div class="mb-10">
        <h3 class="text-white font-medium mb-4">Especificaciones</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {#each product.specs as spec}
            <div class="bg-zinc-800/50 border border-white/5 rounded-lg px-4 py-3 text-sm text-zinc-300 flex items-center gap-2">
              <span class="text-amber-500/50">•</span> {spec}
            </div>
          {/each}
        </div>
      </div>

      <!-- Precio y Stock -->
      <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
        <div>
          <p class="text-zinc-500 text-sm mb-1">Precio unitario</p>
          <p class="text-5xl font-bold text-white tracking-tight">{formatPrice(product.price)}</p>
        </div>
        <div class="pb-1">
          <span class="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium {product.stock > 20 ? 'bg-green-500/10 text-green-400 border border-green-500/20' : product.stock > 5 ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}">
            <span class="w-2 h-2 rounded-full {product.stock > 20 ? 'bg-green-400' : product.stock > 5 ? 'bg-amber-400' : 'bg-red-400'} animate-pulse"></span>
            {product.stock > 20 ? 'Disponible' : product.stock > 5 ? `Quedan ${product.stock}` : `¡Solo ${product.stock}!`}
          </span>
        </div>
      </div>

      <!-- Acciones (Botones) -->
      <div class="flex flex-col gap-4 mb-12 mt-auto">
        <button 
          onclick={() => { if (product) cart.add(product, 1); }}
          class="w-full bg-zinc-900 border border-white/10 hover:border-white/30 hover:bg-zinc-800 text-white font-semibold py-4 rounded-xl transition-all duration-200"
        >
          Agregar al carrito
        </button>
        
        <a 
          href="/checkout?productId={product.id}&quantity=1" 
          class="w-full bg-amber-500 text-black font-bold py-4 rounded-xl text-center transition-all duration-300 hover:shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:-translate-y-0.5"
        >
          Comprar ahora
        </a>
      </div>

      <!-- SKU -->
      <div class="border-t border-white/5 pt-6">
        <p class="text-xs text-zinc-600 font-mono uppercase">SKU: {product.id}</p>
      </div>

    </div>
  </div>
{/if}
