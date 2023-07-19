<script>
  export let confirmLabel = 'Save';
  export let canConfirm = true;
</script>

{#await import('$lib/components/EditorControls.svelte') then EditorToolbar}
  <EditorToolbar.default on:cancel on:save {confirmLabel} {canConfirm} />
{/await}