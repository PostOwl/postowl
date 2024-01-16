import { fail } from '@sveltejs/kit';
import { destroySession } from '$lib/api';

export async function load({ cookies }) {
  const sessionId = cookies.get('sessionid');
  try {
    await destroySession(sessionId);
    cookies.delete('sessionid', { path: '/' });
  } catch (err) {
    console.error(err);
    return fail(400, { incorrect: true });
  }
}
