import { getFriend } from '$lib/api';

export async function load({ params, locals }) {
  const currentUser = locals.currentUser;
  const data = await getFriend(params.id);
  return {
    ...data,
    currentUser
  };
}
