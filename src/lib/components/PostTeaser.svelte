<script>
  export let post;
  import { classNames, formatDate } from '$lib/util';

  $: teaserImage = JSON.parse(post.teaserImage);

  

</script>

<div class={classNames('md:text-xl rounded-lg border shadow-md bg-white p-4 sm:p-8', post.isPublic ? 'border-gray-300': post.recipients.length > 0 ? 'border-yellow-300' : 'border-red-300' )}>
  <div>
    <div class="text-sm py-2">
      {#if post.isPublic}
        <strong>To:</strong> Everyone, {post.recipients.map(r => r.name ).join(', ')}
      {:else if (post.recipients.length > 0)}
        <strong>To:</strong> {post.recipients.map(r => r.name ).join(', ')}
      {:else}
      <strong>To:</strong> Myself
      {/if}

      
    </div>
    <div>
      <a
        class={classNames('mb-12 text-2xl md:text-3xl lg:text-4xl font-bold')}
        href={`/posts/${post.slug}`}
      >
        {post.title}
      </a>
    </div>
    {#if teaserImage?.src && teaserImage?.width && teaserImage?.height}
      <a href={`/posts/${post.slug}`}>
        <img
          class="block bg-black w-full mt-4"
          src={teaserImage.src}
          width={teaserImage.width}
          height={teaserImage.height}
          alt={post.title}
        />
      </a>
    {/if}
    <div class="pt-4">
      <div class={teaserImage?.src ? 'line-clamp-3' : 'line-clamp-5'}>
        <a href={`/posts/${post.slug}`}>
          <span class="font-bold">{formatDate(post.createdAt)}</span> — {post.teaser}
        </a>
      </div>
    </div>
  </div>
  <div class="pt-4">
    <a class="font-bold underline" href={`/posts/${post.slug}`}>Continue reading</a>
  </div>
</div>
