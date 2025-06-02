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
  {#await import('./RichTextEditor.svelte')}
    <!-- eslint-disable-next-line svelte/no-at-html-tags -->
    {@html content}
  {:then RichTextEditor}
    <RichTextEditor.default {multiLine} bind:content {...rest} />
  {/await}
{:else}
  <div>
    <!-- eslint-disable-next-line svelte/no-at-html-tags -->
    {@html content}
  </div>
{/if}
