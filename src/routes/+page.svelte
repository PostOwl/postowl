<script>
  import EditorToolbar from '$lib/components/EditorToolbar.svelte';
  import PlainText from '$lib/components/PlainText.svelte';
  import RichText from '$lib/components/RichText.svelte';
  import { fetchJSON, extendQueryParams } from '$lib/util';
  import PrimaryButton from '$lib/components/PrimaryButton.svelte';
  import WebsiteNav from '$lib/components/WebsiteNav.svelte';
  import Modal from '$lib/components/Modal.svelte';
  import LoginMenu from '$lib/components/LoginMenu.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import Image from '$lib/components/Image.svelte';
  import NotEditable from '$lib/components/NotEditable.svelte';
  import SectionLabel from '$lib/components/SectionLabel.svelte';

  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import PostTeaser from '$lib/components/PostTeaser.svelte';

  export let data;
  $: currentUser = data.currentUser;

  // --------------------------------------------------------------------------
  // DEFAULT PAGE CONTENT - AJDUST TO YOUR NEEDS
  // --------------------------------------------------------------------------

  const BIO_PLACEHOLDER = `
		<p>Enter short bio text here.</p>
	`;

  let editable, title, bioTitle, bioPicture, bio, contact, showUserMenu;

  $: projectLimit = $page.url.searchParams.get('projectLimit') || 4;
  $: postLimit = $page.url.searchParams.get('postLimit') || 4;

  function initOrReset() {
    title = data.page?.title || 'Untitled Website';
    bioPicture = data.page?.bioPicture || '/images/person-placeholder.jpg';
    bioTitle = data.page?.bioTitle || 'I am Jane Doe';
    bio = data.page?.bio || BIO_PLACEHOLDER;
    editable = false;
  }

  // --------------------------------------------------------------------------
  // Page logic
  // --------------------------------------------------------------------------

  function toggleEdit() {
    editable = true;
    showUserMenu = false;
  }

  function showMoreProjects() {
    goto(extendQueryParams({ projectLimit: projectLimit + 10 }), { noScroll: true });
  }

  function showMoreposts() {
    goto(extendQueryParams({ postLimit: postLimit + 10 }), { noScroll: true });
  }

  async function savePage() {
    try {
      // Only persist the start page when logged in as an admin
      if (currentUser) {
        await fetchJSON('POST', '/api/save-page', {
          pageId: 'home',
          page: {
            title,
            bioPicture,
            bioTitle,
            bio,
            contact
          }
        });
      }
      editable = false;
    } catch (err) {
      console.error(err);
      alert('There was an error. Please try again.');
    }
  }

  initOrReset();
</script>

<svelte:head>
  <title>PostOwl Site</title>
  <meta
    name="description"
    content="The story of my life"
  />
  <meta name="og:title" property="og:title" content="PostOwl Site" />
  <meta
    name="og:description"
    property="og:description"
    content="The story of my life"
  />
  <meta
    name="og:image"
    property="og:image"
    content="%sveltekit.assets%/favicon/favicon-512x512.png"
  />
  <meta name="twitter:card" content="summary" />
  <meta name="twitter:title" content="PostOwl Site" />
  <meta
    name="twitter:description"
    content="The story of my life"
  />
  <meta name="twitter:image" content="%sveltekit.assets%/favicon/favicon-512x512.png" />
  <meta name="robots" content="index, follow" />
</svelte:head>

{#if editable}
  <EditorToolbar {currentUser} on:cancel={initOrReset} on:save={savePage} />
{/if}

<WebsiteNav bind:showUserMenu {currentUser} bind:editable />

{#if showUserMenu}
  <Modal on:close={() => (showUserMenu = false)}>
    <form class="w-full block" method="POST">
      <div class="w-full flex flex-col space-y-4 p-4 sm:p-6">
        <PrimaryButton type="button" on:click={() => goto('/posts/new')}>
          New letter
        </PrimaryButton>
        <PrimaryButton on:click={toggleEdit}>Edit page</PrimaryButton>
        <LoginMenu {currentUser} />
      </div>
    </form>
  </Modal>
{/if}

<!-- Bio -->
<div class="bg-white">
  <div class="max-w-screen-md mx-auto px-6">
    <div class="pt-6 sm:pt-12 pb-2 sm:pb-6 text-center">
      <Image
        class="inline-block w-16 h-16 md:w-28 md:h-28 rounded-full"
        maxWidth="384"
        maxHeight="384"
        quality="0.8"
        {editable}
        {currentUser}
        bind:src={bioPicture}
        alt={undefined}
      />
    </div>
    <div class="">
      <h1 class="text-center text-3xl md:text-6xl font-bold">
        <PlainText {editable} bind:content={bioTitle} />
      </h1>
    </div>
    <div class="prose text-center py-2 sm:text-xl">
      <RichText {editable} bind:content={bio} />
    </div>
  </div>
</div>

<NotEditable {editable}>
  <div class="bg-white pb-10 sm:pb-16" id="letters">
    <div class="max-w-screen-md mx-auto px-6 pt-16 lg:pt-24">
      {#if data.posts.length === 0}
        <div class="md:text-xl py-4">No letters so far.</div>
      {/if}
    </div>

    <div class="max-w-screen-md mx-auto px-6">
      <div class="grid sm:grid-cols-1 gap-14 my-6 space-y-12">
        {#each data.posts.slice(0, postLimit) as post, i}
          <PostTeaser {post} />
        {/each}
      </div>
    </div>

    {#if postLimit < data.posts.length}
      <div class="max-w-screen-md mx-auto px-6 lg:pt-6">
        <button
          class="w-full mx-auto block px-4 py-2 border border-black text-center uppercase text-sm lg:text-lg font-medium"
          on:click={showMoreposts}
        >
          Show more
        </button>
      </div>
    {/if}
  </div>
</NotEditable>

<Footer counter="/" {editable} />
