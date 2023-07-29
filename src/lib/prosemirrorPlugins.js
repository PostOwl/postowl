import { Plugin } from 'prosemirror-state';

export function placeholderPlugin(text) {
  const update = view => {
    if (view.state.doc.textContent || view.state.doc.firstChild?.content.size > 0) {
      view.dom.removeAttribute('data-placeholder');
    } else {
      view.dom.setAttribute('data-placeholder', text);
    }
  };

  return new Plugin({
    view(view) {
      update(view);

      return { update };
    }
  });
}
