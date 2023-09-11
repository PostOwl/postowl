<script>
  export let editable;
  export let content;
  export let multiLine = false;
</script>

{#if editable}
  {#await import('./RichTextEditor.svelte')}
    <!-- eslint-disable-next-line svelte/no-at-html-tags -->
    {@html content}
  {:then RichTextEditor}
    <RichTextEditor.default {multiLine} bind:content {...$$restProps} />
  {/await}
{:else}
  <div>
    <!-- eslint-disable-next-line svelte/no-at-html-tags -->
    {@html content}
  </div>
{/if}
