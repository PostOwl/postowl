<script>
  export let confirmLabel = 'Save';
</script>

{#await import('$lib/components/EditorControls.svelte') then EditorToolbar}
  <EditorToolbar.default on:cancel on:save {confirmLabel} />
{/await}