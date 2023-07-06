<script>
  export let post;
  export let currentUser;
  import { classNames, formatDate } from '$lib/util';
  import SecondaryButton from '$lib/components/SecondaryButton.svelte';

  $: teaser_image = JSON.parse(post.teaser_image);
</script>

<div
  href={`/posts/${post.slug}`}
  class={classNames(
    'md:text-xl rounded-lg border shadow-md bg-white p-4 sm:p-8',
    post.is_public
      ? 'border-gray-300'
      : post.recipients.length > 0
      ? 'border-yellow-300'
      : 'border-red-300'
  )}
>
  <div>
    {#if currentUser}
      <div class="text-sm py-2">
        <!-- Only show this for the site owner -->
        {#if post.is_public}
          <strong>To:</strong> Everyone{#if post.recipients.length > 0}, {post.recipients.map(r => r.name).join(', ')}{/if}
        {:else if post.recipients.length > 0}
          <strong>To:</strong> {post.recipients.map(r => r.name).join(', ')}
        {:else}
          <strong>To:</strong> Myself
        {/if}
      </div>
    {/if}
    <div>
      <a
        href={`/posts/${post.slug}`}
        class={classNames('text-2xl md:text-3xl lg:text-4xl font-bold')}
      >
        {post.title}
      </a>
    </div>
    {#if teaser_image?.src && teaser_image?.width && teaser_image?.height}
      <a href={`/posts/${post.slug}`}>
        <img
          class="block w-full mt-4"
          src={teaser_image.src}
          width={teaser_image.width}
          height={teaser_image.height}
          alt={post.title}
        />
      </a>
    {/if}
    <div class="pt-4">
      <div class={teaser_image?.src ? 'line-clamp-3' : 'line-clamp-5'}>
        <a href={`/posts/${post.slug}`}>
          <span class="font-bold">{formatDate(post.created_at)}</span> — {post.teaser}
        </a>
      </div>
    </div>
  </div>
  <div class="pt-4 flex">
    <SecondaryButton size="sm" href={`/posts/${post.slug}`}>Continue reading →</SecondaryButton>
  </div>
</div>
