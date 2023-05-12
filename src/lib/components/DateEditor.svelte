<script>
  import { classNames, toDateString } from '$lib/util';

  export let value = undefined;
  let className = '';
  export { className as class };

  let dateInput;

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
  on:change={onDateChange}
/>
