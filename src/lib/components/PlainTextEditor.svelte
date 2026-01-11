<script>
  import { onMount, onDestroy, untrack } from 'svelte';
  import { toHTML, fromHTML } from '$lib/prosemirrorUtil';
  import { singleLinePlainTextSchema, multiLinePlainTextSchema } from '$lib/prosemirrorSchemas';
  import { activeEditorView } from '$lib/stores';
  import { EditorState, Plugin } from 'prosemirror-state';
  import { EditorView } from 'prosemirror-view';
  import { history } from 'prosemirror-history';
  import { keymap } from 'prosemirror-keymap';
  import { baseKeymap } from 'prosemirror-commands';
  import { buildKeymap } from '$lib/prosemirrorKeymap';
  import { placeholderPlugin } from '$lib/prosemirrorPlugins';

  /**
   * @typedef {Object} Props
   * @property {string} [content]
   * @property {boolean} [multiLine]
   * @property {string} [placeholder]
   */

  /** @type {Props} */
  let { content = $bindable(''), multiLine = false, placeholder = 'Enter text' } = $props();

  let editorChange = $state(false);
  let prosemirrorNode = $state(), editorView = $state(), editorState = $state();



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

  // Plugin to clear the active editor view when this plain text editor receives focus
  // This disables the rich text toolbar controls when editing plain text fields
  const onFocusPlugin = new Plugin({
    view() {
      return {
        update(updatedView) {
          if (updatedView.hasFocus()) {
            activeEditorView.set(null);
          }
        }
      };
    }
  });

  onMount(() => {
    editorView = new EditorView(prosemirrorNode, {
      state: editorState,
      dispatchTransaction,
      // Handle focus event to clear the rich text toolbar when this plain text editor receives focus
      handleDOMEvents: {
        focus: () => {
          activeEditorView.set(null);
          return false; // Don't prevent default handling
        }
      }
    });
  });

  onDestroy(() => {
    // Guard on server side
    if (editorView) {
      editorView.destroy();
    }
  });
  let schema = $derived(multiLine ? multiLinePlainTextSchema : singleLinePlainTextSchema);
  $effect.pre(() => {
    const doc = fromHTML(schema, content);
    const newEditorState = EditorState.create({
      doc,
      schema,
      plugins: [
        keymap(buildKeymap(schema)),
        keymap(baseKeymap),
        history(),
        onFocusPlugin,
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
