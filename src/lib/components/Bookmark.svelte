<script>
  import { onMount, onDestroy } from 'svelte';
  import { browser } from '$app/environment';
  import { fade } from 'svelte/transition';
  import { env } from '$env/dynamic/public';

  export let slug;
  export let editable = false;
  
  let showButton = false;
  let savedPosition = 0;
  let scrollTimer;
  let lastScrollPosition = 0;
  let isMobile = false;
  
  const STORAGE_KEY = `postowl-bookmark-${slug}`;
  const SCROLL_THRESHOLD = 100;
  const bookmarkMode = env.PUBLIC_BOOKMARK_MODE ?? 'disabled';
  
  function shouldShowBookmark() {
    if (bookmarkMode === 'disabled') return false;
    if (bookmarkMode === 'mobile' && !isMobile) return false;
    return true;
  }
  
  function checkIfMobile() {
    if (!browser) return;
    isMobile = window.innerWidth < 640; // Using Tailwind's sm breakpoint
  }
  
  function loadBookmark() {
    if (!browser || !shouldShowBookmark()) return;
    
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      savedPosition = parseInt(saved, 10);
      const currentScroll = window.scrollY || window.pageYOffset;
      
      if (savedPosition > currentScroll + SCROLL_THRESHOLD) {
        showButton = true;
      }
    }
  }
  
  function saveBookmark() {
    if (!browser) return;
    
    const currentScroll = window.scrollY || window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight;
    const windowHeight = window.innerHeight;
    
    if (currentScroll > 100 && currentScroll < docHeight - windowHeight - 100) {
      localStorage.setItem(STORAGE_KEY, currentScroll.toString());
      lastScrollPosition = currentScroll;
    }
  }
  
  function handleScroll() {
    if (!browser || !shouldShowBookmark()) return;
    
    clearTimeout(scrollTimer);
    
    const currentScroll = window.scrollY || window.pageYOffset;
    
    if (savedPosition > 0) {
      if (currentScroll >= savedPosition - SCROLL_THRESHOLD) {
        showButton = false;
      } else if (currentScroll < savedPosition - SCROLL_THRESHOLD * 2) {
        showButton = true;
      }
    }
    
    scrollTimer = setTimeout(() => {
      saveBookmark();
    }, 2000);
  }
  
  function scrollToBookmark() {
    if (!browser || !savedPosition) return;
    
    window.scrollTo({
      top: savedPosition,
      behavior: 'smooth'
    });
    
    setTimeout(() => {
      showButton = false;
    }, 500);
  }
  
  function handleResize() {
    checkIfMobile();
    if (!shouldShowBookmark() && showButton) {
      showButton = false;
    } else if (shouldShowBookmark()) {
      loadBookmark();
    }
  }
  
  onMount(() => {
    if (!browser) return;
    
    checkIfMobile();
    
    if (shouldShowBookmark()) {
      loadBookmark();
      window.addEventListener('scroll', handleScroll, { passive: true });
      handleScroll();
    }
    
    window.addEventListener('resize', handleResize);
  });
  
  onDestroy(() => {
    if (!browser) return;
    
    window.removeEventListener('scroll', handleScroll);
    window.removeEventListener('resize', handleResize);
    clearTimeout(scrollTimer);
  });
</script>

{#if showButton}
  <button
    transition:fade={{ duration: 300 }}
    on:click={scrollToBookmark}
    class="fixed bottom-8 left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 sm:right-8 bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 z-50 flex items-center gap-2"
    aria-label="Continue reading from where you left off"
  >
    <span class="text-lg">↓</span>
    {editable ? 'continue editing' : 'continue reading'}
  </button>
{/if}

