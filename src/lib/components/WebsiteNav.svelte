<script>
  import { classNames } from '$lib/util';
  import NotEditable from './NotEditable.svelte';
  export let editable = false;
  export let currentUser;

  export let showUserMenu = undefined;
  export let showSearch = undefined;
  export let isDark = undefined;

  function onKeyDown(e) {
    // Close modals
    if (e.key === 'Escape') {
      showSearch = false;
      showUserMenu = false;
    }
    // Turn on editing
    if (e.key === 'e' && e.metaKey) {
      editable = true;
    }
  }
</script>

<div
  class={classNames(
    'backdrop-blur-sm  z-10 text-sm lg:text-lg',
    !editable ? 'sticky top-0' : '',
    isDark ? 'bg-black text-white' : 'bg-white bg-opacity-95'
  )}
>
  <div class="max-w-screen-md mx-auto py-4 px-6">
    <NotEditable {editable}>
      <div class="flex items-center relative">
        <a class={classNames('mr-6 font-bold')} href="/">
          POSTOWL
        </a>
        <div class="flex-1" />
        <a class="mr-4 font-medium px-2 py-1 rounded-md" href="/">Home</a>
        <a class="mr-4 font-medium px-2 py-1 rounded-md" href="/#contact">Conact</a>
        {#if currentUser}
          <button
            on:click={() => (showUserMenu = !showUserMenu)}
            class="ml-0"
            title={currentUser.name}
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
        {/if}
      </div>
    </NotEditable>
  </div>
</div>

<svelte:window on:keydown={onKeyDown} />
