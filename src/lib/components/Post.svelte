<script>
  import PlainText from '$lib/components/PlainText.svelte';
  import RichText from '$lib/components/RichText.svelte';
  import { formatDate } from '$lib/util';
  import NotEditable from './NotEditable.svelte';
  import { onMount } from 'svelte';

  let { title = $bindable(), content = $bindable(), created_at = $bindable(), editable } = $props();

  // Format date as yyyy-mm-dd for the input
  function toDateInputValue(dateString) {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  }

  // Convert yyyy-mm-dd back to ISO string, preserving the time
  function fromDateInputValue(dateInputValue) {
    const originalDate = new Date(created_at);
    const [year, month, day] = dateInputValue.split('-').map(Number);
    originalDate.setFullYear(year, month - 1, day);
    return originalDate.toISOString();
  }

  function handleDateChange(e) {
    created_at = fromDateInputValue(e.target.value);
  }

  let titleEl = $state();
  // HACK: set the focus to the title element, this will only work for new posts, which is intended behavior
  onMount(() => {
    setTimeout(() => {
      titleEl.querySelector('.ProseMirror')?.focus();
    }, 500);
  });
</script>

<div>
  <div class="max-w-(--breakpoint-md) mx-auto px-6">
    {#if editable}
      <div class="pb-2 sm:text-lg">
        <input
          type="date"
          value={toDateInputValue(created_at)}
          onchange={handleDateChange}
          class="border border-gray-300 rounded px-2 py-1"
        />
      </div>
    {:else}
      <div class="pb-2 sm:text-lg">{formatDate(created_at)}</div>
    {/if}
    <h1 bind:this={titleEl} class="text-3xl md:text-5xl font-bold">
      <PlainText {editable} bind:content={title} placeholder="Post title…" />
    </h1>
  </div>
</div>

<div class="max-w-(--breakpoint-md) mx-auto px-6">
  <div id="post_content" class="prose sm:prose-xl text-inherit">
    <RichText multiLine {editable} bind:content placeholder="Post content…" />
  </div>
</div>
