<script>
  import { classNames, toDateString } from '$lib/util';

  /**
   * @typedef {Object} Props
   * @property {any} [value]
   * @property {string} [class]
   */

  /** @type {Props} */
  let { value = $bindable(undefined), class: className = '' } = $props();

  let dateInput = $state();

  function onDateChange() {
    value = dateInput.value;
  }
</script>

<!-- <img on:mousedown={() => fileInput.click()} class={className + ' cursor-pointer'} {src} {alt} /> -->
<!--   class="w-px h-px opacity-0 fixed -top-40" -->

<!-- {value} -->
<input
  class={classNames('text-black', className)}
  type="date"
  accept="image/*"
  name="imagefile"
  bind:this={dateInput}
  value={toDateString(value)}
  onchange={onDateChange}
/>
