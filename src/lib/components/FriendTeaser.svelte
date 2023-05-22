<script>
  export let friend;
  import { classNames } from '$lib/util';
</script>

<a href={`/friends/${friend.friendId}`} class={classNames('block md:text-xl rounded-lg border shadow-md bg-white p-4 sm:p-8', 'border-gray-300')}>
  <div>
    <div class="font-bold">
      {friend.name}
    </div>
    <div>
      {friend.email}
    </div>
  </div>
</a>
