<script>
  export let editable;
  export let content;
  export let multiLine = false;
</script>

{#if editable}
  {#await import('./PlainTextEditor.svelte')}
    <!-- eslint-disable-next-line svelte/no-at-html-tags -->
    {@html content}
  {:then PlainTextEditor}
    <PlainTextEditor.default {multiLine} bind:content {...$$restProps} />
  {/await}
{:else}
  <!-- eslint-disable-next-line svelte/no-at-html-tags -->
  {@html content}
{/if}
