<script>
  import { classNames } from '$lib/util';
  import { wrapInList } from 'prosemirror-schema-list';

  let { editorView, editorState, children } = $props();

  let schema = $derived(editorState.schema);
  let disabled = $derived(!wrapInList(schema.nodes.bullet_list)(editorState));

  function handleClick() {
    wrapInList(schema.nodes.bullet_list)(editorState, editorView.dispatch);
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
