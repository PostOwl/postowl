export async function load({ locals }) {
  return {
    currentUser: locals.currentUser,
    bio: locals.bio,
    counts: locals.counts
  };
}
