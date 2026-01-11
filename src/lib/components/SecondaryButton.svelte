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
  {href}
  {type}
  {size}
  {disabled}
  {onclick}
  styles="font-medium focus:ring-gray-200 border border-gray-200 bg-white"
>
  {@render children?.()}
</BaseButton>
