<script>
  import EditorToolbar from '$lib/components/EditorToolbar.svelte';
  import { extractTeaser, extractTeaserImage, fetchJSON, toDateString } from '$lib/util';
  import RecipientsSelector from '$lib/components/RecipientsSelector.svelte';
  import { goto } from '$app/navigation';
  import Footer from '$lib/components/Footer.svelte';
  import Post from '$lib/components/Post.svelte';

  export let data;

  let isPublic = false,
    recipients = [],
    editable = true,
    title = 'Untitled',
    content = 'Copy and paste your text here.',
    createdAt = toDateString();

  $: currentUser = data.currentUser;

  async function createPost() {
    if (!currentUser) {
      return alert('Sorry, you are not authorized to create new posts.');
    }
    const teaser = extractTeaser(document.getElementById('post_content'));
    const teaserImage = extractTeaserImage(document.getElementById('post_content'));
    try {
      const { slug } = await fetchJSON('POST', '/api/create-post', {
        title,
        content,
        teaser,
        teaserImage,
        recipients,
        isPublic
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
</svelte:head>

{#if editable}
  <EditorToolbar {currentUser} on:cancel={discardDraft} on:save={createPost} confirmLabel='Send' />
{/if}

<RecipientsSelector bind:isPublic bind:recipients />
<Post bind:title bind:content bind:createdAt {editable} />
<Footer {editable} />
