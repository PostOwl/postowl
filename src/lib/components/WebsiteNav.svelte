<script>
  import { page } from '$app/stores';
  import { classNames } from '$lib/util';
  import NotEditable from './NotEditable.svelte';
  import PrimaryButton from './PrimaryButton.svelte';
  export let editable = false;

  // Explicitly set by home page, so we get live updates
  export let bio = undefined;

  let showMenu = false;
  $: data = $page.data;
  $: currentUser = data.currentUser;
  $: latestBio = bio || data.bio;

  function onKeyDown(e) {
    // Turn on editing
    if (e.key === 'e' && (e.metaKey || e.ctrlKey)) {
      editable = true;
    }
  }

  function toggleMenu() {
    showMenu = !showMenu;
  }
</script>

<div
  class={classNames(
    'backdrop-blur-sm  z-10 text-sm lg:text-lg border-b',
    !editable ? 'sticky top-0' : '',
    'bg-white bg-opacity-95'
  )}
>

  <div class="max-w-screen-md mx-auto py-4 px-6">
    <NotEditable {editable}>
      <div class="flex items-center relative">
        <a href="/" class="text-sm font-bold uppercase">
          {latestBio.name}
        </a>
        <div class="flex-1" />
        {#if currentUser}
          <PrimaryButton size="sm" href="/letters/new">New letter</PrimaryButton>
        {/if}
        <button on:click={() => (showMenu = true)} class="ml-0 pl-4" title={'Open Menu'}>
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
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
        </button>
      </div>
    </NotEditable>
  </div>
</div>

{#if showMenu}
  <div class="bg-black text-white fixed inset-0 z-50">
    <div class="max-w-screen-md mx-auto py-4 px-6 flex flex-col space-y-4">
      <div class="text-right mb-8">
        <button on:click={() => (showMenu = false)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div class="text-center">
        <a class="text-3xl font-bold underline" href="/" on:click={toggleMenu}>About</a>
      </div>
      <div class="text-center">
        <a class="inline-flex space-x-2 items-center" href="/#letters" on:click={toggleMenu}>
          <span class="font-bold text-3xl underline">Letters</span>
          {#if currentUser}
            <div class="bg-gray-800 rounded-full w-6 h-6 text-gray-400">{$page.data.counts.post_count}</div>
          {/if}
        </a>
      </div>
      {#if currentUser}
        <div class="text-center">
          <a class="inline-flex space-x-2 items-center" href="/friends" on:click={toggleMenu}>
            <span class="font-bold text-3xl underline">Friends</span>
            {#if currentUser}
              <div class="bg-gray-800 rounded-full w-6 h-6 text-gray-400">{$page.data.counts.friend_count}</div>
            {/if}
          </a>
        </div>
        <div class="pt-14 text-center">
          <div class="pb-2">Logged in as <strong>{currentUser.name}</strong>.</div>
          <div><a class="text-3xl font-bold underline" href="/logout">Sign out</a></div>
        </div>
      {:else}
        <div class="pt-14 text-center">
          <div class="pb-2">
            <a class="font-bold underline" href="/login">Sign in</a> as an admin.
          </div>
        </div>
      {/if}
    </div>
  </div>
{/if}

<svelte:window on:keydown={onKeyDown} />
