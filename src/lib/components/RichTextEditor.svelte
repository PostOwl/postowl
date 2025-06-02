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
  let prosemirrorNode = $state(),
    editorView = $state(),
    editorState = $state();
  let lastContent = $state('<p></p>');
  let isInitialized = $state(false);

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
    if (editorState && prosemirrorNode) {
      editorView = new EditorView(prosemirrorNode, {
        state: editorState,
        dispatchTransaction,
        transformPasted
      });
      activeEditorView.set(editorView);
      isInitialized = true;
    }
  });
  onDestroy(() => {
    // Guard on server side
    if (editorView) {
      editorView.destroy();
    }
  });
  let schema = $derived(multiLine ? multiLineRichTextSchema : singleLineRichTextSchema);

  // Create initial editor state
  $effect(() => {
    if (!schema || !content) return;

    try {
      const doc = fromHTML(schema, content || '<p></p>');
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
      editorState = newEditorState;
      lastContent = content;

      // If we have the DOM node but haven't initialized the view yet
      if (prosemirrorNode && !editorView) {
        editorView = new EditorView(prosemirrorNode, {
          state: editorState,
          dispatchTransaction,
          transformPasted
        });
        activeEditorView.set(editorView);
        isInitialized = true;
      }
    } catch (error) {
      console.error('Failed to create editor state:', error);
    }
  });

  // Update editor view when content changes externally
  $effect(() => {
    if (!schema || !isInitialized) return;

    if (editorView && content !== lastContent && !editorChange) {
      try {
        const doc = fromHTML(schema, content || '<p></p>');
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
        editorView.updateState(newEditorState);
        lastContent = content;
      } catch (error) {
        console.error('Failed to update editor state:', error);
      }
    }
    if (editorChange) {
      editorChange = false;
      lastContent = content;
    }
  });
</script>

<div id="prosemirror-editor" bind:this={prosemirrorNode}></div>

<style>
  @reference "../../app.css";
  :global(#prosemirror-editor .ProseMirror) {
    outline: none;
    white-space: pre-wrap;
    word-wrap: break-word;
  }
</style>
