<script>
  import { run } from 'svelte/legacy';

  import EditorToolbar from '$lib/components/EditorToolbar.svelte';
  import { fetchJSON, isEmailValid } from '$lib/util';
  import { goto } from '$app/navigation';
  import PlainText from '$lib/components/PlainText.svelte';

  let { data = $bindable() } = $props();
  let editable = $state(false), name = $state(), email = $state();


  function initOrReset() {
    name = data.name;
    email = data.email;
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
      await fetchJSON('POST', '/api/update-friend', {
        friend_id: data.friend_id,
        name,
        email
      });
      goto('/friends');
    } catch (err) {
      console.error(err);
      alert(
        "Could not save. Make sure that the name or email you provided haven't been used already."
      );
    }
  }
  run(() => {
    // HACK: To make sure this is only run when the parent passes in new data
    data = data;
    initOrReset();
  });
  let currentUser = $derived(data.currentUser);
  let bio = $derived(data.bio);
</script>

<svelte:head>
  <title>{name || email}</title>
  <link rel="icon" type="image/png" sizes="300x300" href={bio.avatar} />
  <link rel="apple-touch-icon" sizes="300x300" href={bio.avatar} />
</svelte:head>

{#if editable}
  <EditorToolbar
    oncancel={() => goto('/friends')}
    onsave={saveFriend}
    canConfirm={isEmailValid(email)}
  />
{/if}

<div class="max-w-(--breakpoint-md) mx-auto px-6 pb-8 sm:text-xl">
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
      onclick={deleteFriend}>Delete friend</button
    >
  </div>
</div>
