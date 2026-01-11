<script>
  /**
   * @typedef {Object} Props
   * @property {string} [confirmLabel]
   * @property {boolean} [canConfirm]
   * @property {Function} [oncancel]
   * @property {Function} [onsave]
   */

  /** @type {Props} */
  let { confirmLabel = 'Save', canConfirm = true, oncancel, onsave } = $props();
</script>

{#await import('$lib/components/EditorControls.svelte') then EditorToolbar}
  <EditorToolbar.default {oncancel} {onsave} {confirmLabel} {canConfirm} />
{/await}
