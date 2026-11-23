<script lang="ts">
	import { contentData } from '$lib/content-data.generated.js';
	import DocLayout, { type DocSection } from '$lib/components/DocLayout.svelte';
	import ConceptModel from '$lib/components/ConceptModel.svelte';
	import BrandMark from '$lib/components/BrandMark.svelte';

	type GovernanceItem = {
		slug: string;
		metadata: Record<string, any>;
		parts: { descriptionHtml: string | null; rationaleHtml: string | null; referenceHtml: string | null };
	};

	const heram = contentData.heram;
	const governance = contentData.governance;
	const conceptsBySlug = new Map(contentData.concepts.map((c) => [c.slug, c]));

	const governanceGroups: { id: string; title: string; intro: string; field: string; items: GovernanceItem[] }[] = [
		{
			id: 'principer',
			title: 'Principer',
			intro: 'Principerna anger den grundläggande riktningen. EAP-principerna gäller all arkitekturstyrning, P-principerna gäller referensarkitekturer.',
			field: 'principle',
			items: governance.principles as GovernanceItem[]
		},
		{
			id: 'riktlinjer',
			title: 'Riktlinjer',
			intro: 'Riktlinjerna konkretiserar principerna och anger vad som bör göras.',
			field: 'guideline',
			items: governance.guidelines as GovernanceItem[]
		},
		{
			id: 'regler',
			title: 'Regler',
			intro: 'Reglerna anger vad som ska göras. Varje regel bygger på en princip.',
			field: 'rule',
			items: governance.rules as GovernanceItem[]
		}
	];

	// Ids that exist on this page, so references only become links when they have a target
	const governanceIds = new Set(governanceGroups.flatMap((g) => g.items.map((i) => String(i.metadata.id))));

	const sections: DocSection[] = [
		{ id: 'konceptkarta', title: 'Konceptkarta', level: 2 },
		...heram.groups.flatMap((group) => [
			{ id: group.id, title: group.title, level: 2 },
			...group.concepts.map((slug) => ({
				id: `concept-${slug}`,
				title: conceptsBySlug.get(slug)?.metadata.title ?? slug,
				level: 3
			}))
		]),
		{ id: 'styrning', title: 'Styrning', level: 2 },
		...governanceGroups.map((g) => ({ id: g.id, title: g.title, level: 3 }))
	];

	// Concept map node ids are concept slugs
	function goToNode(nodeId: string) {
		const target = `concept-${nodeId}`;
		if (document.getElementById(target)) location.hash = target;
	}
</script>

<svelte:head>
	<title>HERAM – HERAF</title>
	<meta
		name="description"
		content="HERAM, modellen bakom HERAF: konceptkarta, begrepp samt de principer, riktlinjer och regler som referensarkitekturer ska följa."
	/>
</svelte:head>

<DocLayout {sections}>
	<BrandMark name="heram" size={44} class="mb-5 text-petrol" />
	<article class="doc-article heram-article">
		<h1>{heram.title}</h1>
		<p>{heram.lead}</p>
		<p>Begreppen och styrningen är under utveckling och kan ändras.</p>

		<div class="mt-8">{@html heram.introHtml}</div>

		<h2 id="konceptkarta">Konceptkarta</h2>
		<p>Kartan visar hur de centrala begreppen hänger ihop. Välj ett begrepp för att gå till beskrivningen.</p>
	</article>

	<figure class="concept-map">
		<div class="concept-map-scroll">
			<ConceptModel onNodeClick={goToNode} />
		</div>
	</figure>

	<article class="doc-article heram-article">
		{#each heram.groups as group (group.id)}
			<h2 id={group.id}>{group.title}</h2>
			{#if group.description}<p class="group-intro">{group.description}</p>{/if}

			{#each group.concepts as slug (slug)}
				{@const concept = conceptsBySlug.get(slug)}
				{#if concept}
					<section class="entry">
						<h3 id="concept-{slug}">{concept.metadata.title}</h3>
						{@html concept.bodyHtml}

						{#if concept.metadata.examples?.length}
							<p class="entry-meta"><span>Exempel:</span> {concept.metadata.examples.join(', ')}</p>
						{/if}
						{#if concept.metadata.relationships?.some((r: string) => conceptsBySlug.has(r))}
							<p class="entry-meta">
								<span>Relaterade begrepp:</span>
								{#each concept.metadata.relationships.filter((r: string) => conceptsBySlug.has(r)) as related, i (related)}
									{#if i > 0}, {/if}<a href="#concept-{related}">{conceptsBySlug.get(related)?.metadata.title}</a>
								{/each}
							</p>
						{/if}
					</section>
				{/if}
			{/each}
		{/each}

		<h2 id="styrning">Styrning</h2>
		<p>
			Styrningen gäller alla referensarkitekturer som tas fram enligt HERAF. Den är uppdelad i principer,
			riktlinjer och regler, och varje riktlinje och regel refererar till den princip den bygger på.
		</p>

		{#each governanceGroups as group (group.id)}
			<h3 id={group.id}>{group.title}</h3>
			<p class="group-intro">{group.intro}</p>

			{#each group.items as item (item.slug)}
				{@const id = String(item.metadata.id)}
				<section class="entry gov-entry" id={id.toLowerCase()}>
					<h4><span class="gov-id">{id}</span> {item.metadata[group.field]}</h4>
					{#if item.metadata.status && item.metadata.status !== 'active'}
						<p class="entry-meta"><span>Status:</span> {item.metadata.status}</p>
					{/if}
					{#if item.parts.descriptionHtml}{@html item.parts.descriptionHtml}{/if}
					{#if item.parts.rationaleHtml}
						<p class="gov-label">Motivering</p>
						{@html item.parts.rationaleHtml}
					{/if}
					{#if item.parts.referenceHtml}{@html item.parts.referenceHtml}{/if}
					{#if item.metadata.references?.length}
						<p class="entry-meta">
							<span>Bygger på:</span>
							{#each item.metadata.references as ref, i (ref)}
								{#if i > 0}, {/if}{#if governanceIds.has(ref)}<a href="#{String(ref).toLowerCase()}">{ref}</a>{:else}{ref}{/if}
							{/each}
						</p>
					{/if}
				</section>
			{/each}
		{/each}
	</article>
</DocLayout>

<style>
	/* HERAM is petrol throughout; aubergine belongs to the guidance */
	.heram-article :global(:is(h1, h2, h4)) {
		color: var(--color-petrol);
	}

	.heram-article :global(li::marker) {
		color: var(--color-petrol);
	}

	.group-intro {
		font-family: var(--font-sans);
		font-size: 0.9375rem;
		color: var(--color-muted);
	}

	.entry {
		margin-top: 2.5rem;
	}

	.entry :global(h3) {
		margin-top: 0;
		scroll-margin-top: 1.5rem;
	}

	/* Concept bodies are demoted: their sections arrive as h4/h5 */
	.entry :global(h4) {
		margin-top: 1.5rem;
		font-size: 1rem;
	}

	.entry :global(h5) {
		color: var(--color-ink);
	}

	.entry-meta {
		font-family: var(--font-sans);
		font-size: 0.875rem;
		color: var(--color-muted);
	}

	.entry-meta span {
		font-weight: 600;
		color: var(--color-ink);
	}

	.gov-entry {
		margin-top: 1.75rem;
		padding-top: 1.25rem;
		border-top: 1px solid var(--color-line);
		scroll-margin-top: 1.5rem;
	}

	.gov-entry h4 {
		margin-top: 0;
		color: var(--color-ink);
		font-size: 1.0625rem;
		line-height: 1.35;
	}

	.gov-id {
		display: inline-block;
		min-width: 4rem;
		color: var(--color-petrol);
		font-variant-numeric: tabular-nums;
	}

	.gov-label {
		margin: 0.75rem 0 0.25rem;
		font-family: var(--font-sans);
		font-size: 0.8125rem;
		font-weight: 600;
		color: var(--color-muted);
	}

	/* The map is wider than the text column so its labels stay readable */
	.concept-map {
		max-width: 60rem;
		margin: 1rem 0 1rem;
		padding: 1.5rem;
		border: 1px solid var(--color-line);
		border-radius: 4px;
		background: var(--color-paper);
	}

	@media (max-width: 48rem) {
		.concept-map {
			padding: 1rem 0;
			border-left: 0;
			border-right: 0;
		}

		.concept-map-scroll {
			overflow-x: auto;
		}

		.concept-map-scroll :global(svg) {
			min-width: 44rem;
		}
	}
</style>
