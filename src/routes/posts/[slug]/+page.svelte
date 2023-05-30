<script>
  import EditorToolbar from '$lib/components/EditorToolbar.svelte';
  import { extractTeaser, extractTeaserImage, fetchJSON } from '$lib/util';
  import PrimaryButton from '$lib/components/PrimaryButton.svelte';
  import SecondaryButton from '$lib/components/SecondaryButton.svelte';
  import WebsiteNav from '$lib/components/WebsiteNav.svelte';
  import { goto } from '$app/navigation';
  import Footer from '$lib/components/Footer.svelte';
  import Post from '$lib/components/Post.svelte';
  import NotEditable from '$lib/components/NotEditable.svelte';
  import RecipientsSelector from '$lib/components/RecipientsSelector.svelte';
  
  export let data;

  let editable, title, content, createdAt, updatedAt, teaserImage, teaser, isPublic, recipients;

  $: currentUser = data.currentUser;
  $: {
    // HACK: To make sure this is only run when the parent passes in new data
    data = data;
    initOrReset();
  }

  function initOrReset() {
    title = data.title;
    content = data.content;
    createdAt = data.createdAt;
    updatedAt = data.updatedAt;
    teaserImage = data.teaserImage;
    teaser = data.teaser;
    isPublic = data.isPublic;
    recipients = data.recipients;
    editable = false;
  }

  async function deletePost() {
    if (!currentUser) return alert('Sorry, you are not authorized.');

    if (confirm('Are you sure you want to delete this letter? It cannot be undone.')) {
      try {
        await fetchJSON('POST', '/api/delete-post', {
          slug: data.slug
        });
        goto('/');
      } catch (err) {
        console.error(err);
        alert('Error deleting the article. Try again.');
        window.location.reload();
      }
    }
  }

  async function savePost() {
    if (!currentUser) return alert('Sorry, you are not authorized.');
    teaser = extractTeaser(document.getElementById('post_content'));
    teaserImage = extractTeaserImage(document.getElementById('post_content'));
    try {
      const result = await fetchJSON('POST', '/api/update-post', {
        slug: data.slug,
        title,
        content,
        teaser,
        teaserImage,
        recipients,
        isPublic
      });
      updatedAt = result.updatedAt;
      editable = false;
    } catch (err) {
      console.error(err);
      alert(
        'There was an error. You can try again, but before that, please just copy and paste your article into a safe place.'
      );
    }
  }
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={teaser} />
  <meta name="og:title" property="og:title" content={title} />
  <meta name="og:description" property="og:description" content={teaser} />
  <meta
    name="og:image"
    property="og:image"
    content={data.teaserImage || data.bio.avatar}
  />
  <meta name="twitter:card" content="summary" />
  <meta name="twitter:title" content={title} />
  <meta name="twitter:description" content={teaser} />
  <meta name="twitter:image" content={data.teaserImage || data.bio.avatar} />

  <link rel="icon" type="image/png" sizes="300x300" href={data.bio.avatar}>
  <link rel="apple-touch-icon" sizes="300x300" href={data.bio.avatar}>

  <meta name="robots" content="index, follow" />
</svelte:head>

{#if editable}
  <EditorToolbar {currentUser} on:cancel={initOrReset} on:save={savePost} />
{/if}

<WebsiteNav bind:editable {currentUser} bio={data.bio} />

{#if editable}
  <RecipientsSelector bind:isPublic bind:recipients />
{/if}
<Post bind:title bind:content bind:createdAt {editable} />

<div class="max-w-screen-md mx-auto px-6">
  {#if currentUser && !editable}
    <div class="flex justify-center py-4 space-x-4">
      <PrimaryButton size='sm' on:click={() => editable = true}>Edit</PrimaryButton>
      <SecondaryButton size='sm' on:click={deletePost}>Delete</SecondaryButton>
    </div>
  {/if}
</div>

<NotEditable {editable}>
  <div class="text-center max-w-screen-sm mx-auto px-6 py-12 sm:py-16">
    <div class="pb-4 text-center">
      <a href="/"><img src={data.bio.avatar} alt={data.bio.name} class="inline-block w-16 h-16 md:w-16 md:h-16 rounded-full" /></a>
    </div>

    <div class="text-center pb-4 sm:pb-8">
      <a href="/" class="text-2xl font-bold underline">
        {data.bio.name}
      </a>
    </div>

    <p class="sm:text-lg prose">{@html data.bio.bio}</p>
  </div>
</NotEditable>

<Footer {editable} counter={`/blog/${data.slug}`} />
