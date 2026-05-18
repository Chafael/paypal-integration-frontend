<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';

  let token = $state('');
  let loading = $state(true);
  let success = $state(false);
  let errorMsg = $state('');

  onMount(async () => {
    token = $page.url.searchParams.get('token') ?? '';
    const payerId = $page.url.searchParams.get('PayerID') ?? '';

    if (!token || !payerId) {
      errorMsg = 'No se recibieron los datos de confirmación de PayPal.';
      loading = false;
      return;
    }

    try {
      const res = await fetch(`http://localhost:3000/api/paypal/orders/${token}/capture`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!res.ok) throw new Error('Error al capturar el pago');

      success = true;
    } catch (e: unknown) {
      errorMsg = e instanceof Error ? e.message : 'Error al confirmar el pago.';
    } finally {
      loading = false;
    }
  });
</script>

<svelte:head>
  <title>{success ? 'Pago confirmado' : 'Procesando pago'} — Vultus</title>
</svelte:head>

<div class="min-h-screen bg-black flex items-center justify-center px-6">
  {#if loading}
    <div class="text-center">
      <div class="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
      <h2 class="text-2xl font-bold text-white mb-2">Confirmando tu pago...</h2>
      <p class="text-zinc-500">Por favor no cierres esta ventana.</p>
    </div>

  {:else if success}
    <div class="text-center max-w-lg">
      <!-- Ícono de éxito animado -->
      <div class="w-24 h-24 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center mx-auto mb-8 animate-pulse">
        <span class="text-5xl">✅</span>
      </div>

      <h1 class="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">¡Pago exitoso!</h1>
      <p class="text-zinc-400 text-lg mb-2 leading-relaxed">Tu pedido ha sido confirmado y está en camino.</p>
      <p class="text-zinc-600 text-sm mb-10 font-mono">Orden: {token}</p>

      <div class="bg-zinc-900 border border-white/5 rounded-2xl p-6 mb-10 text-left space-y-4">
        <div class="flex items-center gap-3">
          <span class="text-2xl">⚡</span>
          <div>
            <p class="text-white font-semibold text-sm">Envío en camino</p>
            <p class="text-zinc-500 text-xs">Recibirás un correo con el seguimiento de tu pedido.</p>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <span class="text-2xl">🛠️</span>
          <div>
            <p class="text-white font-semibold text-sm">Garantía activa</p>
            <p class="text-zinc-500 text-xs">Todos nuestros productos tienen garantía oficial.</p>
          </div>
        </div>
      </div>

      <a
        href="/"
        class="inline-block bg-amber-500 hover:bg-amber-400 text-black font-black text-lg px-10 py-4 rounded-full transition-all duration-300 hover:shadow-[0_0_30px_rgba(245,158,11,0.4)] hover:-translate-y-1"
      >
        Volver al inicio →
      </a>
    </div>

  {:else}
    <div class="text-center max-w-lg">
      <div class="w-24 h-24 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto mb-8">
        <span class="text-5xl">❌</span>
      </div>

      <h1 class="text-4xl font-black text-white mb-4">Algo salió mal</h1>
      <p class="text-zinc-400 text-lg mb-8">{errorMsg}</p>

      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <a href="/checkout" class="bg-amber-500 hover:bg-amber-400 text-black font-bold px-8 py-3 rounded-full transition-all duration-300">
          Intentar de nuevo
        </a>
        <a href="/productos" class="bg-zinc-900 border border-white/10 hover:border-white/30 text-white font-bold px-8 py-3 rounded-full transition-all duration-300">
          Ver catálogo
        </a>
      </div>
    </div>
  {/if}
</div>
