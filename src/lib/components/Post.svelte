<script>
  import PlainText from '$lib/components/PlainText.svelte';
  import RichText from '$lib/components/RichText.svelte';
  export let title;
  export let content;
  export let editable;
</script>

<div>
  <div class="max-w-screen-md mx-auto px-6">
    <h1 class="text-3xl md:text-5xl font-medium pt-8">
      <PlainText {editable} bind:content={title} />
    </h1>
  </div>
</div>

<div class="max-w-screen-md mx-auto px-6">
  <div id="post_content" class="prose sm:prose-xl text-inherit">
    <RichText multiLine {editable} bind:content />
  </div>
</div>
