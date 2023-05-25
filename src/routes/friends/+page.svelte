<script>
  import WebsiteNav from '$lib/components/WebsiteNav.svelte';
  import FriendTeaser from '$lib/components/FriendTeaser.svelte';
  import PrimaryButton from '$lib/components/PrimaryButton.svelte';

  export let data;
  $: currentUser = data.currentUser;
  $: bio = data.bio;
</script>

<svelte:head>
  <title>Friends</title>
</svelte:head>

<WebsiteNav {currentUser} {bio} />

<div class="max-w-screen-md mx-auto px-6 pb-8">
  <h1 class="text-center font-bold text-2xl sm:text-4xl pt-14">{data.friends.length} Friends</h1>
  <p class="text-center sm:text-xl pb-4">Assign nicknames to your contacts, and keep the data up to date.</p>
  <div class="flex justify-center pb-14"><PrimaryButton size='sm' href="/friends/new">Add friend</PrimaryButton></div>
  <div class="space-y-4">
    {#each data.friends as friend, i}
      <FriendTeaser {friend} />
    {/each}
  </div>
</div>
