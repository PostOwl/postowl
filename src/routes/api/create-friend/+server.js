import { json } from '@sveltejs/kit';
import { createFriend } from '$lib/api';

export async function POST({ request, locals }) {
  const currentUser = locals.currentUser;
  const { name, email } = await request.json();
  const { friendId } = await createFriend(name, email, currentUser);
  return json({ friendId });
}
