// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://example.dg-site-kit.workers.dev', // placeholder — mỗi client thật sẽ đổi khi clone kit này
  vite: {
    plugins: [tailwindcss()],
  },
});
