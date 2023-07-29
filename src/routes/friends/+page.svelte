<script>
  import { invalidateAll } from '$app/navigation';
  import { onMount } from 'svelte';
  import WebsiteNav from '$lib/components/WebsiteNav.svelte';
  import FriendTeaser from '$lib/components/FriendTeaser.svelte';
  import PrimaryButton from '$lib/components/PrimaryButton.svelte';

  export let data;
  $: bio = data.bio;

  onMount(() => {
    invalidateAll();
  });
</script>

<svelte:head>
  <title>Friends</title>
  <link rel="icon" type="image/png" sizes="300x300" href={bio.avatar} />
  <link rel="apple-touch-icon" sizes="300x300" href={bio.avatar} />
</svelte:head>

<WebsiteNav backButton={true} />

<div class="max-w-screen-md mx-auto px-6 pb-8">
  <h1 class="text-center font-bold text-2xl sm:text-4xl pt-14">{data.friends.length} Friends</h1>
  <p class="text-center sm:text-xl pb-4">
    Contact names auto-complete when you share letters.
  </p>
  <div class="flex justify-center pb-14">
    <PrimaryButton size="sm" href="/friends/new">Add friend</PrimaryButton>
  </div>
  <div class="space-y-4">
    {#each data.friends as friend, i}
      <FriendTeaser {friend} />
    {/each}
  </div>
</div>
