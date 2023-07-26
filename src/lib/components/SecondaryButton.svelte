<script>
  import BaseButton from '$lib/components/BaseButton.svelte';
  export let disabled = undefined;
  export let type = 'button';
  export let size = undefined;
  export let href = undefined;
</script>

<BaseButton
  {href}
  {type}
  {size}
  {disabled}
  styles="font-medium focus:ring-black border border-black bg-white"
  on:click
>
  <slot />
</BaseButton>
