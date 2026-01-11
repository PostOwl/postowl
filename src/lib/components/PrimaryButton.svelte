<script>
  import BaseButton from '$lib/components/BaseButton.svelte';
  /**
   * @typedef {Object} Props
   * @property {any} [disabled]
   * @property {string} [type]
   * @property {any} [size]
   * @property {any} [href]
   * @property {Function} [onclick]
   * @property {import('svelte').Snippet} [children]
   */

  /** @type {Props} */
  let {
    disabled = undefined,
    type = 'button',
    size = undefined,
    href = undefined,
    onclick = undefined,
    children
  } = $props();
</script>

<BaseButton
  {type}
  {size}
  {disabled}
  {href}
  {onclick}
  styles="font-medium bg-black focus:ring-black border-2 border-transparent text-white"
>
  {@render children?.()}
</BaseButton>
