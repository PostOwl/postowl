<script>
  import { classNames } from '$lib/util';
  import { wrapIn } from 'prosemirror-commands';

  export let editorView;
  export let editorState;

  $: schema = editorState.schema;
  $: disabled = !wrapIn(schema.nodes.blockquote)(editorView.state);

  function handleClick() {
    wrapIn(schema.nodes.blockquote)(editorState, editorView.dispatch);
    editorView.focus();
  }
</script>

<button
  on:click={handleClick}
  {disabled}
  class={classNames(
    'text-white hover:bg-white hover:text-black',
    'sm:mx-1 rounded-full p-2 disabled:opacity-30'
  )}
>
  <slot />
</button>
