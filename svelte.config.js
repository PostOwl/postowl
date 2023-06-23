import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/kit/vite';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter({
      /**
       * We're setting sveltekit's adapter-node envPrefix to PUBLIC_
       * as a bit of a hack to help prevent repetition in our deployment
       * configuration. Our application code makes use of the deployed
       * URL in several places that are compiled into client side code.
       * sveltekit also uses this value, normally as ORIGIN see
       * https://kit.svelte.dev/docs/adapter-node#environment-variables-origin-protocol-header-and-host-header
       * By changing ORIGIN to PUBLIC_ORIGIN we're able to reuse the value
       * where it needs to be compiled to client side code at build time, see:
       * https://kit.svelte.dev/docs/modules#$env-dynamic-public
       */
     envPrefix: 'PUBLIC_'
     }),
    csrf: {
      checkOrigin: false
    }
  },
  preprocess: vitePreprocess()
};

export default config;
