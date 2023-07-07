<script>
  import EditorToolbar from '$lib/components/EditorToolbar.svelte';
  import { extractTeaser, extractTeaserImage, fetchJSON, toDateString } from '$lib/util';
  import RecipientsSelector from '$lib/components/RecipientsSelector.svelte';
  import { goto } from '$app/navigation';
  import Post from '$lib/components/Post.svelte';

  export let data;

  let is_public = false,
    recipients = [],
    editable = true,
    title = '',
    content = '',
    created_at = toDateString();

  $: currentUser = data.currentUser;
  $: bio = data.bio;

  async function createPost() {
    if (!currentUser) {
      return alert('Sorry, you are not authorized to create new posts.');
    }
    const teaser = extractTeaser(document.getElementById('post_content'));
    const teaser_image = extractTeaserImage(document.getElementById('post_content'));
    try {
      const { slug } = await fetchJSON('POST', '/api/create-post', {
        title,
        content,
        teaser,
        teaser_image,
        recipients,
        is_public
      });
      goto(`/letters/${slug}`);
    } catch (err) {
      console.error(err);
      // HACK: This is guesswork
      alert(
        'Oops there was an error. Did you specify a title for your letter?'
      );
    }
  }

  async function discardDraft() {
    goto('/');
  }
</script>

<svelte:head>
  <title>New letter</title>
  <link rel="icon" type="image/png" sizes="300x300" href={bio.avatar} />
  <link rel="apple-touch-icon" sizes="300x300" href={bio.avatar} />
</svelte:head>

{#if editable}
  <EditorToolbar
    on:cancel={discardDraft}
    on:save={createPost}
    confirmLabel={is_public ? 'Publish' : recipients.length > 0 ? 'Send' : 'Save'}
  />
{/if}

<!-- <WebsiteNav bind:editable /> -->
<div class="pt-8 sm:pt-16" />
<RecipientsSelector {editable} bind:is_public bind:recipients />

<Post bind:title bind:content bind:created_at {editable} />
<!-- <Footer {editable} /> -->
