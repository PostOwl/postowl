import { getFriend } from '$lib/api';

export async function load({ params, locals }) {
  const currentUser = locals.user;
  const data = await getFriend(params.id);
  return {
    ...data,
    currentUser
  };
}
