<script>
  import EditorToolbar from '$lib/components/EditorToolbar.svelte';
  import { fetchJSON, isEmailValid } from '$lib/util';
  import { goto } from '$app/navigation';
  import PlainText from '$lib/components/PlainText.svelte';

  export let data;
  let editable, name, email, created_at, updated_at;

  $: currentUser = data.currentUser;
  $: bio = data.bio;
  $: {
    // HACK: To make sure this is only run when the parent passes in new data
    data = data;
    initOrReset();
  }

  function initOrReset() {
    name = data.name;
    email = data.email;
    created_at = data.created_at;
    updated_at = data.updated_at;
    editable = true;
  }

  async function deleteFriend() {
    if (!currentUser) return alert('Sorry, you are not authorized.');
    if (confirm('Are you sure you want to delete this friend? It cannot be undone.')) {
      try {
        await fetchJSON('POST', '/api/delete-friend', {
          friend_id: data.friend_id
        });
        goto('/friends');
      } catch (err) {
        console.error(err);
        alert('Error deleting friend. Try again.');
      }
    }
  }

  async function saveFriend() {
    if (!currentUser) return alert('Sorry, you are not authorized.');
    try {
      const result = await fetchJSON('POST', '/api/update-friend', {
        friend_id: data.friend_id,
        name,
        email
      });
      updated_at = result.updated_at;
      goto('/friends');
    } catch (err) {
      console.error(err);
      alert(
        "Could not save. Make sure that the name or email you provided haven't been used already."
      );
    }
  }
</script>

<svelte:head>
  <title>{name || email}</title>
  <link rel="icon" type="image/png" sizes="300x300" href={bio.avatar} />
  <link rel="apple-touch-icon" sizes="300x300" href={bio.avatar} />
</svelte:head>

{#if editable}
  <EditorToolbar
    on:cancel={() => goto('/friends')}
    on:save={saveFriend}
    canConfirm={isEmailValid(email)}
  />
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

  <div class="text-center pt-12">
    <button
      class="font-medium text-sm sm:text-base rounded-full w-full py-3 border border-rose-600 text-rose-600"
      on:click={deleteFriend}>Delete friend</button
    >
  </div>
</div>
