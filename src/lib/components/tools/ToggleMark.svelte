<script>
  import { toggleMark } from 'prosemirror-commands';
  import { markActive } from '$lib/prosemirrorUtil';
  import { classNames } from '$lib/util';

  export let editorView;
  export let editorState;
  export let type;

  $: schema = editorState.schema;
  $: markType = schema.marks[type];

  $: command = toggleMark(markType);
  $: disabled = !markType || !command(editorState, null);
  $: active = markActive(markType)(editorState);

  function handleClick() {
    command(editorState, editorView.dispatch, editorView);
    editorView.focus();
  }
</script>

<button
  on:click={handleClick}
  {disabled}
  class={classNames(
    active ? 'bg-white text-black' : 'text-white hover:bg-white hover:text-black',
    'sm:mx-1 rounded-full p-2 disabled:opacity-30'
  )}
>
  <slot />
</button>
