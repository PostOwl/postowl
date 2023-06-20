import { getCurrentUser } from '$lib/api';

export async function handle({ event, resolve }) {
  event.locals.currentUser = await getCurrentUser(event.cookies.get('sessionid'));
  const response = await resolve(event);
  return response;
}
