<script lang="ts">
  import { page } from "$app/state";
  import { LoaderCircle } from "@lucide/svelte";
  import {
    PUBLIC_ETHER_PAY_URL,
    PUBLIC_RECEIVER_WALLET_ID,
  } from "$env/static/public";

  let walletId = $state(PUBLIC_RECEIVER_WALLET_ID);
  let amount = $state(100);
  let loading = $state(false);

  async function handleFetch() {
    loading = true;
    try {
      const res = await fetch(`${PUBLIC_ETHER_PAY_URL}/api/upi`, {
        method: "POST",
        body: JSON.stringify({
          origin: page.url.origin,
          amount,
          walletId,
        }),
      });
      const body = await res.json();
      if (!body.link) throw "Body link not found";
      window.location.href = body.link;
    } catch (e: any) {
      console.error("err", e);
      loading = false;
    }
  }
</script>

<div
  class="absolute gap-4 top-0 left-0 w-full h-full flex justify-center flex-col items-center"
>
  {#if loading}
    <LoaderCircle class="animate-spin size-10" />
  {:else}
    <p>Enter amount to receive</p>
    <input
      class="outline-none text-center text-2xl"
      type="number"
      min="0"
      bind:value={amount}
    />
    <button
      class="cursor-pointer rounded-md shadow border min-w-36 py-2"
      onclick={handleFetch}
    >
      Pay
    </button>
  {/if}
</div>
