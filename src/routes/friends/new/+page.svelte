<script>
  import EditorToolbar from '$lib/components/EditorToolbar.svelte';
  import { fetchJSON, isEmailValid } from '$lib/util';
  import { goto } from '$app/navigation';
  import PlainText from '$lib/components/PlainText.svelte';

  export let data;
  let editable = true,
    name = '',
    email = '';
  $: currentUser = data.currentUser;
  $: bio = data.bio;

  async function createFriend() {
    if (!currentUser) return alert('Sorry, you are not authorized.');
    try {
      await fetchJSON('POST', '/api/create-friend', {
        name,
        email
      });
      goto('/friends');
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
  <link rel="icon" type="image/png" sizes="300x300" href={bio.avatar} />
  <link rel="apple-touch-icon" sizes="300x300" href={bio.avatar} />
</svelte:head>

{#if editable}
  <EditorToolbar on:cancel={() => goto('/friends')} on:save={createFriend} confirmLabel="Create" canConfirm={isEmailValid(email)} />
{/if}

<div class="max-w-screen-md mx-auto px-6 pb-8 sm:text-xl">
  <div class="pt-24 text-sm font-bold">Name</div>

  <div class="border-b py-2">
    <PlainText {editable} bind:content={name} placeholder="Enter name" />
  </div>

  <div class="pt-8 text-sm font-bold">Email</div>
  <div class="border-b py-2">
    <PlainText {editable} bind:content={email} placeholder="Enter email" />
  </div>
</div>
