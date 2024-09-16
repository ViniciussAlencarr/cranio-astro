/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			width: {
				'inherit': 'inherit',
			},
			screens: {
				sm2: '960px',
				sm3: '416px',
				md2: '1230px'
			}
		},
	},
	plugins: [],
}
