<script>
  import { page } from '$app/stores';
  import { classNames } from '$lib/util';
  import NotEditable from './NotEditable.svelte';
  import Modal from './Modal.svelte';
  import PrimaryButton from './PrimaryButton.svelte';
  import SecondaryButton from './SecondaryButton.svelte';
  export let editable = false;

  // Explicitly set by home page, so we get live updates
  export let bio = undefined;
  export let showMenu = false;
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
    'backdrop-blur-sm z-10 text-sm lg:text-lg border-b',
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


{#if showMenu && !editable}
  <Modal on:close={() => (showMenu = false)}>
    <div class="p-8 flex flex-col space-y-4 relative">
      <button class="absolute right-8 top-8" on:click={() => (showMenu = false)}>
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

      <slot />
      
      <div class="md:text-lg">Navigate to...</div>
      <div>
        <a class="inline-flex space-x-2 items-center" href="/" on:click={toggleMenu}>
          <span class="font-bold text-3xl underline">Letters</span>
          {#if currentUser}
            <div class="bg-gray-200 rounded-full w-6 h-6 text-gray-400 text-center">{$page.data.counts.post_count}</div>
          {/if}
        </a>
      </div>


      {#if currentUser}
        <div>
          <a class="inline-flex space-x-2 items-center" href="/friends" on:click={toggleMenu}>
            <span class="font-bold text-3xl underline">Friends</span>
            {#if currentUser}
              <div class="bg-gray-200 rounded-full w-6 h-6 text-gray-400 text-center">{$page.data.counts.friend_count}</div>
            {/if}
          </a>
        </div>
        <div class="md:text-lg pt-8">Got something to share?</div>

        <div class="space-y-4 flex flex-col">
          <PrimaryButton size="sm" href="/letters/new">New letter</PrimaryButton>
        </div>

        <div class="pt-8">
          <div class="pb-2 ">Logged in as <strong>{currentUser.name}</strong>.</div>

          <div data-sveltekit-preload-data="false" class="space-y-4 flex flex-col pt-4">
            <SecondaryButton size="sm" href="/logout">Sign out</SecondaryButton>
          </div>

        </div>
      {:else}
        <div class="pt-8">
          <div class="md:text-lg">If this is your PostOwl...</div>

          <div class="space-y-4 flex flex-col pt-4">
            <PrimaryButton size="sm" href="/login">Sign in</PrimaryButton>
          </div>
        </div>
      {/if}
    </div>
  </Modal>
{/if}

<svelte:window on:keydown={onKeyDown} />
