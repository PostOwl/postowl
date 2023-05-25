import { json } from '@sveltejs/kit';
import { updatePost } from '$lib/api';

export async function POST({ request, locals }) {
  const currentUser = locals.user;
  const { slug, title, content, teaser, teaserImage, recipients, isPublic } = await request.json();
  await updatePost(slug, title, content, teaser, teaserImage, recipients, isPublic, currentUser);
  return json({ slug, status: 'ok' });
}
