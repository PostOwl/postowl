import { json } from '@sveltejs/kit';
import { updateFriend } from '$lib/api';

export async function POST({ request, locals }) {
  const currentUser = locals.currentUser;
  const { friend_id, name, email } = await request.json();
  await updateFriend(friend_id, name, email, currentUser);
  return json({ friend_id, status: 'ok' });
}
