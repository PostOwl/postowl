import { json } from '@sveltejs/kit';
import { createPost } from '$lib/api';

export async function POST({ request, locals }) {
  const currentUser = locals.user;
  const { title, content, teaser, teaserImage, createdAt } = await request.json();
  const { slug } = await createPost(title, content, teaser, teaserImage, createdAt, currentUser);
  return json({ slug });
}
