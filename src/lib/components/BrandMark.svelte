<script lang="ts" module>
	export type BrandMarkName = 'heraf' | 'vagledning' | 'heram';
</script>

<script lang="ts">
	// HERAF marks. Same geometry as static/img/brand/*.svg and the favicon.
	// heraf: two pillars (Vägledningen, HERAM) joined by the framework – always two-tone.
	// vagledning: steps leading to a goal – the process. Uses currentColor.
	// heram: three linked nodes – the concept map. Uses currentColor.
	let {
		name,
		size = 24,
		class: className = '',
		title
	}: {
		name: BrandMarkName;
		size?: number;
		class?: string;
		/** Accessible name; omit when the mark sits next to visible text (decorative) */
		title?: string;
	} = $props();
</script>

<svg
	class={className}
	width={size}
	height={size}
	viewBox="0 0 24 24"
	role={title ? 'img' : undefined}
	aria-label={title}
	aria-hidden={title ? undefined : 'true'}
	focusable="false"
	xmlns="http://www.w3.org/2000/svg"
>
	{#if name === 'heraf'}
		<rect x="9" y="10" width="6" height="4" fill="#9A94A8" />
		<rect x="3" y="3" width="6" height="18" rx="1.5" fill="#4A3566" />
		<rect x="15" y="3" width="6" height="18" rx="1.5" fill="#0B5566" />
	{:else if name === 'vagledning'}
		<path
			d="M4 20H9V15H14V10H19V7.5"
			fill="none"
			stroke="currentColor"
			stroke-width="2.25"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
		<circle cx="19" cy="5" r="2.75" fill="currentColor" />
	{:else if name === 'heram'}
		<path
			d="M12 5.5L5.5 17.5H18.5Z"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linejoin="round"
		/>
		<circle cx="12" cy="5.5" r="3.25" fill="currentColor" />
		<circle cx="5.5" cy="17.5" r="3.25" fill="currentColor" />
		<circle cx="18.5" cy="17.5" r="3.25" fill="currentColor" />
	{/if}
</svg>
