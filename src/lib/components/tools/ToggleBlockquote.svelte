<script>
  import { classNames } from '$lib/util';
  import { wrapIn } from 'prosemirror-commands';

  let { editorView, editorState, children } = $props();

  let schema = $derived(editorState.schema);
  let disabled = $derived(!wrapIn(schema.nodes.blockquote)(editorState));

  function handleClick() {
    wrapIn(schema.nodes.blockquote)(editorState, editorView.dispatch);
    editorView.focus();
  }
</script>

<button
  onclick={handleClick}
  {disabled}
  class={classNames(
    'text-white hover:bg-white hover:text-black',
    'sm:mx-1 rounded-full p-2 disabled:opacity-30'
  )}
>
  {@render children?.()}
</button>
