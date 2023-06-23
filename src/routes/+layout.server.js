
import { ORIGIN } from '$env/static/private';

export async function load({ locals }) {
  return {
    currentUser: locals.currentUser,
    bio: locals.bio,
    counts: locals.counts,
    origin: ORIGIN
  };
}
