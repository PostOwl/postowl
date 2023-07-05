<script>
  import { onMount } from 'svelte';
  import { debounce, classNames, isEmailValid } from '$lib/util';
  import SecondaryButton from '$lib/components/SecondaryButton.svelte';
  import CopyableRecipient from './CopyableRecipient.svelte';

  export let recipients = [];
  export let is_public;
  export let editable;
  export let slug = undefined;

  let value;
  let result = [];
  let chooseVisibility = false;
  let selectedResult = 0;
  let input;
  let resultsEl;

  onMount(() => {
    if (input) {
      input.focus();
    }
  });

  async function search() {
    if (value) {
      const response = await fetch(`/api/search-friends?q=${value}`);
      result = await response.json();
    } else {
      result = [];
    }

    // TODO: remove entries that are already in the recipient list

    if (isEmailValid(value)) {
      // Double check that the email is not already in your contacts
      const isInResult = Boolean(result.find(f => f.email === value));
      if (!isInResult) {
        result = [{ email: value }, ...result];
      }
    }
    selectedResult = 0;
  }

  function navigate() {
    const currentResult = result[selectedResult];
    if (currentResult) {
      addRecipient(currentResult);
    }
  }

  function addRecipient(recipient) {
    recipients = recipients.concat([recipient]);
    value = '';
  }

  function prevResult() {
    if (selectedResult > 0) {
      selectedResult -= 1;
    }
  }

  function nextResult() {
    if (selectedResult < result.length - 1) {
      selectedResult += 1;
    }
  }

  function removeRecipient(index) {
    recipients.splice(index, 1);
    recipients = recipients;
  }

  function togglePublic() {
    is_public = true;
    chooseVisibility = false;
  }

  function togglePrivate() {
    is_public = false;
    chooseVisibility = false;
  }

  function toggleVisibilitySelector() {
    if (!editable) return; // Ignore when not editing
    chooseVisibility = !chooseVisibility;
  }

  // HACK: This is not ideal, may cancel clicks on results when pressed too long
  function onBlur() {
    setTimeout(() => {
      value = '';
    }, 200);
  }

  function onKeyDown(e) {
    switch (e.keyCode) {
      case 38: // up
        prevResult();
        e.preventDefault();
        break;
      case 40: // down
        nextResult();
        e.preventDefault();
        break;
      case 13:
        navigate();
        break;
    }
  }
</script>

<div class="max-w-screen-md mx-auto px-6 pb-8 relative">
    <div class="font-bold inline">To:</div>

    <svelte:element this={editable ? "button" : "div"}
      on:click={toggleVisibilitySelector}
      class={classNames(
        "relative rounded-full px-3 py-0.5 mr-1 mb-1 text-sm sm:text-base inline-flex items-center space-x-1",
        is_public ? "bg-green-100 text-green-800" : "bg-rose-100 text-rose-800",
        chooseVisibility ? "z-50" :"" // pop to the top while editing visibility
      )}
    >
      <span>{is_public ? "Everyone" : "Myself"}</span>
      {#if editable}
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-3 h-3 inline-block">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      {/if}
    </svelte:element>

    {#if chooseVisibility}
      <button class="z-40 fixed inset-0 bg-black opacity-80 cursor-default" on:click={toggleVisibilitySelector}></button>
      <div class="absolute top-10 left-6 right-6 sm:left-12 sm:right-12 z-50">
        <div class="max-w-lg space-y-2 text-sm sm:text-base">
          <button
            on:click={togglePrivate}
            class={classNames(
              "block px-4 py-2 rounded-full text-rose-800 mx-0 w-full text-left",
              "bg-rose-50 hover:bg-rose-100"
            )}
          >
            Myself — Private letters and drafts
          </button>
          <button
          on:click={togglePublic}
            class={classNames(
              "block px-4 py-2 rounded-full bg-green-100 text-green-800 mx-0 w-full text-left",
              "bg-green-50 hover:bg-green-100"
            )}
          >
            Everyone — Public blog
          </button>
        </div>
      </div>
    {/if}


    {#each recipients as recipient, i}
      <CopyableRecipient {recipient} {editable} {slug} on:delete={() => removeRecipient(i)} />
    {/each}

  {#if editable}
    <div class="relative border-gray-100 flex space-x-4 items-center py-2">
      <input
        bind:this={input}
        on:keydown={onKeyDown}
        bind:value
        use:debounce={{ value, func: search, duration: 50 }}
        on:blur={onBlur}
        autocomplete="off"
        id="search"
        name="search"
        class="block w-full border-none bg-transparent px-0 py-2 placeholder-gray-300 focus:border-black focus:text-gray-900 focus:placeholder-gray-400 focus:outline-none focus:ring-0"
        placeholder="Enter email to add recipient."
        type="text"
      />
    </div>

    <div class="overflow-y-auto" bind:this={resultsEl}>
      {#each result as friend, i}
        <button
          on:click={() => addRecipient(friend)}
          class={classNames(
            'w-full text-left block px-4 sm:px-6 py-3 border-b border-gray-100 text-gray-600 hover:text-black',
            selectedResult === i ? 'bg-gray-100' : ''
          )}
        >
          {#if friend.name}
            {friend.name} ({friend.email})
          {:else}
            {friend.email}
          {/if}
        </button>
      {/each}
    </div>
  {/if}
</div>
