<script>
  export let post;
  import { classNames, formatDate } from '$lib/util';

  $: teaserImage = JSON.parse(post.teaserImage);
</script>

<div class="md:text-xl lg:saturate-0 lg:hover:saturate-100">
  <div>
    <div class="text-base" />
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
