import { json } from '@sveltejs/kit';
import { deleteFriend } from '$lib/api';

export async function POST({ request, locals }) {
  const currentUser = locals.user;
  const { friend_id } = await request.json();
  const result = await deleteFriend(friend_id, currentUser);
  return json(result);
}
