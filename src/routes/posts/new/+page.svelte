<script>
  import EditorToolbar from '$lib/components/EditorToolbar.svelte';
  import { extractTeaser, extractTeaserImage, fetchJSON, toDateString } from '$lib/util';
  import RecipientsSelector from '$lib/components/RecipientsSelector.svelte';
  import WebsiteNav from '$lib/components/WebsiteNav.svelte';
  import { goto } from '$app/navigation';
  import Footer from '$lib/components/Footer.svelte';
  import Post from '$lib/components/Post.svelte';

  export let data;

  let is_public = false,
    recipients = [],
    editable = true,
    title = 'Untitled',
    content = 'Copy and paste your text here.',
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
      goto(`/posts/${slug}`);
    } catch (err) {
      console.error(err);
      // HACK: This is guesswork
      alert('Error. Likely a document with that title has already been published. Choose a different title.');
    }
  }

  async function discardDraft() {
    goto('/');
  }
</script>

<svelte:head>
  <title>New letter</title>
  <link rel="icon" type="image/png" sizes="300x300" href={bio.avatar}>
  <link rel="apple-touch-icon" sizes="300x300" href={bio.avatar}>
</svelte:head>

{#if editable}
  <EditorToolbar on:cancel={discardDraft} on:save={createPost} confirmLabel={is_public ? 'Publish' : recipients.length > 0 ? 'Send' : 'Save' } />
{/if}

<WebsiteNav bind:editable />
<div class="pt-8 sm:pt-16 "></div>
<RecipientsSelector {editable} bind:is_public bind:recipients />
<div class="pt-8"></div>
<Post bind:title bind:content bind:created_at {editable} />
<Footer {editable} />
