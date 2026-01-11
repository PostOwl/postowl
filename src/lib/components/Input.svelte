<script>
  /**
   * @typedef {Object} Props
   * @property {string} [value]
   * @property {any} id
   * @property {string} [type]
   * @property {any} name
   * @property {boolean} [required]
   * @property {any} [inputRef]
   * @property {string} [placeholder]
   */

  /** @type {Props} */
  let {
    value = $bindable(''),
    id,
    type = 'text',
    name,
    required = false,
    inputRef = $bindable(null),
    placeholder = ''
  } = $props();
  function setType(node) {
    node.type = type;
  }
</script>

<input
  autocomplete="off"
  use:setType
  {placeholder}
  {name}
  {id}
  {required}
  bind:value
  bind:this={inputRef}
  class="border rounded-full focus focus:border-gray-800 focus:ring-gray-800 py-3.5 px-5"
/>
