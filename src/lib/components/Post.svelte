<script>
  import PlainText from '$lib/components/PlainText.svelte';
  import RichText from '$lib/components/RichText.svelte';
  import { formatDate } from '$lib/util';
  export let title;
  export let content;
  export let createdAt;
  export let editable;
</script>

<div>
  <div class="max-w-screen-md mx-auto px-6">
    <div>{formatDate(createdAt)}</div>
    <h1 class="text-3xl md:text-5xl font-bold pt-8">
      <PlainText {editable} bind:content={title} />
    </h1>
  </div>
</div>

<div class="max-w-screen-md mx-auto px-6">
  <div id="post_content" class="prose sm:prose-xl text-inherit">
    <RichText multiLine {editable} bind:content />
  </div>
</div>
