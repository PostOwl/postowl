<script>
  import EditorToolbar from '$lib/components/EditorToolbar.svelte';
  import { extractTeaser, extractTeaserImage, fetchJSON } from '$lib/util';
  import PrimaryButton from '$lib/components/PrimaryButton.svelte';
  import WebsiteNav from '$lib/components/WebsiteNav.svelte';
  import Modal from '$lib/components/Modal.svelte';
  import LoginMenu from '$lib/components/LoginMenu.svelte';
  import { goto } from '$app/navigation';
  import Footer from '$lib/components/Footer.svelte';
  import Post from '$lib/components/Post.svelte';

  export let data;
  $: prev = data.prev;
  $: next = data.next;

  let showUserMenu = false;
  let editable, title, content, createdAt, updatedAt;

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
    editable = false;
  }

  function toggleEdit() {
    editable = true;
    showUserMenu = false;
  }

  async function deleteArticle() {
    if (!currentUser) return alert('Sorry, you are not authorized.');

    if (confirm('Are you sure you want to delete this post? It cannot be undone.')) {
      try {
        fetchJSON('POST', '/api/delete-post', {
          slug: data.slug
        });
        goto('/blog');
      } catch (err) {
        console.error(err);
        alert('Error deleting the article. Try again.');
        window.location.reload();
      }
    }
  }

  async function savePost() {
    if (!currentUser) return alert('Sorry, you are not authorized.');
    const teaser = extractTeaser(document.getElementById('post_content'));
    const teaserImage = extractTeaserImage(document.getElementById('post_content'));
    try {
      const result = await fetchJSON('POST', '/api/update-post', {
        slug: data.slug,
        title,
        content,
        teaser,
        teaserImage,
        createdAt
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
  <meta name="description" content={data.meta?.teaser} />
  <meta name="og:title" property="og:title" content={title} />
  <meta name="og:description" property="og:description" content={data.meta?.teaser} />
  <meta
    name="og:image"
    property="og:image"
    content="%sveltekit.assets%/favicon/favicon-512x512.png"
  />
  <meta name="twitter:card" content="summary" />
  <meta name="twitter:title" content={title} />
  <meta name="twitter:description" content={data.meta?.teaser} />
  <meta name="twitter:image" content="%sveltekit.assets%/favicon/favicon-512x512.png" />
  <meta name="robots" content="index, follow" />
</svelte:head>

{#if editable}
  <EditorToolbar {currentUser} on:cancel={initOrReset} on:save={savePost} />
{/if}

<WebsiteNav bind:editable bind:showUserMenu {currentUser} />

{#if showUserMenu}
  <Modal on:close={() => (showUserMenu = false)}>
    <form class="w-full block" method="POST">
      <div class="w-full flex flex-col space-y-4 p-4 sm:p-6">
        <PrimaryButton on:click={toggleEdit}>Edit post</PrimaryButton>
        <PrimaryButton type="button" on:click={deleteArticle}>Delete post</PrimaryButton>
        <LoginMenu {currentUser} />
      </div>
    </form>
  </Modal>
{/if}

<Post bind:title bind:content bind:createdAt {editable} />

<Footer counter={`/blog/${data.slug}`} />
