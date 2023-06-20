<script>
  import EditorToolbar from '$lib/components/EditorToolbar.svelte';
  import { fetchJSON, classNames } from '$lib/util';
  import { goto } from '$app/navigation';
  import PlainText from '$lib/components/PlainText.svelte';

  export let data;
  let editable = true, name = '', email = '';
  $: currentUser = data.currentUser;

  async function createFriend() {
    if (!currentUser) return alert('Sorry, you are not authorized.');
    try {
      const result = await fetchJSON('POST', '/api/create-friend', {
        name,
        email
      });
      goto('/friends')
    } catch (err) {
      console.error(err);
      alert(
        'There was an error. You can try again, but before that, please just copy and paste your article into a safe place.'
      );
    }
  }
</script>

<svelte:head>
  <title>{name}</title>
</svelte:head>

{#if editable}
  <EditorToolbar {currentUser} on:cancel={() => goto('/friends')} on:save={createFriend} confirmLabel='Create'/>
{/if}

<div class="max-w-screen-md mx-auto px-6 pb-8 sm:text-xl">
  <div class="pt-24 text-sm font-bold">Name</div>
  
  <div class="border-b py-2">
    <PlainText {editable} bind:content={name} />
  </div>
  
  <div class="pt-8 text-sm font-bold">Email</div>
  <div class="border-b py-2">
  <PlainText {editable} bind:content={email} />
  </div>
</div>

