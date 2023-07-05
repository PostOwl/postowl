<script>
  import { onMount, onDestroy } from 'svelte';
  import { toHTML, fromHTML } from '$lib/prosemirrorUtil';
  import { singleLineRichTextSchema, multiLineRichTextSchema } from '$lib/prosemirrorSchemas';
  import { activeEditorView } from '$lib/stores';
  import { EditorState, Plugin } from 'prosemirror-state';
  import { EditorView } from 'prosemirror-view';
  import { history } from 'prosemirror-history';
  import { keymap } from 'prosemirror-keymap';
  import { baseKeymap } from 'prosemirror-commands';
  import { buildKeymap } from '$lib/prosemirrorKeymap';
  import { buildInputRules } from '$lib/prosemirrorInputrules';
  import { placeholderPlugin } from '$lib/proseMirrorPlugins';

  export let content = '<p></p>';
  export let multiLine = false;
  export let placeholder = 'Enter text';

  let editorChange = false;
  let prosemirrorNode, editorView, editorState;

  $: schema = multiLine ? multiLineRichTextSchema : singleLineRichTextSchema;
  $: {
    const doc = fromHTML(schema, content);
    editorState = EditorState.create({
      doc,
      schema,
      plugins: [
        buildInputRules(schema),
        keymap(buildKeymap(schema)),
        keymap(baseKeymap),
        history(),
        onUpdatePlugin,
        placeholderPlugin(placeholder)
      ]
    });
    // Only if there is already an editorView and the content change was external
    // update editorView with the new editorState
    if (!editorChange) {
      editorView?.updateState(editorState);
    } else {
      editorChange = false;
    }
  }

  function transformPasted(slice, view) {
    // For now, we just replace pasted external images
    // TODO: Alternatively we could remove all external images from the slice,
    // try to get a file instance, then resize and upload them. But that's abit
    // more involved. Post MVP stuff! :)
    const nodes = slice?.content?.content
    if (nodes) {
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        // Everything that starts with a "/" can be considered an owned asset
        if (node.type?.name === 'image' && !/^\//.test(node.attrs.src)) {
          node.attrs.src = '/images/image-placeholder.png';
        }
      }
    }
    return slice;
  }

  function dispatchTransaction(transaction) {
    const editorState = this.state.apply(transaction);
    this.updateState(editorState);
    if (transaction.docChanged) {
      content = toHTML(editorState);
      // Leave a hint so we know the last content update came
      // from the editor (not the parent)
      editorChange = true;
    }
    this.state = editorState;
  }

  const onUpdatePlugin = new Plugin({
    view() {
      return {
        update(updatedView) {
          activeEditorView.set(updatedView);
        }
      };
    }
  });

  onMount(() => {
    editorView = new EditorView(prosemirrorNode, {
      state: editorState,
      dispatchTransaction,
      transformPasted
    });
    activeEditorView.set(editorView);
  });
  onDestroy(() => {
    // Guard on server side
    if (editorView) {
      editorView.destroy();
    }
  });
</script>

<div id="prosemirror-editor" bind:this={prosemirrorNode} />

<style>
  :global(#prosemirror-editor .ProseMirror) {
    outline: none;
    white-space: pre-wrap;
    word-wrap: break-word;
  }
</style>
