<script lang="ts">
  import { onMount } from 'svelte';
  import { animate } from 'motion';
  import { getProducts } from '$lib/api';
  import type { Product } from '$lib/types';

  let products: Product[] = $state([]);
  let hero: HTMLElement;

  const categories = [
    { id: 'taladros-impacto', name: 'Taladros', emoji: '??', desc: 'Inalámbricos y con cable', from: 'from-orange-900/40', price: 'desde $899' },
    { id: 'hidrolavadoras', name: 'Hidrolavadoras', emoji: '??', desc: 'Para el hogar y auto', from: 'from-blue-900/40', price: 'desde $1,499' },
    { id: 'pulidoras-acabados', name: 'Pulidoras', emoji: '?', desc: 'Acabados perfectos', from: 'from-yellow-900/40', price: 'desde $699' },
    { id: 'corte-construccion', name: 'Corte', emoji: '?', desc: 'Sierras y discos', from: 'from-red-900/40', price: 'desde $1,299' },
    { id: 'kits-multiherramientas', name: 'Kits', emoji: '??', desc: 'Todo en uno', from: 'from-green-900/40', price: 'desde $2,499' },
  ];

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(price);

  onMount(async () => {
    animate(hero, { opacity: [0, 1], y: [30, 0] }, { duration: 0.8, easing: 'ease-out' });
    try {
      products = await getProducts();
    } catch (e) {
      console.error('Error fetching products:', e);
    }
  });
</script>

<svelte:head>
  <title>Vultus — La ferretería del futuro</title>
</svelte:head>

<!-- SECCIÓN 1: HERO -->
<section class="min-h-[90vh] flex items-center justify-center pt-16 pb-12">
  <div bind:this={hero} class="text-center opacity-0">
    <h1 class="text-6xl font-black text-white tracking-tighter mb-8">
      La ferretería<br>del futuro.
    </h1>
    <p class="text-zinc-400 text-lg max-w-2xl mx-auto mb-14">
      Catálogo profesional de herramientas eléctricas.
    </p>
    <a href="/productos" class="bg-amber-500 text-black font-bold px-8 py-4 rounded-full">
      Ver catálogo
    </a>
  </div>
</section>

<!-- SECCIÓN 2: CATEGORÍAS -->
<section class="max-w-[1400px] mx-auto px-6 py-32">
  <h2 class="text-4xl font-bold text-white mb-12">Categorías</h2>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {#each categories as cat}
      <a href="/productos?categoria={cat.id}" class="block border border-white/5 rounded-2xl overflow-hidden h-[300px] bg-zinc-900">
        <div class="flex items-center justify-center h-full">
          <span class="text-[80px]">{cat.emoji}</span>
        </div>
        <div class="p-6">
          <h3 class="text-xl font-bold text-white">{cat.name}</h3>
          <p class="text-zinc-400 text-sm">{cat.desc}</p>
        </div>
      </a>
    {/each}
  </div>
</section>
