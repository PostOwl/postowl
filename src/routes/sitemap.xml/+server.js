import { getSitemap } from '$lib/api';

export async function GET({ setHeaders }) {
  setHeaders({
    'Content-Type': 'application/xml'
  });
  const sitemap = await getSitemap();
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${sitemap
      .map(s => `<url><loc>${s.url}</loc><lastmod>${s.lastmod}</lastmod></url>`)
      .join('\n')}
  </urlset>`);
}
