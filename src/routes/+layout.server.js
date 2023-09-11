export async function load({ locals, url }) {

  return {
    currentUser: locals.currentUser,
    bio: locals.bio,
    counts: locals.counts,
    origin: url.origin
  };
}
