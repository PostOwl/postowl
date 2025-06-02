<script>
  import { classNames } from '$lib/util';
  /**
   * @typedef {Object} Props
   * @property {import('svelte').Snippet} [children]
   */

  /** @type {Props} */
  let { children } = $props();
</script>

<div class={classNames('pb-8 sm:pb-16')}>
  <div
    class="max-w-(--breakpoint-md) mx-auto px-6 flex flex-col sm:flex-row space-y-6 sm:space-x-8 sm:space-y-0"
  >
    <img
      class="shrink-0 w-24 h-24 rounded-full"
      src="/images/sonja.jpg"
      alt="Michael Aufreiter"
    />
    <div>
      <h2 class="text-2xl md:text-4xl font-medium">{@render children?.()}</h2>
    </div>
  </div>
</div>
