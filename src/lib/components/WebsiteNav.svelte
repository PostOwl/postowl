<script>
  import { classNames } from '$lib/util';
  import NotEditable from './NotEditable.svelte';
  import PrimaryButton from './PrimaryButton.svelte';
  export let editable = false;
  export let currentUser;
  export let showUserMenu = undefined;
  export let isDark = undefined;

  let showMenu = false;

  function onKeyDown(e) {
    // Turn on editing
    if (e.key === 'e' && e.metaKey) {
      editable = true;
    }
  }
</script>

{#if currentUser}
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
        <a href="/" class="text-sm font-bold uppercase">Michael Aufreiter</a>
        <div class="flex-1" />
        <PrimaryButton size="sm" href="/posts/new">New letter</PrimaryButton>
        {#if currentUser}
          <button
            on:click={() => (showMenu = !showMenu)}
            class="ml-0 px-4"
            title={currentUser.name}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>          
          </button>
        {/if}
      </div>
    </NotEditable>
  </div>
</div>
{/if}

{#if showMenu}
  <div class="bg-white absolute inset-0 z-50">
    <div class="max-w-screen-md mx-auto py-4 px-6 flex flex-col">
      <a class="text-3xl font-bold" href="/">About</a>
      <a class="text-3xl font-bold" href="/">Letters</a>
    </div>
  </div>
{/if}

<svelte:window on:keydown={onKeyDown} />
