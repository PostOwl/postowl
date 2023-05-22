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
  import NotEditable from '$lib/components/NotEditable.svelte';

  export let data;

  let showUserMenu = false;
  let editable, title, content, createdAt, updatedAt;

  $: currentUser = data.currentUser;

  $: fullName = data.page?.name || 'Jane Doe'; 
  $: avatar = data.page?.avatar || '/images/person-placeholder.jpg';
  $: bio = data.page?.bio;

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
    const teaser = extractTeaser(document.getElementById('post_content'));
    const teaserImage = extractTeaserImage(document.getElementById('post_content'));
    try {
      const result = await fetchJSON('POST', '/api/update-post', {
        slug: data.slug,
        title,
        content,
        teaser,
        teaserImage,
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

<NotEditable {editable}>
  <div class="bg-white">
    <div class="max-w-screen-md mx-auto px-6 pb-8">
      <div class="pt-6 sm:pt-16 pb-2 text-center">
        <a href="/"><img src={avatar} alt={fullName} class="inline-block w-16 h-16 md:w-16 md:h-16 rounded-full" /></a>
      </div>
      <div class="text-center">
        <a href="/" class="text-lg font-semibold underline">
          {fullName}
        </a>
      </div>
    </div>
  </div>
</NotEditable>

<Post bind:title bind:content bind:createdAt {editable} />

{#if bio}
  <NotEditable {editable}>
    <div class="text-center max-w-screen-sm mx-auto px-6 py-16">
      <h1 class="sm:text-xl font-bold pb-4">About {fullName}</h1>
      <p class="sm:text-lg prose">{@html bio}</p>
    </div>
  </NotEditable>
{/if}

<Footer counter={`/blog/${data.slug}`} />
