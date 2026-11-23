<script lang="ts">
	import { X } from '@lucide/svelte';
	import { fade } from 'svelte/transition';
	import { getSidebarContext } from '$lib/sidebar-state.svelte';
	import { getConcept, getPrinciple } from '$lib/content';

	const sidebar = getSidebarContext();

	let isOpen = $derived(sidebar.isOpen);
	let content = $derived(sidebar.content);
	let meta = $derived(content?.metadata ?? {});

	// Related concepts: only those that exist, shown by title
	let relatedConcepts = $derived(
		((meta.relationships ?? []) as string[])
			.map((slug) => getConcept(slug))
			.filter((c): c is NonNullable<typeof c> => c !== null)
	);

	// Referenced governance: principles open in the panel, other IDs are shown as text
	let references = $derived(((meta.references ?? []) as string[]).map((id) => ({ id, principle: getPrinciple(id) })));

	// Principles have a short title (the ID) and a statement worth showing on its own
	let statement = $derived(meta.header && meta.header !== content?.title ? meta.header : '');

	let closeButton = $state<HTMLButtonElement>();

	$effect(() => {
		if (isOpen) closeButton?.focus();
	});
</script>

<svelte:window onkeydown={(e) => e.key === 'Escape' && isOpen && sidebar.close()} />

{#if isOpen}
	<div
		class="fixed inset-0 z-40 bg-ink/20"
		onclick={() => sidebar.close()}
		aria-hidden="true"
		transition:fade={{ duration: 200 }}
	></div>
{/if}

<aside
	class="fixed top-0 right-0 z-50 flex h-full w-full max-w-md flex-col border-l border-line bg-paper transition-transform duration-300 ease-in-out"
	class:translate-x-full={!isOpen}
	class:translate-x-0={isOpen}
	class:shadow-2xl={isOpen}
	inert={!isOpen}
	aria-label={content?.title ?? 'Detaljer'}
>
	{#if content}
		<header class="flex items-start justify-between gap-4 border-b border-line px-6 pt-5 pb-4">
			<div class="min-w-0">
				{#if content.categoryLabel}
					<p class="text-xs font-semibold text-muted">{content.categoryLabel}</p>
				{/if}
				<h2 class="mt-0.5 text-xl font-bold text-petrol">{content.title}</h2>
			</div>
			<button
				bind:this={closeButton}
				onclick={() => sidebar.close()}
				class="-mr-2 shrink-0 rounded p-2 text-muted hover:bg-shade hover:text-ink"
				aria-label="Stäng"
			>
				<X class="h-5 w-5" />
			</button>
		</header>

		<div class="flex-1 overflow-y-auto px-6 py-5">
			{#if statement}
				<p class="mb-4 font-sans text-base font-semibold leading-snug">{statement}</p>
			{/if}
			{#if meta.status && meta.status !== 'active'}
				<p class="mb-4 text-sm text-muted">Status: {meta.status}</p>
			{/if}

			{#if content.htmlContent}
				<div class="doc-article drawer-article">
					{@html content.htmlContent}
				</div>
			{:else if content.content}
				<p class="text-sm leading-relaxed whitespace-pre-wrap">{content.content}</p>
			{/if}

			{#if meta.examples?.length}
				<p class="mt-5 text-sm"><span class="font-semibold">Exempel:</span> {meta.examples.join(', ')}</p>
			{/if}
		</div>

		{#if relatedConcepts.length || references.length || content.footerHref}
			<footer class="space-y-3 border-t border-line bg-shade px-6 py-4 text-sm">
				{#if relatedConcepts.length}
					<div>
						<p class="font-semibold">Relaterade begrepp</p>
						<ul class="mt-1 flex flex-wrap gap-x-4 gap-y-1">
							{#each relatedConcepts as concept (concept.slug)}
								<li>
									<button class="text-petrol underline decoration-dotted underline-offset-2 hover:decoration-solid" onclick={() => sidebar.openConcept(concept)}>
										{concept.metadata.title}
									</button>
								</li>
							{/each}
						</ul>
					</div>
				{/if}

				{#if references.length}
					<div>
						<p class="font-semibold">Bygger på</p>
						<ul class="mt-1 flex flex-wrap gap-x-4 gap-y-1">
							{#each references as ref (ref.id)}
								<li>
									{#if ref.principle}
										<button class="text-petrol underline decoration-dotted underline-offset-2 hover:decoration-solid" onclick={() => ref.principle && sidebar.openPrinciple(ref.principle)}>
											{ref.id}
										</button>
									{:else}
										{ref.id}
									{/if}
								</li>
							{/each}
						</ul>
					</div>
				{/if}

				{#if content.footerHref}
					<a href={content.footerHref} class="inline-block font-medium text-petrol underline underline-offset-2" onclick={() => sidebar.close()}>
						{content.footerContent ?? 'Visa mer'}
					</a>
				{/if}
			</footer>
		{/if}
	{/if}
</aside>

<style>
	/* Narrower column than the page: smaller type, and the title is already in the header */
	:global(.drawer-article) {
		font-size: 0.9375rem;
	}

	:global(.drawer-article > h1:first-child) {
		display: none;
	}

	/* The hidden title would otherwise turn the first paragraphs into the page's lead style */
	:global(.drawer-article h1 + p),
	:global(.drawer-article h1 + p + p) {
		margin-bottom: 1rem;
		font-family: var(--font-serif);
		font-size: inherit;
		line-height: inherit;
		color: inherit;
	}

	:global(.drawer-article h2) {
		margin: 1.75rem 0 0.5rem;
		padding-top: 0;
		border-top: 0;
		font-size: 1.0625rem;
		color: var(--color-petrol);
	}

	:global(.drawer-article h3) {
		margin: 1.25rem 0 0.375rem;
		font-size: 0.9375rem;
	}

	:global(.drawer-article li::marker) {
		color: var(--color-petrol);
	}
</style>
