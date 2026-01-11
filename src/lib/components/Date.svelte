<script>
  import { formatDate } from '$lib/util';
  let { editable, value = $bindable() } = $props();
</script>

{#if editable}
  {#await import('./DateEditor.svelte')}
    {formatDate(value)}
  {:then DateEditor}
    <DateEditor.default bind:value />
  {/await}
{:else}
  {formatDate(value)}
{/if}
