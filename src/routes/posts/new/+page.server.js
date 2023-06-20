import { getBio } from '$lib/api';

export async function load({ locals }) {
  const currentUser = locals.user;
  const bio = await getBio();
  return {
    currentUser,
    bio
  };
}
