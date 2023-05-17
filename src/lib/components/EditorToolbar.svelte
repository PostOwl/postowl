<script>
  export let currentUser;
  export let isDark = false;
  export let confirmLabel = 'Save';
</script>

{#await import('$lib/components/EditorControls.svelte') then EditorToolbar}
  <EditorToolbar.default {currentUser} on:cancel on:save {isDark} {confirmLabel} />
{/await}
