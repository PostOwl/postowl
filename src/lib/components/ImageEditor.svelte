<script>
  import { page } from '$app/state';
  import { resizeImage, classNames, getDimensions, is_safari, nanoid } from '$lib/util';
  import { getCroppedImg } from '$lib/cropperUtil';
  import uploadAsset from '$lib/uploadAsset';
  import Cropper from '$lib/components/Cropper.svelte';

  /**
   * @typedef {Object} Props
   * @property {any} src
   * @property {any} alt
   * @property {any} [uploadPrompt]
   * @property {any} maxWidth
   * @property {any} maxHeight
   * @property {any} quality
   * @property {string} [class]
   */

  /** @type {Props} */
  let {
    src = $bindable(),
    alt,
    uploadPrompt = undefined,
    maxWidth,
    maxHeight,
    quality,
    class: className = ''
  } = $props();

  

  let fileInput = $state(); // for uploading an image
  let progress = $state(undefined); // file upload progress
  let overlayEl = $state();

  let currentUser = $derived(page.data.currentUser);

  // Cropper stuff
  let newSrc = $state();
  let cropDetail = $state();
  let is_cropping = $state(false);
  let scale = $state(1);
  let crop = $state({ x: 0, y: 0 });
  let zoom = $state(1);

  function onKeyDown(e) {
    // Trigger save
    if (is_cropping && e.key === 'Escape') {
      cancelCropping();
    } else if (is_cropping && e.key === 'Enter') {
      uploadImage();
    }
  }

  function cancelCropping() {
    is_cropping = false;
    newSrc = undefined;
    fileInput.value = null;
    scale = 1;
  }

  async function uploadImage() {
    const file = fileInput.files[0];
    const content_type = is_safari() ? 'image/jpeg' : 'image/webp';

    // We convert all uploads to the WEBP image format
    const extension = is_safari() ? 'jpg' : 'webp';
    const path = [['images', nanoid()].join('/'), extension].join('.');
    const croppedImage = await getCroppedImg(newSrc, cropDetail.pixels);

    const resizedBlob = await resizeImage(croppedImage, maxWidth, maxHeight, quality, content_type);
    const resizedFile = new File([resizedBlob], `${file.name.split('.')[0]}.${extension}`, {
      type: content_type
    });

    progress = 0;
    try {
      if (currentUser) {
        await uploadAsset(resizedFile, path, p => {
          progress = p;
        });
        src = `/assets/${path}`;
      } else {
        src = URL.createObjectURL(resizedFile);
      }
      progress = undefined;
    } catch (err) {
      console.error(err);
      alert('An error occured. Please try again');
      progress = undefined;
    }
    cancelCropping();
    fileInput.value = null;
  }

  async function startCropping() {
    const file = fileInput.files[0];
    const { width, height } = await getDimensions(file);
    const currentAspectRatio = width / height;
    const desiredAspectRatio = maxWidth / maxHeight;

    // HACK: We zoom into the cropper so it fills the whole image area.
    // TODO: We should do this properly by adjusting Cropper.svelte
    if (desiredAspectRatio > currentAspectRatio) {
      scale = desiredAspectRatio / currentAspectRatio;
    } else {
      scale = currentAspectRatio / desiredAspectRatio;
    }

    // Preview image for cropping
    newSrc = URL.createObjectURL(file);
    is_cropping = true;
  }
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  bind:this={overlayEl}
  class={classNames(
    is_cropping
      ? 'z-40 bg-black text-white font-bold fixed inset-0 bg-opacity-80 text-center p-6'
      : 'hidden'
  )}
  ondblclick={cancelCropping}
>
  {#if is_safari()}
    <span class="text-[#EF174C]">ATTENTION:</span> Use Google Chrome, Firefox, oder Microsoft Edge for
    optimized image quality and size.
  {:else}
    Confirm with ENTER. Cancel with ESC.
  {/if}
  {#if progress}
    {progress} uploading...
  {/if}
</div>

{#if is_cropping}
  <div class="flex space-x-4 z-60 fixed bottom-0 right-0 left-0 p-6">
    <div class="flex-1"></div>
    <button class="bg-[#EF174C] text-white rounded-full px-4 py-2" onclick={uploadImage}
      >Confirm</button
    >
    <button class="bg-white text-black rounded-full px-4 py-2" onclick={cancelCropping}
      >Cancel</button
    >
    <div class="flex-1"></div>
  </div>
{/if}

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  style={`aspect-ratio: ${maxWidth}/${maxHeight}; scale: ${scale}`}
  class={classNames(is_cropping ? `z-50` : '', 'relative')}
  ondblclick={uploadImage}
>
  {#if is_cropping}
    <Cropper
      image={newSrc}
      bind:crop
      bind:zoom
      on:cropcomplete={e => (cropDetail = e.detail)}
      aspect={maxWidth / maxHeight}
    />
  {:else}
    <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
    <img
      onmousedown={() => fileInput.click()}
      class={className +
        ' cursor-pointer outline-2 hover:outline-dashed outline-[#EF174C] -outline-offset-2'}
      {src}
      {alt}
      title={uploadPrompt}
    />
  {/if}
</div>

<input
  class="w-px h-px opacity-0 fixed -top-40"
  type="file"
  accept="image/*"
  name="imagefile"
  bind:this={fileInput}
  onchange={startCropping}
/>

<svelte:window onkeydown={onKeyDown} />
