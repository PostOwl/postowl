<script>
  export let editable;
  export let value;
  import { formatDate } from '$lib/util';
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
