<script>
  /**
   * @typedef {Object} Props
   * @property {string} [confirmLabel]
   * @property {boolean} [canConfirm]
   */

  /** @type {Props} */
  let { confirmLabel = 'Save', canConfirm = true } = $props();
</script>

{#await import('$lib/components/EditorControls.svelte') then EditorToolbar}
  <EditorToolbar.default on:cancel on:save {confirmLabel} {canConfirm} />
{/await}
