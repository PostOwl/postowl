<script>
  import { onMount, onDestroy, untrack } from 'svelte';
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
  import { placeholderPlugin } from '$lib/prosemirrorPlugins';

  /**
   * @typedef {Object} Props
   * @property {string} [content]
   * @property {boolean} [multiLine]
   * @property {string} [placeholder]
   */

  /** @type {Props} */
  let { content = $bindable('<p></p>'), multiLine = false, placeholder = 'Enter text' } = $props();

  let editorChange = $state(false);
  let prosemirrorNode = $state(), editorView = $state(), editorState = $state();


  function transformPasted(slice) {
    // For now, we just replace pasted external images
    // TODO: Alternatively we could remove all external images from the slice,
    // try to get a file instance, then resize and upload them. But that's abit
    // more involved. Post MVP stuff! :)
    const nodes = slice?.content?.content;
    if (nodes) {
      const newNodes = [];
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        // Everything that starts with a "/" can be considered an owned asset
        if (node.type?.name !== 'image' || /^\//.test(node.attrs.src)) {
          newNodes.push(node);
        }
      }
      slice.content.content = newNodes;
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
      transformPasted,
      // Handle focus event to show the toolbar when this rich text editor receives focus
      handleDOMEvents: {
        focus: () => {
          activeEditorView.set(editorView);
          return false; // Don't prevent default handling
        }
      }
    });
    activeEditorView.set(editorView);
  });
  onDestroy(() => {
    // Guard on server side
    if (editorView) {
      editorView.destroy();
    }
  });
  let schema = $derived(multiLine ? multiLineRichTextSchema : singleLineRichTextSchema);
  $effect.pre(() => {
    const doc = fromHTML(schema, content);
    const newEditorState = EditorState.create({
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
    // Use untrack to read editorChange without creating a reactive dependency
    const wasInternalChange = untrack(() => editorChange);
    if (!wasInternalChange) {
      editorView?.updateState(newEditorState);
    }
    untrack(() => {
      editorChange = false;
    });
    editorState = newEditorState;
  });
</script>

<div id="prosemirror-editor" bind:this={prosemirrorNode}></div>

<style>
  :global(#prosemirror-editor .ProseMirror) {
    outline: none;
    white-space: pre-wrap;
    word-wrap: break-word;
  }
</style>
