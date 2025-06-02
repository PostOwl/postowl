<script>
  import { classNames } from '$lib/util';
  /**
   * @typedef {Object} Props
   * @property {boolean} [noPadding]
   * @property {import('svelte').Snippet} [children]
   */

  /** @type {Props} */
  let { noPadding = false, children } = $props();
</script>

<div class={classNames('max-w-lg mx-auto', noPadding ? '' : 'px-4')}>
  {@render children?.()}
</div>
