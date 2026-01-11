import { markApplies, canInsert } from '$lib/prosemirrorUtil';

export function createLink(state /*, dispatch, cb*/) {
  const schema = state.schema;
  const markType = schema.marks.link;
  if (!markType) return false;
  const { $cursor, ranges } = state.selection;
  const allowed = markApplies(state.doc, ranges, markType);
  // Disable if either the cursor is collapsed or the mark does not apply
  // Allow when a link already exists (for editing)
  if ($cursor || !allowed) return false;
  return true;
}

export function insertImage(state /*, dispatch, editorView, src*/) {
  const nodeType = state.schema.nodes.image;
  if (!nodeType) return false;
  if (!canInsert(state, nodeType)) return false;
  return true;
}

export function insertVideo(state /*, dispatch, editorView, src*/) {
  const nodeType = state.schema.nodes.video;
  if (!nodeType) return false;
  if (!canInsert(state, nodeType)) return false;
  return true;
}
