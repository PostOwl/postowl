<script>
  export let data;

  let uploaded_asset;

  function handle_upload(e) {
    const image = (e.target)?.files?.[0];
    if (!image) return;
    // URL.createObjectURL() creates a temporary URL for the image we can use as src for an img tag
    uploaded_asset = URL.createObjectURL(image);
  }
</script>

<div class="max-w-screen-md mx-auto px-6">
  <form method="post" enctype="multipart/form-data">
    <input type="hidden" name="asset_id" value="images/example-image.webp" />
    <input type="file" name="file" accept="image/*" on:change={handle_upload} />
  
    {#if uploaded_asset}
      <div class="mt-4">
        <img src={uploaded_asset} style="max-width: 50ch;" alt="" />
      </div>
    {/if}
  
    <div class="mt-4 mb-6">
      <button
        class="button is-primary is-disabled"
        type="submit"
        formaction="?/upload_asset"
        disabled={!uploaded_asset ?? null}
        >Upload Image
      </button>
    </div>
  </form>
</div>
