import { getFriend } from '$lib/api';

export async function load({ params, locals }) {
  const data = await getFriend(params.id, locals.currentUser);
  return {
    ...data,
    ...locals
  };
}
