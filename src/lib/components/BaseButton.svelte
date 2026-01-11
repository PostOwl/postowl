<script>
  import { classNames } from '$lib/util';
  /**
   * @typedef {Object} Props
   * @property {any} styles
   * @property {string} [size]
   * @property {string} [type]
   * @property {any} [href]
   * @property {boolean} [disabled]
   * @property {Function} [onclick]
   * @property {import('svelte').Snippet} [children]
   */

  /** @type {Props} */
  let {
    styles,
    size = 'default',
    type = 'button',
    href = undefined,
    disabled = false,
    onclick = undefined,
    children
  } = $props();
  const STYLE_SHARED =
    'm-0 p-0 disabled:cursor-not-allowed disabled:opacity-50 rounded-full cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-offset-2 font-sans no-underline text-center';
  const STYLE_SIZES = {
    sm: `px-4 py-2 text-sm sm:text-base sm:px-4 sm:py-1`,
    default: `px-4 py-2 text-base sm:text-lg sm:px-5 sm:py-3`,
    lg: `px-8 sm:px-12 py-3 text-base sm:py-4 sm:text-xl`
  };
  let className = $derived(classNames(styles, STYLE_SHARED, STYLE_SIZES[size], disabled ? 'disabled' : ''));
</script>

{#if href}
  <a {href} class={className}>
    {@render children?.()}
  </a>
{:else}
  <button {type} class={className} {disabled} {onclick}>
    {@render children?.()}
  </button>
{/if}
