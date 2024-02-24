<script>
  import EditorToolbar from '$lib/components/EditorToolbar.svelte';
  import { extractTeaser, extractTeaserImage, fetchJSON } from '$lib/util';
  import SecondaryButton from '$lib/components/SecondaryButton.svelte';
  import WebsiteNav from '$lib/components/WebsiteNav.svelte';
  import { goto } from '$app/navigation';
  import Footer from '$lib/components/Footer.svelte';
  import Post from '$lib/components/Post.svelte';
  import NotEditable from '$lib/components/NotEditable.svelte';
  import RecipientsSelector from '$lib/components/RecipientsSelector.svelte';

  export let data;
  let editable, title, content, created_at, teaser_image, teaser, is_public, recipients;
  let showMenu;

  $: currentUser = data.currentUser;
  $: {
    // HACK: To make sure this is only run when the parent passes in new data
    data = data;
    initOrReset();
  }


  function initOrReset() {
    title = data.title;
    content = data.content;
    created_at = data.created_at;
    teaser_image = data.teaser_image;
    teaser = data.teaser;
    is_public = data.is_public;
    recipients = data.recipients;
    editable = false;
  }

  async function deletePost() {
    if (!currentUser) return alert('Sorry, you are not authorized.');

    if (confirm('Are you sure you want to delete this post? It cannot be undone.')) {
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
    teaser_image = extractTeaserImage(document.getElementById('post_content'));
    try {
      const result = await fetchJSON('POST', '/api/update-post', {
        slug: data.slug,
        title,
        content,
        teaser,
        teaser_image,
        recipients,
        is_public
      });
      recipients = result.recipients;
      editable = false;
      // In case the slug has changed (title change) forward to the correct url
      if (result.slug !== data.slug) {
        goto(`/posts/${result.slug}`);
      }
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
  <meta name="og:image" property="og:image" content={data.teaser_image || data.bio.avatar} />
  <meta name="twitter:card" content="summary" />
  <meta name="twitter:title" content={title} />
  <meta name="twitter:description" content={teaser} />
  <meta name="twitter:image" content={data.teaser_image || data.bio.avatar} />

  <link href="/feed.xml" rel="alternate" type="application/rss+xml" title={data.bio.name} />
  <link rel="icon" type="image/png" sizes="300x300" href={data.bio.avatar} />
  <link rel="apple-touch-icon" sizes="300x300" href={data.bio.avatar} />

  <meta name="robots" content="index, follow" />
</svelte:head>

{#if editable}
  <EditorToolbar on:cancel={initOrReset} on:save={savePost} canConfirm={!!title} />
{/if}

<WebsiteNav bio={data.bio} bind:editable bind:showMenu backButton={true}>
  {#if currentUser}
    <div class="space-y-4 flex flex-col">
      <SecondaryButton
        size="sm"
        on:click={() => {
          editable = true;
          showMenu = false;
        }}>Edit post</SecondaryButton
      >
      <SecondaryButton size="sm" on:click={deletePost}>Delete post</SecondaryButton>
    </div>
  {/if}
</WebsiteNav>

<div class="pt-8 sm:pt-16" />

{#if currentUser}
  <RecipientsSelector slug={data.slug} {editable} bind:is_public bind:recipients />
{/if}

<Post bind:title bind:content bind:created_at {editable} />

<NotEditable {editable}>
  <div class="text-center max-w-screen-sm mx-auto px-6 py-12 sm:py-16">
    <div class="pb-4 text-center">
      <a href="/"
        ><img
          src={data.bio.avatar}
          alt={data.bio.name}
          class="inline-block w-16 h-16 md:w-16 md:h-16 rounded-full"
        /></a
      >
    </div>

    <div class="text-center pb-4 sm:pb-8">
      <a href="/" class="text-2xl font-bold underline">
        {data.bio.name}
      </a>
    </div>

    <!-- eslint-disable-next-line svelte/no-at-html-tags -->
    <p class="sm:text-lg prose">{@html data.bio.bio}</p>
  </div>
</NotEditable>
<Footer {editable} counter={`/blog/${data.slug}`} />
