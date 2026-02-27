// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, fontProviders } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	site: 'https://example.com',
	prefetch: {
		prefetchAll: true,
		defaultStrategy: 'hover',
	},
	integrations: [mdx(), sitemap()],
	experimental: {
		fonts: [
			{
				provider: fontProviders.google(),
				name: 'Inter',
				cssVariable: '--font-inter',
			},
		],
	},
	vite: {
		// @ts-expect-error - Vite's PluginOption type conflicts between nested vite installs in JS configs
		plugins: [tailwindcss()],
	},
});
