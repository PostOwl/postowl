<script>
  import { classNames, formatDate } from '$lib/util';
  let { post, currentUser } = $props();

  let teaser_image = $derived(post.teaser_image ? JSON.parse(post.teaser_image) : null);
  const lf = new Intl.ListFormat('en');
</script>

<div class={classNames('md:text-xl rounded-2xl border bg-white p-4 sm:p-8 border-gray-200')}>
  {#if currentUser}
    <div class="text-sm py-2 flex">
      <div class="flex-1">
        <!-- Only show this for the site owner -->
        {#if post.is_public}
          <strong>Public</strong>
          {#if post.recipients.length > 0}
            (and sent to {lf.format(post.recipients.map(r => r.name))}){/if}
        {:else if post.recipients.length > 0}
          <strong>Shared</strong> (sent to {lf.format(post.recipients.map(r => r.name))})
        {:else}
          Private
        {/if}
      </div>
      {#if post.is_public}
        <div title="This post is publicly visible.">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-4 h-4"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"
            />
          </svg>
        </div>
      {/if}
    </div>
  {/if}
  <div class="flex gap-4">
    <div class="flex-1">
      <div class="pb-2 sm:text-lg">{formatDate(post.created_at)}</div>
      <a
        href={`/posts/${post.slug}`}
        class={classNames('text-2xl md:text-3xl lg:text-4xl font-bold')}
      >
        {post.title}
      </a>
    </div>
    {#if teaser_image?.src}
      <a href={`/posts/${post.slug}`} class="shrink-0">
        <img
          class="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded"
          src={teaser_image.src}
          alt={post.title}
        />
      </a>
    {/if}
  </div>
</div>
