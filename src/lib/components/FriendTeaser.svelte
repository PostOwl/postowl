<script>
  export let friend;
  import { classNames } from '$lib/util';
</script>

<a
  href={`/friends/${friend.friend_id}`}
  class={classNames('block md:text-xl rounded-2xl border border-black bg-white p-4 sm:p-8')}
>
  <div>
    {#if friend.name}
      <div class="font-bold">
        {friend.name}
      </div>
    {/if}
    <div>
      {friend.email}
    </div>
  </div>
</a>
