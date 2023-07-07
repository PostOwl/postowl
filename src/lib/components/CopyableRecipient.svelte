<script>
  import { page } from '$app/stores';
  import { createEventDispatcher } from 'svelte';
  import { onDestroy } from 'svelte';

  let flash = undefined;
  let timeout;

  export let recipient;
  export let slug;
  export let editable;

  $: origin = $page.data.origin;

  const dispatch = createEventDispatcher();

  onDestroy(() => clearTimeout(timeout));

  function handleDelete() {
    dispatch('delete', {});
  }

  function flashCopied() {
    if (!flash) {
      flash = true;
      timeout = setTimeout(() => {
        flash = false;
      }, 1000);
    }
  }

  async function copySecretUrl() {
    await navigator.clipboard.writeText(
      `${origin}/letters/${slug}?secret=${recipient.secret}`
    );
    flashCopied();
  }
</script>

<div
  class="relative rounded-full bg-yellow-100 px-3 py-0.5 mr-1 mb-1 text-sm sm:text-base text-yellow-800 inline-flex items-center space-x-1"
>
  <!-- TODO: hide when not seen -->
  {#if recipient.has_seen}
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      class="w-3 h-3"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  {/if}
  <span>{recipient.email}</span>
  {#if editable}
    <button on:click={() => handleDelete()}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="w-5 h-5"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  {:else}
    <!-- Copy secret url -->
    <button on:click={copySecretUrl}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="inline-block w-4 h-4"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"
        />
      </svg>
    </button>
  {/if}
  {#if flash}
    <div
      class="absolute -bottom-6 left-5 text-xs bg-white shadow-sm rounded-full px-4 py-2 whitespace-nowrap"
    >
      Link copied
    </div>
  {/if}
</div>
