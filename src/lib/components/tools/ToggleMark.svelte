<script>
  import { toggleMark } from 'prosemirror-commands';
  import { markActive } from '$lib/prosemirrorUtil';
  import { classNames } from '$lib/util';

  let { editorView, editorState, type, children } = $props();

  let schema = $derived(editorState.schema);
  let markType = $derived(schema.marks[type]);

  let command = $derived(toggleMark(markType));
  let disabled = $derived(!markType || !command(editorState, null));
  let active = $derived(markActive(markType)(editorState));

  function handleClick() {
    command(editorState, editorView.dispatch, editorView);
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
