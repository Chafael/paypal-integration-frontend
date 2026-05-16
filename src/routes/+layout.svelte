<script lang="ts">
  import '../app.css';
  import { page } from '$app/stores';
  import { cart } from '$lib/cart.svelte';

  const links = [
    { href: '/', label: 'Inicio' },
    { href: '/productos', label: 'Catálogo' },
  ];

  let { children } = $props();
</script>

<nav class="fixed top-0 left-0 right-0 z-50 bg-black/80 py-4">
  <div class="max-w-[1600px] mx-auto px-6 flex items-center justify-between">
    <a href="/" class="text-white font-black text-2xl">Vultus</a>
    <div class="flex gap-6">
      {#each links as link}
        <a href={link.href} class="text-zinc-400 hover:text-white transition-colors {$page.url.pathname === link.href ? 'text-white' : ''}">
          {link.label}
        </a>
      {/each}
    </div>
    <a href="/checkout" class="relative text-white">
      ??
      {#if cart.totalItems > 0}
        <span class="absolute -top-1 -right-1 bg-amber-500 text-black text-xs w-4 h-4 rounded-full flex items-center justify-center">
          {cart.totalItems}
        </span>
      {/if}
    </a>
  </div>
</nav>

<main class="min-h-screen bg-black text-white pt-16">
  {@render children()}
</main>

<footer class="border-t border-white/5 bg-black px-6 py-8">
  <p class="text-zinc-600 text-xs text-center">© 2026 Vultus. Todos los derechos reservados.</p>
</footer>
