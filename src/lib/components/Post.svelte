<script>
  import PlainText from '$lib/components/PlainText.svelte';
  import RichText from '$lib/components/RichText.svelte';
  import { formatDate } from '$lib/util';
  import NotEditable from './NotEditable.svelte';
  import { onMount } from 'svelte';

  export let title;
  export let content;
  export let created_at;
  export let editable;

  let titleEl;
  // HACK: set the focus to the title element, this will only work for new posts, which is intended behavior
  onMount(() => {
    setTimeout(() => {
      titleEl.querySelector('.ProseMirror')?.focus();
    }, 500);
  });
</script>

<div>
  <div class="max-w-screen-md mx-auto px-6">
    <NotEditable {editable}>
      <div class="pb-2 sm:text-lg">{formatDate(created_at)}</div>
    </NotEditable>
    <h1 bind:this={titleEl} class="text-3xl md:text-5xl font-bold">
      <PlainText {editable} bind:content={title} placeholder="Post title…" />
    </h1>
  </div>
</div>

<div class="max-w-screen-md mx-auto px-6">
  <div id="post_content" class="prose sm:prose-xl text-inherit">
    <RichText multiLine {editable} bind:content placeholder="Post content…" />
  </div>
</div>
