import { json } from '@sveltejs/kit';
import { createPost } from '$lib/api';
import { storeAsset } from '$lib/api';

// export const GET = (async ({ params, setHeaders }) => {
//   const path = params.path;
//   console.log('path', path);
//   const file = getAsset(path);

export async function PUT({ request, locals, params }) {
  const data = await request.formData();
  console.log('_______________', data);
  const asset_id = data.get('path');
  const file = data.get('file')?.valueOf();
  console.log(
    file?.name, // filename
    file?.type, // mime type
    file?.size, // file size in bytes
    file?.lastModified, // last modified date
    file?.arrayBuffer() // ArrayBuffer with the file contents
  );

  console.log('storing asset:', asset_id);
  await storeAsset(asset_id, file);
  return json({ path: asset_id });
}