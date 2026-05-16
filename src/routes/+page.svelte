<script lang="ts">
  import { onMount } from 'svelte';
  import { animate } from 'motion';
  import { getProducts } from '$lib/api';
  import type { Product } from '$lib/types';

  let products: Product[] = $state([]);
  let hero: HTMLElement;

  const categories = [
    { id: 'taladros-impacto', name: 'Taladros', emoji: '🔩', desc: 'Inalámbricos y con cable', from: 'from-orange-900/40', price: 'desde $899' },
    { id: 'hidrolavadoras', name: 'Hidrolavadoras', emoji: '💧', desc: 'Para el hogar y auto', from: 'from-blue-900/40', price: 'desde $1,499' },
    { id: 'pulidoras-acabados', name: 'Pulidoras', emoji: '✨', desc: 'Acabados perfectos', from: 'from-yellow-900/40', price: 'desde $699' },
    { id: 'corte-construccion', name: 'Corte', emoji: '⚡', desc: 'Sierras y discos', from: 'from-red-900/40', price: 'desde $1,299' },
    { id: 'kits-multiherramientas', name: 'Kits', emoji: '🧰', desc: 'Todo en uno', from: 'from-green-900/40', price: 'desde $2,499' },
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

  onMount(async () => {
    animate(hero, { opacity: [0, 1], y: [30, 0] }, { duration: 0.8, easing: 'ease-out' });
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animate(entry.target, { opacity: [0, 1], y: [30, 0] }, { duration: 0.6, easing: 'ease-out' });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.scroll-animate').forEach((el) => observer.observe(el));

    try {
      const allProducts = await getProducts();
      // Tomamos 8 productos para tener un grid perfecto de 4 columnas en desktop
      products = allProducts.slice(0, 8);
    } catch (e) {
      console.error('Error fetching products:', e);
    }
  });
</script>

<svelte:head>
  <title>Vultus — La ferretería del futuro</title>
</svelte:head>

<!-- SECCIÓN 1: HERO -->
<section class="min-h-[90vh] flex items-center justify-center pt-16 pb-12 overflow-hidden relative border-b border-white/5">
  <div class="max-w-[1400px] mx-auto px-6 lg:px-12 w-full flex flex-col md:flex-row items-center justify-between gap-8">
    
    <!-- Columna Izquierda Decorativa -->
    <div class="hidden md:flex w-[20%] justify-center">
      <div 
        class="w-[280px] h-[320px] bg-zinc-800 border border-zinc-700 animate-float mix-blend-screen"
        style="border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; transform: rotate(-15deg); animation-delay: 0s;"
      ></div>
    </div>

    <!-- Columna Central -->
    <div bind:this={hero} class="w-full md:w-[60%] text-center opacity-0 flex flex-col items-center z-10">
      <div class="inline-flex items-center gap-2 mb-6">
        <p class="text-zinc-400 text-sm uppercase tracking-widest font-medium">Created by <span class="text-amber-500 font-bold">Vultus Tools</span></p>
      </div>
      
      <h1 class="text-6xl sm:text-7xl lg:text-[110px] font-black text-white tracking-tighter leading-[0.95] mb-8">
        La ferretería<br>del futuro.
      </h1>
      
      <p class="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto mb-14 leading-relaxed">
        Catálogo profesional de herramientas eléctricas para el hogar y la obra. Calidad comprobada, precios directos.
      </p>

      <!-- Reemplazo del buscador: Tarjetas de features interactivas -->
      <div class="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-3xl mb-8">
        <div class="flex-1 w-full flex items-center justify-center sm:justify-start gap-4 px-6 py-4 bg-zinc-900 border border-white/5 rounded-2xl hover:border-amber-500/50 hover:bg-amber-500/5 transition-all duration-300 shadow-lg hover:-translate-y-1 group cursor-default">
          <span class="text-3xl group-hover:scale-125 transition-transform duration-300">⚡</span>
          <div class="text-left">
            <h4 class="text-white font-bold text-sm">Envío rápido</h4>
            <p class="text-zinc-500 text-xs">A todo el país</p>
          </div>
        </div>
        <div class="flex-1 w-full flex items-center justify-center sm:justify-start gap-4 px-6 py-4 bg-zinc-900 border border-white/5 rounded-2xl hover:border-blue-500/50 hover:bg-blue-500/5 transition-all duration-300 shadow-lg hover:-translate-y-1 group cursor-default">
          <span class="text-3xl group-hover:scale-125 transition-transform duration-300">🔒</span>
          <div class="text-left">
            <h4 class="text-white font-bold text-sm">Pago seguro</h4>
            <p class="text-zinc-500 text-xs">100% protegido</p>
          </div>
        </div>
        <div class="flex-1 w-full flex items-center justify-center sm:justify-start gap-4 px-6 py-4 bg-zinc-900 border border-white/5 rounded-2xl hover:border-green-500/50 hover:bg-green-500/5 transition-all duration-300 shadow-lg hover:-translate-y-1 group cursor-default">
          <span class="text-3xl group-hover:scale-125 transition-transform duration-300">🛠️</span>
          <div class="text-left">
            <h4 class="text-white font-bold text-sm">Garantía</h4>
            <p class="text-zinc-500 text-xs">Soporte directo</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Columna Derecha Decorativa -->
    <div class="hidden md:flex w-[20%] justify-center">
      <div 
        class="w-[280px] h-[320px] bg-zinc-800 border border-zinc-700 animate-float mix-blend-screen scale-x-[-1]"
        style="border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; transform: rotate(10deg); animation-delay: -3s;"
      ></div>
    </div>
  </div>
</section>

<!-- SECCIÓN 2: CATEGORÍAS -->
<section class="max-w-[1400px] mx-auto px-6 lg:px-12 py-32 border-b border-white/5">
  <div class="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
    <h2 class="text-4xl md:text-5xl font-bold text-white tracking-tight">Categorías</h2>
    <a href="/productos" class="text-zinc-400 hover:text-white transition-colors flex items-center gap-1 group pb-1">
      Explorar todo <span class="group-hover:translate-x-1 transition-transform inline-block">→</span>
    </a>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {#each categories as cat, i}
      <a 
        href="/productos?categoria={cat.id}"
        class="scroll-animate opacity-0 block group relative border border-white/5 rounded-2xl overflow-hidden h-[340px] bg-gradient-to-b {cat.from} to-zinc-900 transition-all duration-300 hover:scale-[1.02] hover:border-white/20 hover:shadow-2xl hover:shadow-white/5 {i === 0 ? 'md:col-span-2 lg:col-span-2' : ''}"
      >
        <div class="absolute inset-0 flex items-center justify-center pb-12 group-hover:scale-110 transition-transform duration-500">
          <span class="text-[100px] drop-shadow-2xl">{cat.emoji}</span>
        </div>
        <div class="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-zinc-900 via-zinc-900/80 to-transparent pt-20">
          <h3 class="text-3xl font-bold text-white mb-2">{cat.name}</h3>
          <div class="flex justify-between items-end">
            <p class="text-zinc-400 text-sm">{cat.desc}</p>
            <p class="text-zinc-500 text-sm font-semibold uppercase tracking-wider">{cat.price}</p>
          </div>
        </div>
      </a>
    {/each}
  </div>
</section>

<!-- SECCIÓN 3: MÁS VENDIDOS -->
<section class="max-w-[1400px] mx-auto px-6 lg:px-12 py-32 border-b border-white/5">
  <div class="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
    <h2 class="text-4xl md:text-5xl font-bold text-white tracking-tight">Más vendidos</h2>
    <a href="/productos" class="text-zinc-400 hover:text-white transition-colors flex items-center gap-1 group pb-1">
      Ver todo <span class="group-hover:translate-x-1 transition-transform inline-block">→</span>
    </a>
  </div>

  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    {#each products as product}
      <a 
        href="/productos/{product.id}"
        class="scroll-animate opacity-0 group bg-zinc-900 rounded-2xl overflow-hidden transition-all duration-300 border border-transparent hover:border-amber-500/20 hover:-translate-y-2 hover:shadow-2xl hover:shadow-amber-500/5 flex flex-col"
      >
        <div class="h-[220px] bg-zinc-800 flex items-center justify-center relative">
          <span class="text-7xl group-hover:scale-110 transition-transform duration-300 drop-shadow-2xl z-10">{categoryEmoji[product.category] ?? '🔧'}</span>
          <div class="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-zinc-900 to-transparent pointer-events-none"></div>
        </div>
        <div class="p-6 flex-1 flex flex-col">
          <h3 class="text-white font-semibold text-base leading-snug mb-2 flex-1">{product.name}</h3>
          <p class="text-zinc-500 text-xs uppercase tracking-wider font-semibold mb-4">{product.brand}</p>
          <div class="flex items-center justify-between">
            <span class="text-white font-bold text-xl">{formatPrice(product.price)}</span>
            <span class="text-zinc-600 group-hover:text-amber-500 transition-colors text-sm font-medium">Ver detalles</span>
          </div>
        </div>
      </a>
    {/each}
    {#if products.length === 0}
      {#each Array(8) as _}
        <div class="bg-zinc-900 rounded-2xl h-[360px] animate-pulse"></div>
      {/each}
    {/if}
  </div>
</section>

<!-- SECCIÓN 4: CTA BANNER -->
<section class="py-32 relative overflow-hidden">
  <div class="absolute top-1/2 -left-20 -translate-y-1/2 w-[400px] h-[400px] bg-zinc-900/50 border border-white/5 animate-float blur-xl rounded-full mix-blend-screen pointer-events-none"></div>
  <div class="absolute top-1/2 -right-20 -translate-y-1/2 w-[400px] h-[400px] bg-zinc-900/50 border border-white/5 animate-float blur-xl rounded-full mix-blend-screen pointer-events-none" style="animation-delay: -3s;"></div>

  <div class="max-w-4xl mx-auto px-6 text-center relative z-10">
    <h2 class="text-5xl md:text-6xl font-black text-white tracking-tighter mb-6 leading-tight">
      ¿Listo para equiparte?
    </h2>
    <p class="text-zinc-400 text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
      Encuentra la herramienta perfecta para tu próximo proyecto. Precios justos, envíos a todo el país y soporte garantizado.
    </p>
    <a 
      href="/productos"
      class="inline-block border border-white/20 hover:border-white/50 text-white font-semibold px-8 py-4 rounded-full transition-all duration-300 hover:bg-white/5"
    >
      Ver catálogo completo →
    </a>
  </div>
</section>
