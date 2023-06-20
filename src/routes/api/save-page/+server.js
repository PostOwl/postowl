import { json } from '@sveltejs/kit';
import { createOrUpdatePage } from '$lib/api';

export async function POST({ request, locals }) {
  const currentUser = locals.currentUser;
  const { page_id, page } = await request.json();
  await createOrUpdatePage(page_id, page, currentUser);
  return json({ page_id, status: 'ok' });
}
