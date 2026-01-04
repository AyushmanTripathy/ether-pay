<script lang="ts">
  import { page } from "$app/state";
  import { LoaderCircle } from "@lucide/svelte";
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { PUBLIC_ETHER_PAY_URL } from "$env/static/public";

  let loading = $state(true);
  let txHash = $state(null);

  onMount(async () => {
    try {
      const linkId = page.url.searchParams.get("razorpay_payment_link_id");
      const res = await fetch(`${PUBLIC_ETHER_PAY_URL}/api/upi/capture`, {
        method: "POST",
        body: JSON.stringify({
          linkId,
        }),
      });
      const body = await res.json();
      txHash = body.transactionHash;
      loading = false;

      setTimeout(() => {
        goto("/");
      }, 3000);
    } catch (e: any) {
      console.error("err", e);
    }
  });
</script>

<div
  class="absolute gap-4 top-0 left-0 w-full h-full flex justify-center flex-col items-center"
>
  {#if loading}
    <LoaderCircle class="animate-spin size-10" />
  {:else if txHash}
    <p class="text-2xl">Done!</p>
    <span>{txHash}</span>
  {:else}
    <p class="text-2xl">Transaction Failed</p>
  {/if}
</div>
