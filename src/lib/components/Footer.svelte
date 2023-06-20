<script>
  import { onMount } from 'svelte';
  import { fetchJSON } from '$lib/util';
  import NotEditable from '$lib/components/NotEditable.svelte';

  export let counter = undefined;
  export let editable = false;
  let count;

  onMount(async () => {
    if (counter) {
      const result = await fetchJSON('GET', `/api/counter?c=${counter}`);
      count = result.count;
    }
  });
</script>

<NotEditable {editable}>
  <div class="">
    <div class="max-w-screen-md mx-auto px-6 py-6 text-sm lg:text-base">
      <div class="text-center">
        Powered by <a class="underline font-medium" href="https://postowl.com">PostOwl</a>. Page
        viewed {count || '…'} times.
      </div>
    </div>
  </div>
</NotEditable>
