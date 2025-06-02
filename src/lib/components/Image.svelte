<script>
  /**
   * @typedef {Object} Props
   * @property {any} editable
   * @property {any} src
   * @property {any} alt
   * @property {any} [uploadPrompt]
   * @property {any} maxWidth
   * @property {any} maxHeight
   * @property {any} quality
   * @property {string} [class]
   */

  /** @type {Props} */
  let {
    editable,
    src = $bindable(),
    alt,
    uploadPrompt = undefined,
    maxWidth,
    maxHeight,
    quality,
    class: className = ''
  } = $props();
  let previewSrc = $state();
</script>

{#if editable}
  {#await import('./ImageEditor.svelte')}
    <img class={className} src={previewSrc || src} {alt} />
  {:then ImageEditor}
    <ImageEditor.default
      class={className}
      bind:src
      bind:previewSrc
      {alt}
      {uploadPrompt}
      {maxWidth}
      {maxHeight}
      {quality}
    />
  {/await}
{:else}
  <img width={maxWidth} height={maxHeight} class={className} {src} {alt} />
{/if}
