<script>
  import { page } from '$app/state';
</script>

<div class="max-w-(--breakpoint-md) mx-auto px-6">
  <div class="flex items-center space-x-4 pt-48">
    <div class="flex-1"></div>
    <h1 class="text-center text-4xl md:text-7xl font-bold">{page.status}</h1>
    <div class="w-px bg-black h-[50px]"></div>
    <div>Not found. <a class="underline" href="/">Start over</a>.</div>
    <div class="flex-1"></div>
  </div>
  <div class="pt-32"></div>
</div>
