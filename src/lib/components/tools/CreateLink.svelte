<script>
  import { classNames } from '$lib/util';
  import { createLink } from '$lib/prosemirrorCommands';

  let { editorView, editorState, children } = $props();

  let schema = $derived(editorState.schema);
  let disabled = $derived(!createLink(editorState, null, editorView));

  function getLinkInSelection(state) {
    const { from, to } = state.selection;
    let linkMark = null;
    state.doc.nodesBetween(from, to, node => {
      if (linkMark) return false;
      const mark = node.marks.find(m => m.type === schema.marks.link);
      if (mark) {
        linkMark = mark;
        return false;
      }
    });
    return linkMark;
  }

  function handleClick() {
    const existingLink = getLinkInSelection(editorState);
    const currentUrl = existingLink?.attrs?.href || 'https://example.com';
    let url = prompt('Enter link URL', currentUrl);
    if (url) {
      const { from, to } = editorState.selection;
      const linkMark = schema.marks.link.create({ href: url });

      // Use a single transaction to remove old link and add new one
      let tr = editorState.tr;
      tr = tr.removeMark(from, to, schema.marks.link);
      tr = tr.addMark(from, to, linkMark);

      editorView.dispatch(tr);
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
