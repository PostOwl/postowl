<script>
  import { classNames } from '$lib/util';
  import { toggleMark } from 'prosemirror-commands';
  import { createLink } from '$lib/prosemirrorCommands';

  let { editorView, editorState, children } = $props();

  let schema = $derived(editorState.schema);
  let disabled = $derived(!createLink(editorState, null, editorView));

  function handleClick() {
    let url = prompt('Enter link URL', 'https://example.com');
    if (url) {
      toggleMark(schema.marks.link, { href: url })(editorState, editorView.dispatch);
      editorView.focus();
    }
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
