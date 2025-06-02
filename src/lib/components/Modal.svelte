<script>
  import { createEventDispatcher, onMount, onDestroy } from 'svelte';
  import { browser } from '$app/environment';
  import { classNames } from '$lib/util';

  /**
   * @typedef {Object} Props
   * @property {string} [position] - Only relevant for mobile
   * @property {import('svelte').Snippet} [children]
   */

  /** @type {Props} */
  let { position = 'bottom', children } = $props();
  let modalEl = $state();

  const dispatch = createEventDispatcher();
  let surface = $state();
  onMount(async () => {
    window.document.children[0].style = 'overflow: hidden;';

    // Move the modal in the DOM to be the last child of <BODY> so that it can be on top of everything
    document.body.appendChild(modalEl);
  });
  onDestroy(() => {
    if (browser) {
      window.document.children[0].style = '';
    }
  });
  function onMouseUp(e) {
    if (e.target === surface) dispatch('close');
  }
</script>

<div
  bind:this={modalEl}
  class="relative z-50"
  aria-labelledby="modal-title"
  role="dialog"
  aria-modal="true"
>
  <div class="fixed inset-0 bg-black bg-opacity-80"></div>

  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div class="fixed inset-0 z-50 overflow-y-auto" onmouseup={onMouseUp}>
    <div
      bind:this={surface}
      class={classNames(
        'flex min-h-full justify-center p-4 text-center sm:items-center sm:p-0',
        position === 'bottom' ? 'items-end' : 'items-start'
      )}
    >
      <div class="relative rounded-lg bg-white text-left shadow-xl sm:my-8 w-full sm:max-w-lg">
        {@render children?.()}
      </div>
    </div>
  </div>
</div>
