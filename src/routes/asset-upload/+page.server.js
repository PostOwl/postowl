import { storeAsset } from '$lib/api';

export const actions = {
  upload_asset: async ({ request, locals }) => {
    const data = await request.formData();
    const asset_id = data.get('asset_id');
    const file = data.get('file')?.valueOf();
    console.log(
      file?.name, // filename
      file?.type, // mime type
      file?.size, // file size in bytes
      file?.lastModified // last modified date
      file?.arrayBuffer() // ArrayBuffer with the file contents
    );

    console.log('storing asset:', asset_id);
    await storeAsset(asset_id, file);
  },
};