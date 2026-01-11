<script>
  /**
   * @typedef {Object} Props
   * @property {any} editable
   * @property {any} content
   * @property {boolean} [multiLine]
   */

  /** @type {Props & { [key: string]: any }} */
  let { editable, content = $bindable(), multiLine = false, ...rest } = $props();
</script>

{#if editable}
  {#await import('./PlainTextEditor.svelte')}
    <!-- eslint-disable-next-line svelte/no-at-html-tags -->
    {@html content}
  {:then PlainTextEditor}
    <PlainTextEditor.default {multiLine} bind:content {...rest} />
  {/await}
{:else}
  <!-- eslint-disable-next-line svelte/no-at-html-tags -->
  {@html content}
{/if}
