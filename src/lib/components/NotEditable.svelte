<script>
  import { classNames } from '$lib/util';

  let { editable, children } = $props();
</script>

<div class={classNames(editable ? 'opacity-25 cursor-not-allowed relative' : '')}>
  {#if editable}
    <div class="absolute inset-0 z-50"></div>
  {/if}
  {@render children?.()}
</div>
