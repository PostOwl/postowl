<script>
  import Limiter from '$lib/components/Limiter.svelte';
  import PrimaryButton from '$lib/components/PrimaryButton.svelte';
  import Input from '$lib/components/Input.svelte';
  export let form;
  export let data;
  $: bio = data.bio;
</script>

<svelte:head>
  <title>Sign in</title>
  <link rel="icon" type="image/png" sizes="300x300" href={bio.avatar} />
  <link rel="apple-touch-icon" sizes="300x300" href={bio.avatar} />
</svelte:head>

<Limiter>
  {#if form?.incorrect}
    <p class="p-4 bg-red-100 text-red-600 my-4 rounded-md">Password incorrect. Please try again.</p>
  {/if}
  <div class="w-full flex flex-col space-y-4 mt-12 mb-4">
    <form method="POST" class="flex flex-col space-y-8">
      <div class="flex flex-col">
        <label for="password" class="font-semibold mb-2 text-1xl">Enter your password</label>
        <Input type="password" name="password" id="password" />
      </div>
      <PrimaryButton type="submit">Sign in</PrimaryButton>
      <div><a class="underline" href="/">Return to the homepage</a></div>
    </form>
  </div>
</Limiter>
