<script>
  import EditorToolbar from '$lib/components/EditorToolbar.svelte';
  import PlainText from '$lib/components/PlainText.svelte';
  import RichText from '$lib/components/RichText.svelte';
  import PrimaryButton from '$lib/components/PrimaryButton.svelte';
  import SecondaryButton from '$lib/components/SecondaryButton.svelte';
  import WebsiteNav from '$lib/components/WebsiteNav.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import Image from '$lib/components/Image.svelte';
  import NotEditable from '$lib/components/NotEditable.svelte';
  import PostTeaser from '$lib/components/PostTeaser.svelte';

  import { fetchJSON, extendQueryParams, classNames } from '$lib/util';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';

  export let data;
  let editable, name, avatar, bio;
  let searchInput;
  let searchFilter = data.searchFilter;
  let showMenu;
  $: currentUser = data.currentUser;
  $: postLimit = $page.url.searchParams.get('postLimit') || 30;

  function initOrReset() {
    avatar = data.bio.avatar;
    name = data.bio.name;
    bio = data.bio.bio;
    editable = false;
  }

  // --------------------------------------------------------------------------
  // Page logic
  // --------------------------------------------------------------------------

  function showMoreposts() {
    goto(extendQueryParams({ postLimit: postLimit + 50 }), { noScroll: true });
  }

  // NOTE: We utilize the page API to store bio information
  async function saveBio() {
    try {
      if (currentUser) {
        await fetchJSON('POST', '/api/save-page', {
          page_id: 'bio',
          page: {
            avatar,
            name,
            bio
          }
        });
      }
      editable = false;
    } catch (err) {
      console.error(err);
      alert('There was an error. Please try again.');
    }
  }

  function onInput(e) {
		goto('/?q=' + searchInput.value + (currentUser ? '&f='+searchFilter : ''), { keepFocus: true });
	}

  function reset(e) {
    searchFilter = '';
    goto('/');
  }

  initOrReset();
</script>

<svelte:head>
  <title>{name}</title>
  <meta name="description" content="The story of my life" />
  <meta name="og:title" property="og:title" content={name} />
  <meta name="og:description" property="og:description" content="The story of my life" />
  <meta
    name="og:image"
    property="og:image"
    content="%sveltekit.assets%/favicon/favicon-512x512.png"
  />
  <meta name="twitter:card" content="summary" />
  <meta name="twitter:title" content={name} />
  <meta name="twitter:description" content="The story of my life" />
  <meta name="twitter:image" content="%sveltekit.assets%/favicon/favicon-512x512.png" />
  <meta name="robots" content="index, follow" />

  <link href="/rss.xml" rel="alternate" type="application/rss+xml" title={name}>
  <link rel="icon" type="image/png" sizes="300x300" href={avatar} />
  <link rel="apple-touch-icon" sizes="300x300" href={avatar} />
</svelte:head>

{#if editable}
  <EditorToolbar on:cancel={initOrReset} on:save={saveBio} />
{/if}

<WebsiteNav bio={{ avatar, name, bio }} bind:editable bind:showMenu>
  {#if currentUser}
    <div class="space-y-4 flex flex-col">
      <SecondaryButton size="sm" on:click={() => {editable = true; showMenu = false; }}>Edit Profile</SecondaryButton>
    </div>
  {/if}
</WebsiteNav>

<!-- __bio is there to make placeholder work with centered text -->
<div class="__bio">
  <div class="max-w-screen-md mx-auto px-6">
    <div class="pt-6 sm:pt-12 pb-2 sm:pb-6 text-center">
      <div class="w-20 h-20 md:w-28 md:h-28 mx-auto overflow-hidden relative rounded-full">
        <Image
          class="block w-20 h-20 md:w-28 md:h-28 rounded-full"
          maxWidth="384"
          maxHeight="384"
          quality="0.8"
          {editable}
          bind:src={avatar}
          alt={name}
        />
      </div>
    </div>
    <div class="">
      <h1 class="text-center text-3xl md:text-6xl font-bold">
        <PlainText {editable} bind:content={name} />
      </h1>
    </div>
    <div class="prosa text-center py-4 sm:text-xl">
      <RichText {editable} bind:content={bio} />
    </div>
  </div>
</div>

<NotEditable {editable}>
  <!-- Search bar -->
	<div class="max-w-screen-md mx-auto px-6 pt-4 lg:pt-8">
		<div class={classNames(data.searchQuery ? '' : '', 'relative')}>
			{#if !data.searchQuery && !data.searchFilter}
				<div class="pointer-events-none absolute inset-y-0 left-3 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>          
				</div>
			{:else}
				<a href='/' on:click={reset} class="absolute inset-y-0 left-3 flex items-center">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="w-6 h-6"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
						/>
					</svg>
				</a>
			{/if}
			<input
				bind:this={searchInput}
				on:input={onInput}
				value={data.searchQuery}
				autocomplete="off"
				id="search"
				name="search"
				class="block w-full rounded-full border-1 border-black bg-transparent py-2 pl-10 pr-24 placeholder-gray-400 focus:border-black focus:text-black focus:outline-none focus:ring-0"
				placeholder={`Search ${data.posts.length} letters`}
				type="text"
			/>
      {#if currentUser}
        <div class="absolute inset-y-0 right-3 pt-[5px]">
          <select bind:value={searchFilter} id="country" name="country" autocomplete="country-name" class="block w-full rounded-md border-0 py-1.5 text-gray-900 ring-0 ring-inset focus:ring-1 focus:ring-inset focus:ring-black sm:max-w-xs sm:text-sm leading-4" on:change={onInput}>
            <option value="">Show all</option>
            <option value="private">Private</option>
            <option value="public">Public</option>
          </select>
        </div>
      {/if}
		</div>
	</div>

  <div  id="letters">
    {#if data.posts.length === 0}
      <div class="max-w-screen-md mx-auto px-6 pt-4 lg:pt-8">      
        <div class="md:text-xl py-4 text-center">
          {#if currentUser && !data.searchQuery}
            Use the ☰ menu to personalise your profile, then <a class="underline" href={"/letters/new"}>create</a> your first letter 💌
          {:else if (!currentUser)}
            <a class="underline" href={"/login"}>Sign in</a> to start writing.
          {/if}
        </div>
      </div>
    {/if}

    <div class="max-w-screen-md mx-auto px-6">
      <div class="my-6 space-y-8">
        {#each data.posts.slice(0, postLimit) as post, i}
          <PostTeaser {post} {currentUser} />
        {/each}
      </div>
    </div>

    {#if postLimit < data.posts.length}
      <div class="max-w-screen-md mx-auto px-6 pb-6">
        <button
          class="w-full mx-auto block px-4 py-2 rounded-lg border shadow-md bg-white text-center uppercase font-medium"
          on:click={showMoreposts}
        >
          Show more
        </button>
      </div>
    {/if}
  </div>
</NotEditable>

<Footer counter="/" {editable} />
