<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { getProductById } from '$lib/api';
  import { cart } from '$lib/cart.svelte';
  import type { Product } from '$lib/types';

  interface OrderItem {
    product: Product;
    quantity: number;
  }

  let orderItems: OrderItem[] = $state([]);
  let loading = $state(true);
  let paying = $state(false);
  let error = $state('');

  let nombre = $state('');
  let email = $state('');
  let telefono = $state('');

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(price);

  const categoryEmoji: Record<string, string> = {
    'taladros-impacto': '🔩',
    'hidrolavadoras': '💧',
    'pulidoras-acabados': '✨',
    'corte-construccion': '⚡',
    'kits-multiherramientas': '🧰',
  };

  const subtotal = $derived(orderItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0));

  onMount(async () => {
    const productId = $page.url.searchParams.get('productId');
    const quantity = parseInt($page.url.searchParams.get('quantity') ?? '1', 10);

    if (productId) {
      try {
        const product = await getProductById(productId);
        orderItems = [{ product, quantity }];
      } catch {
        error = 'No se pudo cargar el producto.';
      }
    } else if (cart.items.length > 0) {
      orderItems = [...cart.items];
    } else {
      error = 'Tu carrito está vacío.';
    }

    loading = false;
  });

  async function handlePayPal() {
    if (!nombre || !email) {
      error = 'Por favor completa nombre y correo antes de continuar.';
      return;
    }
    error = '';
    paying = true;
    try {
      const body = {
        items: orderItems.map(item => ({
          productId: item.product.id,
          quantity: item.quantity
        }))
      };
      const res = await fetch('http://localhost:3000/api/paypal/orders/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      if (!res.ok) throw new Error('Error al crear la orden');
      const data = await res.json();
      const approveLink = data.links?.find((l: { rel: string; href: string }) => l.rel === 'approve');
      if (approveLink) {
        window.location.href = approveLink.href;
      } else {
        throw new Error('No se recibió el link de aprobación de PayPal.');
      }
    } catch (e: unknown) {
      error = e instanceof Error ? e.message : 'Error inesperado al procesar el pago.';
      paying = false;
    }
  }
</script>

<svelte:head>
  <title>Checkout — Vultus</title>
</svelte:head>

<div class="min-h-screen bg-black text-white">
  <!-- Header de checkout -->
  <div class="border-b border-white/5 px-6 lg:px-16 py-6 max-w-[1400px] mx-auto">
    <a href="/productos" class="text-zinc-500 hover:text-white text-sm transition-colors flex items-center gap-2 group w-fit">
      <span class="group-hover:-translate-x-1 transition-transform inline-block">←</span>
      Seguir comprando
    </a>
  </div>

  {#if loading}
    <div class="flex items-center justify-center min-h-[60vh]">
      <div class="flex flex-col items-center gap-4">
        <div class="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
        <p class="text-zinc-400">Preparando tu pedido...</p>
      </div>
    </div>

  {:else if error && orderItems.length === 0}
    <div class="flex items-center justify-center min-h-[60vh]">
      <div class="text-center">
        <p class="text-6xl mb-6">🛒</p>
        <h2 class="text-2xl font-bold text-white mb-3">{error}</h2>
        <a href="/productos" class="text-amber-500 hover:text-amber-400 transition-colors">← Explorar productos</a>
      </div>
    </div>

  {:else}
    <div class="max-w-[1400px] mx-auto px-6 lg:px-16 py-12">
      <h1 class="text-4xl lg:text-5xl font-black tracking-tight mb-12">Resumen del pedido</h1>

      <div class="flex flex-col lg:flex-row gap-10 items-start">

        <!-- COLUMNA IZQUIERDA: Resumen -->
        <div class="w-full lg:w-[60%] flex flex-col gap-6">

          <!-- Lista de productos -->
          <div class="bg-zinc-900 rounded-2xl border border-white/5 overflow-hidden">
            {#each orderItems as item, i}
              <div class="flex items-center gap-5 p-6 {i < orderItems.length - 1 ? 'border-b border-white/5' : ''}">
                <!-- Imagen -->
                <div class="w-20 h-20 bg-zinc-800 rounded-xl flex items-center justify-center shrink-0">
                  <span class="text-4xl">{categoryEmoji[item.product.category] ?? '🔧'}</span>
                </div>
                <!-- Info -->
                <div class="flex-1 min-w-0">
                  <h3 class="text-white font-semibold text-base leading-snug truncate">{item.product.name}</h3>
                  <p class="text-zinc-500 text-sm mt-1">{item.product.brand}</p>
                  <p class="text-zinc-400 text-sm mt-1">Cantidad: <span class="text-white font-bold">{item.quantity}</span></p>
                </div>
                <!-- Precio -->
                <div class="text-right shrink-0">
                  <p class="text-white font-bold text-lg">{formatPrice(item.product.price * item.quantity)}</p>
                  {#if item.quantity > 1}
                    <p class="text-zinc-500 text-xs">{formatPrice(item.product.price)} c/u</p>
                  {/if}
                </div>
              </div>
            {/each}
          </div>

          <!-- Desglose de costos -->
          <div class="bg-zinc-900 rounded-2xl border border-white/5 p-6 space-y-4">
            <div class="flex justify-between items-center text-zinc-400">
              <span>Subtotal ({orderItems.reduce((a, i) => a + i.quantity, 0)} artículo{orderItems.reduce((a, i) => a + i.quantity, 0) !== 1 ? 's' : ''})</span>
              <span class="text-white">{formatPrice(subtotal)}</span>
            </div>
            <div class="flex justify-between items-center text-zinc-400">
              <span>Envío</span>
              <span class="text-green-400 font-semibold">Gratis</span>
            </div>
            <div class="border-t border-white/10 pt-4 flex justify-between items-center">
              <span class="text-white font-bold text-xl">Total a pagar</span>
              <span class="text-white font-black text-2xl">{formatPrice(subtotal)}</span>
            </div>
          </div>

          <!-- Garantías -->
          <div class="grid grid-cols-3 gap-4">
            <div class="bg-zinc-900/50 border border-white/5 rounded-xl p-4 text-center">
              <p class="text-2xl mb-2">⚡</p>
              <p class="text-zinc-400 text-xs font-semibold">Envío rápido</p>
            </div>
            <div class="bg-zinc-900/50 border border-white/5 rounded-xl p-4 text-center">
              <p class="text-2xl mb-2">🔒</p>
              <p class="text-zinc-400 text-xs font-semibold">Pago 100% seguro</p>
            </div>
            <div class="bg-zinc-900/50 border border-white/5 rounded-xl p-4 text-center">
              <p class="text-2xl mb-2">🛠️</p>
              <p class="text-zinc-400 text-xs font-semibold">Garantía oficial</p>
            </div>
          </div>
        </div>

        <!-- COLUMNA DERECHA: Formulario + PayPal (sticky) -->
        <div class="w-full lg:w-[40%] lg:sticky lg:top-24">
          <div class="bg-zinc-900 rounded-2xl border border-white/5 p-8">
            <h2 class="text-xl font-bold text-white mb-6">Datos de contacto</h2>

            <div class="space-y-4 mb-8">
              <div>
                <label for="nombre" class="block text-sm text-zinc-400 mb-2 font-medium">Nombre completo *</label>
                <input
                  id="nombre"
                  type="text"
                  bind:value={nombre}
                  placeholder="Ej. Juan García"
                  class="w-full bg-zinc-800 border border-white/10 focus:border-amber-500/50 text-white rounded-xl px-4 py-3 outline-none transition-all duration-300 placeholder-zinc-600 text-sm focus:shadow-[0_0_20px_rgba(245,158,11,0.1)]"
                >
              </div>
              <div>
                <label for="email" class="block text-sm text-zinc-400 mb-2 font-medium">Correo electrónico *</label>
                <input
                  id="email"
                  type="email"
                  bind:value={email}
                  placeholder="correo@ejemplo.com"
                  class="w-full bg-zinc-800 border border-white/10 focus:border-amber-500/50 text-white rounded-xl px-4 py-3 outline-none transition-all duration-300 placeholder-zinc-600 text-sm focus:shadow-[0_0_20px_rgba(245,158,11,0.1)]"
                >
              </div>
              <div>
                <label for="telefono" class="block text-sm text-zinc-400 mb-2 font-medium">Teléfono <span class="text-zinc-600">(opcional)</span></label>
                <input
                  id="telefono"
                  type="tel"
                  bind:value={telefono}
                  placeholder="+52 33 1234 5678"
                  class="w-full bg-zinc-800 border border-white/10 focus:border-amber-500/50 text-white rounded-xl px-4 py-3 outline-none transition-all duration-300 placeholder-zinc-600 text-sm focus:shadow-[0_0_20px_rgba(245,158,11,0.1)]"
                >
              </div>
            </div>

            <!-- Resumen compacto -->
            <div class="bg-zinc-800/60 rounded-xl p-4 mb-6 flex justify-between items-center">
              <span class="text-zinc-400 text-sm">Total</span>
              <span class="text-white font-black text-xl">{formatPrice(subtotal)}</span>
            </div>

            {#if error}
              <div class="bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl px-4 py-3 text-sm mb-4">
                {error}
              </div>
            {/if}

            <!-- Botón PayPal -->
            <button
              onclick={handlePayPal}
              disabled={paying}
              class="w-full flex items-center justify-center gap-3 py-4 rounded-xl font-bold text-white text-lg transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed hover:brightness-110 hover:shadow-[0_0_30px_rgba(0,112,186,0.4)] hover:-translate-y-0.5"
              style="background-color: #0070BA;"
            >
              {#if paying}
                <div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Conectando con PayPal...
              {:else}
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.254-.93 4.778-4.005 7.201-9.138 7.201h-2.19a.563.563 0 0 0-.556.479l-1.187 7.527h-.506l-.24 1.516a.56.56 0 0 0 .554.647h3.882c.46 0 .85-.334.922-.788.06-.26.76-4.852.816-5.09a.932.932 0 0 1 .923-.788h.58c3.76 0 6.705-1.528 7.565-5.946.36-1.847.174-3.388-.777-4.471z"/>
                </svg>
                Pagar con PayPal
              {/if}
            </button>

            <p class="text-zinc-600 text-xs text-center mt-4">
              Al continuar aceptas nuestros términos y condiciones. Tu pago es procesado de forma segura por PayPal.
            </p>
          </div>
        </div>

      </div>
    </div>
  {/if}
</div>
