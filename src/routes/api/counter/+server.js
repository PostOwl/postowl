import { createOrUpdateCounter } from '$lib/api';
import { json } from '@sveltejs/kit';

export async function GET({ url }) {
  const counter_id = url.searchParams.get('c');
  return json(await createOrUpdateCounter(counter_id, true));
}
