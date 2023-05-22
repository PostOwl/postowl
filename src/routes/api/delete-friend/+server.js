import { json } from '@sveltejs/kit';
import { deleteFriend } from '$lib/api';

export async function POST({ request, locals }) {
  const currentUser = locals.user;
  const { friendId } = await request.json();
  const result = await deleteFriend(friendId, currentUser);
  return json(result);
}
