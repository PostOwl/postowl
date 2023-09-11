import { json } from '@sveltejs/kit';
import { updatePost } from '$lib/api';

export async function POST({ request, locals }) {
  const currentUser = locals.currentUser;
  const { slug, title, content, teaser, teaser_image, recipients, is_public } =
    await request.json();
  const result = await updatePost(
    slug,
    title,
    content,
    teaser,
    teaser_image,
    recipients,
    is_public,
    locals // currentUser, origin, etc.
  );
  return json(result);
}
