import { getCurrentUser, getBio } from '$lib/api';

export async function handle({ event, resolve }) {
  event.locals.currentUser = await getCurrentUser(event.cookies.get('sessionid'));
  event.locals.bio = await getBio();
  const response = await resolve(event);
  return response;
}
