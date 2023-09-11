import { getCurrentUser, getBio, getCounts } from '$lib/api';

export async function handle({ event, resolve }) {
  // ATTENTION: Never expose anything to event.locals that shouldn't be seen by the client
  // We mix in ...local to data objects on server routes
  event.locals.currentUser = await getCurrentUser(event.cookies.get('sessionid'));
  event.locals.bio = await getBio();
  event.locals.counts = await getCounts();
  event.locals.origin = event.url.origin;

  const response = await resolve(event);
  return response;
}
