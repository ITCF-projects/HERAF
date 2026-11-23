<script lang="ts" module>
	export type DocSection = { id: string; title: string; level: number };
</script>

<script lang="ts">
	import { onMount, type Snippet } from 'svelte';

	let {
		sections,
		currentSection = $bindable(''),
		children
	}: {
		/** Table of contents entries; level 2–4. The page must render an element with each id. */
		sections: DocSection[];
		/** Id of the section being read (bindable) */
		currentSection?: string;
		children: Snippet;
	} = $props();

	let mobileToc = $state<HTMLDetailsElement>();

	// How far below the viewport top a heading counts as "being read"
	// (sticky header 56px + room for a heading that was jumped to)
	const READ_OFFSET = 152;

	function updateCurrentSection() {
		let current = sections[0]?.id ?? '';
		for (const section of sections) {
			const el = document.getElementById(section.id);
			if (!el) continue;
			const rect = el.getBoundingClientRect();
			// Hidden, e.g. inside a closed <details>: it has no position to compare
			if (!rect.width && !rect.height) continue;
			if (rect.top <= READ_OFFSET) current = section.id;
			else break;
		}
		currentSection = current;
	}

	onMount(() => {
		let frame = 0;
		const onScroll = () => {
			cancelAnimationFrame(frame);
			frame = requestAnimationFrame(updateCurrentSection);
		};
		updateCurrentSection();
		window.addEventListener('scroll', onScroll, { passive: true });
		return () => {
			cancelAnimationFrame(frame);
			window.removeEventListener('scroll', onScroll);
		};
	});
</script>

{#snippet tocList(onNavigate?: () => void)}
	<ol class="toc">
		{#each sections as section (section.id)}
			<li class="toc-item level-{section.level}">
				<a
					href="#{section.id}"
					aria-current={currentSection === section.id ? 'location' : undefined}
					onclick={onNavigate}
				>
					{section.title}
				</a>
			</li>
		{/each}
	</ol>
{/snippet}

<div class="doc">
	<aside class="doc-nav" aria-label="Innehåll">
		<p class="doc-nav-title">Innehåll</p>
		{@render tocList()}
	</aside>

	<div class="doc-main">
		<details class="doc-nav-mobile" bind:this={mobileToc}>
			<summary>Innehåll</summary>
			{@render tocList(() => mobileToc && (mobileToc.open = false))}
		</details>

		{@render children()}
	</div>
</div>

<style>
	.doc {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		max-width: 90rem;
		margin: 0 auto;
	}

	.doc-main {
		min-width: 0;
		padding: 2rem 1rem 5rem;
	}

	@media (min-width: 40rem) {
		.doc-main {
			padding: 3rem 2rem 6rem;
		}
	}

	.doc-nav {
		display: none;
	}

	@media (min-width: 64rem) {
		.doc {
			grid-template-columns: 17rem minmax(0, 1fr);
		}

		.doc-main {
			padding: 3.5rem 4rem 7rem;
		}

		.doc-nav {
			display: block;
			position: sticky;
			top: var(--header-h);
			height: calc(100vh - var(--header-h));
			overflow-y: auto;
			padding: 2rem 1rem 2rem 1.5rem;
			border-right: 1px solid var(--color-line);
			background: var(--color-shade);
		}

		.doc-nav-mobile {
			display: none;
		}
	}

	.doc-nav-title {
		margin: 0 0 0.75rem 0.75rem;
		font-size: 0.8125rem;
		font-weight: 600;
		color: var(--color-muted);
	}

	.doc-nav-mobile {
		margin-bottom: 2rem;
		border: 1px solid var(--color-line);
		border-radius: 4px;
		background: var(--color-shade);
	}

	.doc-nav-mobile summary {
		padding: 0.75rem 1rem;
		font-size: 0.9375rem;
		font-weight: 600;
		cursor: pointer;
	}

	.doc-nav-mobile .toc {
		padding: 0 0.5rem 0.75rem;
	}

	.toc {
		list-style: none;
		margin: 0;
		padding: 0;
		font-size: 0.875rem;
		line-height: 1.35;
	}

	.toc-item a {
		display: block;
		padding: 0.3125rem 0.75rem;
		border-left: 2px solid transparent;
		color: var(--color-muted);
		text-decoration: none;
	}

	.toc-item a:hover {
		color: var(--color-ink);
	}

	.toc-item a[aria-current='location'] {
		border-left-color: var(--color-aubergine);
		color: var(--color-aubergine);
		font-weight: 600;
	}

	.toc-item.level-2 {
		margin-top: 1rem;
	}

	.toc-item.level-2:first-child {
		margin-top: 0;
	}

	.toc-item.level-2 a {
		color: var(--color-ink);
		font-weight: 600;
	}

	.toc-item.level-3 a {
		padding-left: 1.5rem;
	}

	.toc-item.level-4 a {
		padding-left: 2.25rem;
		font-size: 0.8125rem;
	}
</style>
