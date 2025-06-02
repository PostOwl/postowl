<script>
  import { classNames } from '$lib/util';
  import { setBlockType } from 'prosemirror-commands';
  import { blockTypeActive } from '../../prosemirrorUtil';

  let { editorView, editorState, children } = $props();

  let schema = $derived(editorState.schema);
  let disabled = $derived(
    !setBlockType(schema.nodes.heading)(editorState) &&
      !setBlockType(schema.nodes.paragraph)(editorState)
  );
  let active = $derived(blockTypeActive(schema.nodes.heading, { level: 1 })(editorState));

  function handleClick() {
    if (active) {
      setBlockType(schema.nodes.paragraph)(editorState, editorView.dispatch);
    } else {
      setBlockType(schema.nodes.heading, { level: 1 })(editorState, editorView.dispatch);
    }
    editorView.focus();
  }
</script>

<button
  onclick={handleClick}
  {disabled}
  class={classNames(
    active ? 'bg-white text-black' : 'text-white hover:bg-white hover:text-black',
    'sm:mx-1 rounded-full p-2 disabled:opacity-30'
  )}
>
  {@render children?.()}
</button>
