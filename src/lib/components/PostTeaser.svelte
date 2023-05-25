<script>
  export let post;
  export let currentUser;
  import { classNames, formatDate } from '$lib/util';
  import SecondaryButton from '$lib/components/SecondaryButton.svelte';

  $: teaserImage = JSON.parse(post.teaserImage);

</script>

<a href={`/posts/${post.slug}`} class={classNames('block md:text-xl rounded-lg border shadow-md bg-white p-4 sm:p-8', post.isPublic ? 'border-gray-300': post.recipients.length > 0 ? 'border-yellow-300' : 'border-red-300' )}>
  <div>
    <div class="text-sm py-2">
      <!-- Only show this for the site owner -->
      {#if currentUser}
        {#if post.isPublic}
          <strong>To:</strong> Everyone
        {:else if (post.recipients.length > 0)}
          <strong>To:</strong> {post.recipients.map(r => r.name ).join(', ')}
        {:else}
          <strong>To:</strong> Myself
        {/if}
      {/if}
    </div>
    <div>
      <div
        class={classNames('text-2xl md:text-3xl lg:text-4xl font-bold')}
      >
        {post.title}
      </div>
    </div>
    {#if teaserImage?.src && teaserImage?.width && teaserImage?.height}
      <img
        class="block bg-black w-full mt-4"
        src={teaserImage.src}
        width={teaserImage.width}
        height={teaserImage.height}
        alt={post.title}
      />
    {/if}
    <div class="pt-4">
      <div class={teaserImage?.src ? 'line-clamp-3' : 'line-clamp-5'}>
        <a href={`/posts/${post.slug}`}>
          <span class="font-bold">{formatDate(post.createdAt)}</span> — {post.teaser}
        </a>
      </div>
    </div>
  </div>
  <div class="pt-4 flex">
    <SecondaryButton size='sm' href={`/posts/${post.slug}`}>Continue reading →</SecondaryButton>
  </div>
</a>
