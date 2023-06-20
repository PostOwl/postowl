<script>
  import Limiter from '$lib/components/Limiter.svelte';
  export let form;
  export let data;
  $: bio = data.bio;
</script>


<svelte:head>
  <title>Logged out</title>
  <link rel="icon" type="image/png" sizes="300x300" href={bio.avatar} />
  <link rel="apple-touch-icon" sizes="300x300" href={bio.avatar} />
</svelte:head>

<Limiter>
  <div class="pt-20">
    {#if form?.incorrect}
      <p class="p-4 bg-red-100 text-red-600 my-4 rounded-md">Error while signing out.</p>
    {:else}
      Successfully logged out. <a class="underline" href="/">Continue</a>.
    {/if}
  </div>
</Limiter>
