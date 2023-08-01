<script>
  import { page } from '$app/stores';
  import { classNames } from '$lib/util';
  import { goto } from '$app/navigation';
  import NotEditable from './NotEditable.svelte';
  import PrimaryButton from './PrimaryButton.svelte';
  import Modal from './Modal.svelte';
  import Input from './Input.svelte';
  import SecondaryButton from './SecondaryButton.svelte';
  import { previousPage } from '$lib/stores';
  export let editable = false;

  // Explicitly set by home page, so we get live updates
  export let bio = undefined;
  export let showMenu = false;
  export let backButton = false;
  $: data = $page.data;
  $: currentUser = data.currentUser;
  $: latestBio = bio || data.bio;

  function onKeyDown(e) {
    // Deactivate menu modal with esc key
    if (e.key === 'Escape' && showMenu) {
      return toggleMenu();
    }

    // If focus is inside an input or Textrea don't handle
    const activeEl = document.activeElement?.tagName;
    if (activeEl === 'INPUT' || activeEl === 'TEXTAREA') {
      return;
    }

    // Activate editing with e key
    if (e.key === 'e' && editable != true && !e.key.metaKey && !e.key.ctrlKey && currentUser) {
      editable = true;
      return;
    }
    // Toggle menu modal with m key
    if (e.key === 'm' && editable != true && !e.key.metaKey && !e.key.ctrlKey) {
      return toggleMenu();
    }
    // Go to home with h key
    if (e.key === 'h' && editable != true && !e.key.metaKey && !e.key.ctrlKey) {
      return goto('/');
    }
    // Go to new letter with n key
    if (e.key === 'n' && editable != true && !e.key.metaKey && !e.key.ctrlKey && currentUser) {
      return goto('/letters/new');
    }

    // Go to friends list with f key
    if (e.key === 'f' && editable != true && !e.key.metaKey && !e.key.ctrlKey && currentUser) {
      return goto('/friends');
    }
  }

  function toggleMenu() {
    showMenu = !showMenu;
  }

  function goBack(e) {
    if ($previousPage === '/' && backButton) {
      window.history.back();
      e.preventDefault();
      e.stopPropagation();
    } else {
      // Default click behavior
    }
  }
</script>

<div
  class={classNames(
    'backdrop-blur-sm z-10 text-sm lg:text-lg',
    !editable ? 'sticky top-0' : '',
    'bg-white bg-opacity-95'
  )}
>
  <div class="max-w-screen-md mx-auto py-4 px-6">
    <NotEditable {editable}>
      <div class="flex items-center relative space-x-4">
        <a href="/" on:click={goBack} class="text-sm font-bold uppercase">
          {backButton ? '← ' : ''}
          {latestBio.name}
        </a>
        <div class="flex-1" />
        {#if currentUser}
          <PrimaryButton size="sm" href="/letters/new">New letter</PrimaryButton>
        {/if}
        <button
          on:click={() => (showMenu = true)}
          class="w-[26px] h-[26px] border border-black rounded-full"
          title={'Open Menu'}
        >
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
              d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
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
      <button
        class="absolute right-6 sm:-right-4 -top-4 bg-black text-white rounded-full"
        on:click={() => (showMenu = false)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-8 h-8"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {#if currentUser}
        <slot />

        <div class="space-y-4 flex flex-col pt-8">
          <PrimaryButton size="sm" href="/letters/new">New letter</PrimaryButton>
        </div>

        <div class="space-y-4 flex flex-col">
          {#if $page.url?.pathname !== '/friends'}
            <SecondaryButton size="sm" href="/friends">Manage friends</SecondaryButton>
          {/if}
        </div>
      {/if}

      {#if currentUser}
        <div class="pt-8 flex">
          <div>Signed in as {currentUser.name}</div>
          <div class="flex-1" />
          <div>
            <a
              data-sveltekit-preload-data="off"
              class="underline"
              href="/logout"
              on:click={toggleMenu}>Sign out</a
            >
          </div>
        </div>
      {:else}
        <div class="">
          <form method="POST" action="/login" class="flex flex-col space-y-8">
            <div class="flex flex-col">
              <label for="password" class="font-semibold mb-6 text-3xl">Sign in</label>
              <Input
                type="password"
                name="password"
                id="password"
                placeholder="Enter your password"
              />
            </div>
            <PrimaryButton type="submit">Sign in</PrimaryButton>
            <div class="pt-8 text-sm sm:text-base">
              Only the owner can sign in. But you can run <a class="underline" href="https://postowl.com">PostOwl</a> yourself.
            </div>
          </form>
        </div>
      {/if}
    </div>
  </Modal>
{/if}

<svelte:window on:keydown={onKeyDown} />
