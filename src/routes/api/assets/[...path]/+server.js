import { getAsset } from '$lib/api';
import { json, error } from '@sveltejs/kit';

export const GET = (async ({ params, setHeaders }) => {
  const path = params.path;
  console.log('path', path);
  const file = getAsset(path);

  if (!file || !file.data) {
    throw error(404, 'Asset not found');
  }

  // Set response headers
  setHeaders({
    'Content-Type': file.mimeType,
    'Content-Length': file.size.toString(),
    'Last-Modified': new Date(file.lastModified).toUTCString(),
    'Cache-Control': 'public, max-age=600'
  });

  return new Response(file.data);
});