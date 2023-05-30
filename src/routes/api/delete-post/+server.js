import { json } from '@sveltejs/kit';
import { deletePost } from '$lib/api';

export async function POST({ request, locals }) {
  const currentUser = locals.user;
  const { slug } = await request.json();
  const result = await deletePost(slug, currentUser);
  return json(result);
}
