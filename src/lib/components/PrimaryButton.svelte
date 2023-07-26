<script>
  import BaseButton from '$lib/components/BaseButton.svelte';
  export let disabled = undefined;
  export let type = 'button';
  export let size = undefined;
  export let href = undefined;
</script>

<BaseButton
  {type}
  {size}
  {disabled}
  {href}
  styles="font-medium bg-blue-500 shadow shadow-blue-500/50 hover:bg-blue-600 hover:shadow-none focus:ring-black border-2 border-transparent text-white"
  on:click
>
  <slot />
</BaseButton>
