<script lang="ts">
  import '../app.css';
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import { animate } from 'motion';
  import { cart } from '$lib/cart.svelte';

  let nav: HTMLElement;
  let scrolled = $state(false);

  onMount(() => {
    animate(nav, { opacity: [0, 1], y: [-20, 0] }, { duration: 0.5, easing: 'ease-out' });
    window.addEventListener('scroll', () => {
      scrolled = window.scrollY > 20;
    });
  });

  const links = [
    { href: '/', label: 'Inicio' },
    { href: '/productos', label: 'Catálogo' },
  ];

  let { children } = $props();
</script>

<nav
  bind:this={nav}
  class="fixed top-0 left-0 right-0 z-50 transition-all duration-500 {scrolled
    ? 'bg-black/80 backdrop-blur-2xl border-b border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.6)] py-3'
    : 'bg-gradient-to-b from-black/80 to-transparent py-5'}"
>
  <div class="max-w-[1600px] mx-auto px-6 flex items-center justify-between gap-6">
    
    <!-- Logo -->
    <a href="/" class="flex items-center gap-3 group shrink-0">
      <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:shadow-amber-500/40 group-hover:scale-105 transition-all duration-300">
        <span class="text-black font-black text-2xl leading-none">⬡</span>
      </div>
      <span class="text-white font-black text-2xl tracking-tighter">Vultus</span>
    </a>

    <!-- Navegación central (Pill style) -->
    <div class="hidden md:flex items-center bg-zinc-900/60 border border-white/10 rounded-full p-1.5 backdrop-blur-md shadow-inner">
      {#each links as link}
        <a 
          href={link.href} 
          class="px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 {$page.url.pathname === link.href ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20 scale-105' : 'text-zinc-400 hover:text-white hover:bg-white/10'}"
        >
          {link.label}
        </a>
      {/each}
    </div>

    <!-- Buscador y Carrito (Derecha) -->
    <div class="flex items-center gap-4 flex-1 justify-end">
      <!-- Carrito -->
      <a href="/checkout" class="relative bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-white w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:border-amber-500/50 hover:shadow-[0_0_20px_rgba(245,158,11,0.2)] hover:-translate-y-1 shrink-0">
        <span class="text-xl">🛒</span>
        {#if cart.totalItems > 0}
          <span class="absolute -top-1 -right-1 bg-amber-500 text-black text-[11px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-black">
            {cart.totalItems}
          </span>
        {/if}
      </a>
    </div>
  </div>
</nav>

<main class="min-h-screen bg-black text-white pt-16">
  {@render children()}
</main>

<footer class="border-t border-white/5 bg-black px-6 py-12">
  <div class="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-8">
    <div>
      <div class="flex items-center gap-2 mb-3">
        <span class="text-amber-500 font-bold text-xl">⬡</span>
        <span class="text-white font-semibold text-lg">Vultus</span>
      </div>
      <p class="text-zinc-500 text-sm max-w-xs">
        Herramientas eléctricas para el hogar y la obra. Calidad real, precios directos.
      </p>
    </div>

    <div class="flex gap-16">
      <div>
        <p class="text-white text-sm font-medium mb-4">Categorías</p>
        <ul class="space-y-2">
          {#each ['Taladros', 'Hidrolavadoras', 'Pulidoras', 'Corte', 'Kits'] as cat}
            <li>
              <a href="/productos?categoria={cat.toLowerCase().replace(/ /g, '-')}" class="text-zinc-500 hover:text-white text-sm transition-colors">
                {cat}
              </a>
            </li>
          {/each}
        </ul>
      </div>
      <div>
        <p class="text-white text-sm font-medium mb-4">Empresa</p>
        <ul class="space-y-2">
          <li><a href="/productos" class="text-zinc-500 hover:text-white text-sm transition-colors">Catálogo</a></li>
          <li><span class="text-zinc-600 text-sm">Nosotros</span></li>
          <li><span class="text-zinc-600 text-sm">Garantía</span></li>
        </ul>
      </div>
    </div>
  </div>

  <div class="max-w-7xl mx-auto mt-12 pt-6 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-2">
    <p class="text-zinc-600 text-xs">© 2026 Vultus Tools. Todos los derechos reservados.</p>
    <p class="text-zinc-600 text-xs">Hecho con ❤️ en México 🇲🇽</p>
  </div>
</footer>