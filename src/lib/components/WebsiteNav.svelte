<script>
  import { classNames } from '$lib/util';
  import NotEditable from './NotEditable.svelte';
  import PrimaryButton from './PrimaryButton.svelte';
  export let editable = false;
  export let currentUser;
  export let bio;
  export let isDark = undefined;

  let showMenu = false;

  function onKeyDown(e) {
    // Turn on editing
    if (e.key === 'e' && e.metaKey) {
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
    isDark ? 'bg-black text-white' : 'bg-white bg-opacity-95'
  )}
>
  <div class="max-w-screen-md mx-auto py-4 px-6">
    <NotEditable {editable}>
      <div class="flex items-center relative">
        <a href="/" class="text-sm font-bold uppercase">{bio.name}</a>
        <div class="flex-1" />
        {#if currentUser}
          <PrimaryButton size="sm" href="/posts/new">New letter</PrimaryButton>
        {/if}
        <button
          on:click={() => (showMenu = true)}
          class="ml-0 pl-4"
          title={'Open Menu'}
        >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>          
      </button>
      </div>
    </NotEditable>
  </div>
</div>

{#if showMenu}
  <div class="bg-white fixed inset-0 z-50">

    <div class="max-w-screen-md mx-auto py-4 px-6 flex flex-col space-y-4">
      <div class="text-right mb-8">
        <button on:click={() => showMenu = false}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>          
        </button>
      </div>
      <div class="text-center"><a class="text-3xl font-bold underline" href="/" on:click={toggleMenu}>About</a></div>
      <div class="text-center"><a class="text-3xl font-bold underline" href="/#letters" on:click={toggleMenu}>Letters</a></div>
      {#if currentUser}
        <div class="text-center"><a class="text-3xl font-bold underline" href="/friends" on:click={toggleMenu}>Friends</a></div>
        <div class="pt-14 text-center">
          <div class="pb-2">Logged in as <strong>Admin</strong>.</div>
          <div><a class="text-3xl font-bold underline" href="/logout">Sign out</a></div>
        </div>
      {:else}
        <div class="pt-14 text-center">
          <div class="pb-2"><a class="font-bold underline" href="/login">Sign in</a> as an admin.</div>
        </div>
      {/if}
    </div>
  </div>
{/if}

<svelte:window on:keydown={onKeyDown} />

