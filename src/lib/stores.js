import { writable, readable } from 'svelte/store';
import { navigating } from '$app/stores';

export const activeEditorView = writable(null);
export const showAllProjects = writable(false);
export const showAllArticles = writable(false);

export const previousPage = readable(null, set => {
  const unsubscribe = navigating.subscribe($navigating => {
    // Check if `$navigating` has a value
    // because it's set to `null` after navigation is done
    if ($navigating) {
      set($navigating.from.url.pathname);
    }
  });
  return () => unsubscribe();
});
