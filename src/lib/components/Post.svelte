<script>
  import PlainText from '$lib/components/PlainText.svelte';
  import RichText from '$lib/components/RichText.svelte';
  import Date from '$lib/components/Date.svelte';
  export let title;
  export let content;
  export let createdAt = undefined;
  export let editable;
</script>

<div>
  <div class="max-w-screen-md mx-auto px-6">
    <div class="pt-12 sm:pt-24 font-medium lg:text-lg">
      <Date {editable} bind:value={createdAt} />
    </div>
    <h1 class="text-3xl md:text-5xl font-medium pt-2">
      <PlainText {editable} bind:content={title} />
    </h1>
  </div>
</div>

<div class="max-w-screen-md mx-auto px-6">
  <div id="post_content" class="prose sm:prose-xl text-inherit">
    <RichText multiLine {editable} bind:content />
  </div>
</div>
