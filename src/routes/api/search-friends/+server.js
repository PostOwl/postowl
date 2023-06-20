import { searchFriends } from '$lib/api';
import { json } from '@sveltejs/kit';

export async function GET({ url, locals }) {
  const currentUser = locals.currentUser;
  const searchQuery = url.searchParams.get('q') || '';
  return json(await searchFriends(searchQuery, currentUser));
}
