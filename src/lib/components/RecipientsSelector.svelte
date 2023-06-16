<script>
  import { onMount } from 'svelte';
  import { debounce, classNames, isEmailValid } from '$lib/util';
  import SecondaryButton from '$lib/components/SecondaryButton.svelte';
  
  export let recipients = [];
  export let is_public;
  
  let value;
  let result = [];
  let selectedResult = 0;
  let input;
  let resultsEl;

  onMount(() => {
    input.focus();
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
        result = [
          { email: value },
          ...result
        ];
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
    scrollIntoViewIfNeeded();
  }

  function nextResult() {
    if (selectedResult < result.length - 1) {
      selectedResult += 1;
    }
    scrollIntoViewIfNeeded();
  }

  function scrollIntoViewIfNeeded() {
    // let node = resultsEl.childNodes[selectedResult];
    // if (node.scrollIntoViewIfNeeded) {
    //   node.scrollIntoViewIfNeeded();
    // }
  }

  function removeRecipient(index) {
    recipients.splice(index, 1);
    recipients = recipients;
  }

  function togglePublic() {
    is_public = !is_public;
  }

  // HACK: This is not ideal, may cancel clicks on results when pressed too long
  function onBlur() {
    setTimeout(() => {
      value = ''
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

<div class="max-w-screen-md mx-auto px-6 pt-8">
  <div class="flex items-center">
    <div class="font-bold">To:</div>
    <div class="flex-1"></div>
    {#if !is_public}
      <SecondaryButton size='sm' on:click={togglePublic}>Make public</SecondaryButton>
    {/if}
  </div>
  <div>
    <div class="rounded-md bg-red-50 border border-red-300 inline-block px-2 mr-1 mb-1 text-sm sm:text-base">
      <span>Myself</span>
    </div>
    {#each recipients as recipient, i}
      <div class="rounded-md bg-yellow-50 border border-yellow-400 inline-block px-2 mr-1 mb-1 text-sm sm:text-base">
        <span>{recipient.email}</span>
        <button on:click={() => removeRecipient(i) }>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="inline-block w-4 h-4">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    {/each}
    {#if is_public}
      <div class="rounded-md bg-green-50 border border-green-300 inline-block px-2 mr-1 mb-1 text-sm sm:text-base">
        <span>Everyone</span>
        <button on:click={togglePublic}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="inline-block w-4 h-4">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    {/if}
  </div>

  <div class="relative border-b border-gray-100 flex space-x-4 items-center py-2">
    <input
      bind:this={input}
      bind:value
      use:debounce={{ value, func: search, duration: 50 }}
      on:blur={onBlur}
      autocomplete="off"
      id="search"
      name="search"
      class="block w-full border-none bg-transparent px-0 py-2 placeholder-gray-300 focus:border-black focus:text-gray-900 focus:placeholder-gray-400 focus:outline-none focus:ring-0"
      placeholder="Add recipient ..."
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
</div>

<!-- <svelte:window on:keydown={onKeyDown} /> -->