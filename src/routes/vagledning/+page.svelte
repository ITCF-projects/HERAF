<script lang="ts">
	import { contentData } from '$lib/content-data.generated.js';
	import { getSidebarContext } from '$lib/sidebar-state.svelte';
	import { getConcept, getPrinciple } from '$lib/content';
	import DocLayout, { type DocSection } from '$lib/components/DocLayout.svelte';
	import BrandMark from '$lib/components/BrandMark.svelte';
	import { fade } from 'svelte/transition';
	import { onMount } from 'svelte';

	const guidance = contentData.guidance;
	const sidebar = getSidebarContext();

	// h2–h4 in the table of contents (the h1 is the page title)
	const sections: DocSection[] = (guidance?.sections ?? []).filter(
		(s: DocSection) => s.level >= 2 && s.level <= 4
	);

	let currentSection = $state('');
	let article = $state<HTMLElement>();

	// The six process steps, from the "Steg N: Titel" headings
	const steps = sections
		.filter((s) => /^steg-\d+-/.test(s.id))
		.map((s) => {
			const [, num, title] = s.title.match(/^Steg (\d+):\s*(.*)$/) ?? [];
			return { id: s.id, num: Number(num), title: title ?? s.title };
		});

	// Everything from "Starta iterationen" to the end of the ongoing activities.
	// The process diagram sits just above, so the bar appears once it has scrolled away.
	const processIds = (() => {
		const start = sections.findIndex((s) => s.id === 'starta-iterationen');
		if (start < 0) return new Set<string>();
		const end = sections.findIndex((s, i) => i > start && s.level === 2);
		return new Set(sections.slice(start, end < 0 ? undefined : end).map((s) => s.id));
	})();

	// The level-4 headings directly under "Löpande aktiviteter"
	const ongoingIds = (() => {
		const ids = new Set<string>();
		const start = sections.findIndex((s) => s.id === 'lopande-aktiviteter');
		for (let i = start + 1; start >= 0 && sections[i]?.level === 4; i++) ids.add(sections[i].id);
		return ids;
	})();

	let inProcess = $derived(processIds.has(currentSection));
	let currentStep = $derived(steps.find((s) => s.id === currentSection));
	let currentOngoing = $derived(
		ongoingIds.has(currentSection) ? sections.find((s) => s.id === currentSection)?.title : undefined
	);

	// Concept and principle links open in the side panel instead of navigating
	function handleArticleClick(event: MouseEvent) {
		const link = (event.target as Element).closest('a');
		const href = link?.getAttribute('href') ?? '';
		if (href.startsWith('concept:')) {
			event.preventDefault();
			const concept = getConcept(href.slice('concept:'.length));
			if (concept) sidebar.openConcept(concept);
		} else if (href.startsWith('principle:')) {
			event.preventDefault();
			const principle = getPrinciple(href.slice('principle:'.length));
			if (principle) sidebar.openPrinciple(principle);
		}
	}

	// The introduction is a closed <details>. A link into it (table of contents,
	// cross-reference, a shared URL) opens it first, so the browser has somewhere to scroll.
	function revealTarget(hash: string) {
		if (!hash || hash === '#') return null;
		const el = document.getElementById(decodeURIComponent(hash.slice(1)));
		const details = el?.closest('details');
		if (!details || details.open) return null;
		details.open = true;
		return el;
	}

	onMount(() => {
		revealTarget(location.hash)?.scrollIntoView();

		const onClick = (event: MouseEvent) => {
			const link = (event.target as Element | null)?.closest?.('a[href*="#"]') as HTMLAnchorElement | null;
			if (!link) return;
			const url = new URL(link.href, location.href);
			if (url.pathname === location.pathname) revealTarget(url.hash);
		};
		const onHashChange = () => revealTarget(location.hash)?.scrollIntoView();

		document.addEventListener('click', onClick, true);
		window.addEventListener('hashchange', onHashChange);
		return () => {
			document.removeEventListener('click', onClick, true);
			window.removeEventListener('hashchange', onHashChange);
		};
	});

	// Highlight the step in the process diagram that matches the section being read
	$effect(() => {
		const id = currentSection;
		article?.querySelectorAll('.diagram [data-target]').forEach((el) => {
			el.classList.toggle('is-current', el.getAttribute('data-target') === id);
		});
	});
</script>

<svelte:head>
	<title>Vägledning – HERAF</title>
	<meta
		name="description"
		content="Vägledning för att ta fram en referensarkitektur enligt HERAF: processens steg, löpande aktiviteter och krav på innehåll."
	/>
</svelte:head>

<DocLayout {sections} bind:currentSection>
	<!-- Zero-height sticky anchor: the bar floats over the text without shifting it -->
	<div class="progress-anchor">
		{#if inProcess && steps.length}
			<nav class="progress" aria-label="Var du är i processen" transition:fade={{ duration: 150 }}>
				<ol class="progress-steps">
					{#each steps as step (step.id)}
						<li class:phase-break={step.num === 4}>
							<a
								href="#{step.id}"
								class="progress-dot"
								class:is-current={currentStep?.id === step.id}
								aria-current={currentStep?.id === step.id ? 'step' : undefined}
								title="Steg {step.num}: {step.title}"
							>
								<span class="sr-only">Steg </span>{step.num}
							</a>
						</li>
					{/each}
				</ol>
				<p class="progress-label">
					{#if currentStep}
						<span class="progress-strong">Steg {currentStep.num}:</span> {currentStep.title}
					{:else if currentOngoing}
						<span class="progress-strong">Löpande:</span> {currentOngoing}
					{:else}
						Processen
					{/if}
				</p>
			</nav>
		{/if}
	</div>

	<BrandMark name="vagledning" size={44} class="mb-5 text-aubergine" />
	{#if guidance?.htmlContent}
		<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_noninteractive_element_interactions -->
		<article class="doc-article" bind:this={article} onclick={handleArticleClick}>
			{@html guidance.htmlContent}
		</article>
	{:else}
		<p class="text-muted">Vägledningen kunde inte laddas. Kör <code>npm run build:content</code> och ladda om sidan.</p>
	{/if}
</DocLayout>

<style>
	.progress-anchor {
		position: sticky;
		top: var(--header-h);
		z-index: 20;
		height: 0;
	}

	.progress {
		position: absolute;
		top: 0.75rem;
		left: 0;
		display: flex;
		align-items: center;
		gap: 0.875rem;
		width: 100%;
		max-width: 42rem;
		padding: 0.4375rem 0.875rem 0.4375rem 0.5rem;
		border: 1px solid var(--color-line);
		border-radius: 999px;
		background: var(--color-paper);
		box-shadow: 0 2px 10px rgb(38 35 46 / 0.08);
	}

	.progress-steps {
		display: flex;
		flex: none;
		gap: 0.25rem;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	/* Steps 1–3 start the iteration, 4–6 produce the content */
	.progress-steps .phase-break {
		margin-left: 0.5rem;
	}

	.progress-dot {
		display: grid;
		place-items: center;
		width: 1.75rem;
		height: 1.75rem;
		border: 1.5px solid var(--color-aubergine-line);
		border-radius: 50%;
		color: var(--color-aubergine);
		font-size: 0.8125rem;
		font-weight: 600;
		font-variant-numeric: tabular-nums;
		text-decoration: none;
	}

	.progress-dot:hover {
		background: var(--color-aubergine-soft);
	}

	.progress-dot.is-current {
		border-color: var(--color-aubergine);
		background: var(--color-aubergine);
		color: #FFFFFF;
	}

	.progress-label {
		min-width: 0;
		margin: 0;
		overflow: hidden;
		font-size: 0.875rem;
		color: var(--color-ink);
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.progress-strong {
		font-weight: 600;
		color: var(--color-aubergine);
	}

	@media (max-width: 30rem) {
		.progress {
			gap: 0.5rem;
		}

		.progress-dot {
			width: 1.5rem;
			height: 1.5rem;
			font-size: 0.75rem;
		}

		.progress-steps .phase-break {
			margin-left: 0.25rem;
		}
	}
</style>
