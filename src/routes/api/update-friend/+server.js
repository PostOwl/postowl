import { json } from '@sveltejs/kit';
import { updateFriend } from '$lib/api';

export async function POST({ request, locals }) {
  const currentUser = locals.currentUser;
  const { friendId, name, email } = await request.json();
  await updateFriend(friendId, name, email, currentUser);
  return json({ friendId, status: 'ok' });
}
