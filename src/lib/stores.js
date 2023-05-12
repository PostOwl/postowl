import { writable } from 'svelte/store';

export const activeEditorView = writable(null);

export const showAllProjects = writable(false);
export const showAllArticles = writable(false);
