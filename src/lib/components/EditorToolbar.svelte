<script>
  export let currentUser;
  export let isDark = false;
</script>

{#await import('$lib/components/EditorControls.svelte') then EditorToolbar}
  <EditorToolbar.default {currentUser} on:cancel on:save {isDark} />
{/await}
