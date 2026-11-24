<script lang="ts">
	import { resolve, asset } from '$app/paths';
	import { onMount } from 'svelte';
	import { contentData } from '$lib/content-data.generated.js';
	import BrandMark from '$lib/components/BrandMark.svelte';

	type Section = { id: string; title: string; level: number };

	const version = contentData.guidance?.version ?? '';
	const guideSections: Section[] = contentData.guidance?.sections ?? [];
	const vagledning = resolve('/vagledning');
	const heram = resolve('/heram');

	// The six steps, read from the guidance so the start page never drifts from it
	const steps = guideSections
		.filter((s) => /^steg-\d+-/.test(s.id))
		.map((s) => {
			const [, num, title] = s.title.match(/^Steg (\d+):\s*(.*)$/) ?? [];
			return { id: s.id, num: Number(num), title: title ?? s.title };
		});

	const phases = [
		{ id: 'starta-iterationen', title: 'Starta iterationen', steps: steps.filter((s) => s.num <= 3) },
		{ id: 'ta-fram-innehallet', title: 'Ta fram innehållet', steps: steps.filter((s) => s.num > 3) }
	];

	// HERAM's concept groups, in the order the guidance meets them
	const conceptTitles = new Map(contentData.concepts.map((c) => [c.slug, c.metadata.title as string]));
	const groups = contentData.heram.groups.map((g) => ({
		id: g.id,
		title: g.title,
		concepts: g.concepts.map((slug: string) => conceptTitles.get(slug)).filter(Boolean) as string[]
	}));

	// Absolute URL to the agent guide, so it can be pasted straight into an AI assistant
	const agentPath = asset('/heraf-agent.md');
	let agentUrl = $state(agentPath);
	let copied = $state(false);
	let copyTimer: ReturnType<typeof setTimeout>;

	onMount(() => {
		agentUrl = new URL(agentPath, window.location.href).href;
	});

	async function copyAgentUrl(event: MouseEvent) {
		try {
			await navigator.clipboard.writeText(agentUrl);
		} catch {
			// Clipboard API unavailable: select the URL so it can be copied manually
			const field = (event.currentTarget as HTMLElement).previousElementSibling as HTMLInputElement;
			field.select();
			return;
		}
		copied = true;
		clearTimeout(copyTimer);
		copyTimer = setTimeout(() => (copied = false), 2000);
	}
</script>

<svelte:head>
	<title>HERAF – referensarkitekturer för högre utbildning</title>
	<meta
		name="description"
		content="HERAF är ett gemensamt ramverk för att ta fram referensarkitekturer inom svensk högre utbildning: en vägledning för processen och modellen HERAM med begrepp och styrning."
	/>
</svelte:head>

<div class="mx-auto max-w-6xl px-4 pt-12 pb-16 sm:px-6 sm:pt-16 sm:pb-20">
	<header class="max-w-3xl">
		<h1 class="text-[2.25rem] leading-[1.1] font-bold tracking-tight text-ink sm:text-[3rem]">
			Ramverk för referens&shy;arkitekturer inom högre utbildning
		</h1>
		<p class="mt-5 max-w-2xl font-serif text-lg leading-relaxed text-ink sm:text-xl">
			HERAF, Higher Education Reference Architecture Framework, är ett gemensamt ramverk för att ta fram
			referensarkitekturer inom svensk högre utbildning. Ramverket består av två delar: Vägledningen,
			som beskriver processen, och HERAM, som beskriver begrepp och styrning.
		</p>

		<div class="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
			<a
				href="{vagledning}#snabbguide"
				class="rounded-md bg-aubergine px-4 py-2.5 font-semibold text-white no-underline hover:bg-[#3C2A54]"
			>
				Snabbguide
			</a>
			<p class="font-medium text-ink">
				Iterationsmall:
				<a class="text-petrol underline underline-offset-2" href={asset('/mallar/iterationsmall.docx')}>Word</a>
				·
				<a class="text-petrol underline underline-offset-2" href={asset('/mallar/iterationsmall.md')}>Markdown</a>
			</p>
		</div>

		<section class="mt-8 rounded-lg border border-petrol/25 bg-petrol-soft p-5 sm:p-6" aria-labelledby="ai-assistant">
			<h2 id="ai-assistant" class="text-lg font-bold text-ink">Arbeta med en AI-assistent</h2>
			<p class="mt-1.5 text-[0.9375rem] leading-relaxed text-ink">
				Kopiera länken och klistra in den i din AI-assistent. Assistenten får processen, styrningen,
				begreppen och iterationsmallen, och frågar om den ska fylla i iterationsmallen åt er eller vägleda er genom varje steg.
			</p>
			<div class="mt-3 flex gap-2">
				<input
					type="text"
					readonly
					value={agentUrl}
					aria-label="Länk till AI-instruktionen heraf-agent.md"
					class="min-w-0 flex-1 rounded-md border border-line bg-white px-3 py-2 font-mono text-sm text-ink"
					onfocus={(e) => e.currentTarget.select()}
				/>
				<button
					type="button"
					onclick={copyAgentUrl}
					class="flex-none rounded-md bg-petrol px-4 py-2 font-semibold text-white hover:opacity-90"
				>
					{copied ? 'Kopierad' : 'Kopiera länk'}
				</button>
			</div>
			<p class="sr-only" aria-live="polite">{copied ? 'Länken är kopierad' : ''}</p>
		</section>
	</header>

	<!-- The HERAF mark, enlarged: two pillars joined into one reference architecture -->
	<div class="framework" aria-label="HERAF:s två delar">
		<section class="pillar pillar-guide" aria-labelledby="pillar-guide">
			<BrandMark name="vagledning" size={28} class="text-white" />
			<h2 id="pillar-guide" class="pillar-title"><a href={vagledning}>Vägledningen</a></h2>
			<p class="pillar-lead">Processen för att ta fram en referensarkitektur, i iterationer.</p>

			{#each phases as phase (phase.id)}
				<h3 class="pillar-sub"><a href="{vagledning}#{phase.id}">{phase.title}</a></h3>
				<ol class="pillar-steps">
					{#each phase.steps as step (step.id)}
						<li>
							<a href="{vagledning}#{step.id}">
								<span class="step-n">{step.num}</span>
								<span>{step.title}</span>
							</a>
						</li>
					{/each}
				</ol>
			{/each}

			<p class="pillar-foot">
				<a href="{vagledning}#lopande-aktiviteter">Löpande aktiviteter</a> och
				<a href="{vagledning}#vad-ska-en-referensarkitektur-innehalla">krav på innehåll</a>
			</p>
		</section>

		<div class="bridge">
			<p>Referens&shy;arkitektur</p>
		</div>

		<section class="pillar pillar-heram" aria-labelledby="pillar-heram">
			<BrandMark name="heram" size={28} class="text-white" />
			<h2 id="pillar-heram" class="pillar-title"><a href={heram}>HERAM</a></h2>
			<p class="pillar-lead">Begrepp och styrning som referensarkitekturer enligt HERAF bygger på.</p>

			<ul class="pillar-groups">
				<li>
					<a href="{heram}#konceptkarta">Konceptkarta</a>
					<span>Hur begreppen hänger ihop</span>
				</li>
				{#each groups as group (group.id)}
					<li>
						<a href="{heram}#{group.id}">{group.title}</a>
						<span>{group.concepts.join(', ')}</span>
					</li>
				{/each}
				<li>
					<a href="{heram}#styrning">Styrning</a>
					<span>Principer, riktlinjer och regler</span>
				</li>
			</ul>
		</section>
	</div>

	<section class="mt-16 max-w-3xl border-t border-line pt-6 text-[0.9375rem] text-muted">
		<h2 class="font-semibold text-ink">För AI-agenter</h2>
		<p class="mt-1">
			<a class="text-petrol underline underline-offset-2" href={asset('/heraf-agent.md')}>heraf-agent.md</a> innehåller
			processen, arbetsregler, styrning, begrepp och iterationsmall i en fristående fil.
			En översikt finns i <a class="text-petrol underline underline-offset-2" href={asset('/llms.txt')}>llms.txt</a>.
		</p>
		{#if version}
			<p class="mt-3">
				Utkast, version {version}. Innehållet kan ändras. Se
				<a class="text-petrol underline underline-offset-2" href={resolve('/versionshistorik')}>versionshistoriken</a>
				för vad som har ändrats.
			</p>
		{/if}
	</section>
</div>

<style>
	/* Stacked on small screens: pillar, bridge, pillar (the mark turned 90°) */
	.framework {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		margin-top: 3.5rem;
	}

	@media (min-width: 60rem) {
		.framework {
			grid-template-columns: minmax(0, 1fr) 10rem minmax(0, 1fr);
			align-items: stretch;
			margin-top: 4.5rem;
		}
	}

	.pillar {
		padding: 1.75rem 1.5rem 1.5rem;
		border-radius: 0.875rem;
		color: #FFFFFF;
	}

	@media (min-width: 40rem) {
		.pillar {
			padding: 2.25rem 2.25rem 2rem;
		}
	}

	.pillar-guide { background: var(--color-aubergine); }
	.pillar-heram { background: var(--color-petrol); }

	.pillar a {
		color: inherit;
		text-decoration: none;
	}

	.pillar a:hover {
		text-decoration: underline;
		text-underline-offset: 0.18em;
	}

	.pillar :focus-visible {
		outline-color: #FFFFFF;
	}

	.pillar-title {
		margin-top: 0.875rem;
		font-size: 1.75rem;
		font-weight: 700;
		letter-spacing: -0.01em;
	}

	.pillar-lead {
		margin-top: 0.375rem;
		font-family: var(--font-serif);
		font-size: 1.0625rem;
		line-height: 1.5;
		color: rgb(255 255 255 / 0.86);
	}

	.pillar-sub {
		margin-top: 1.75rem;
		font-size: 0.875rem;
		font-weight: 600;
		color: rgb(255 255 255 / 0.78);
	}

	.pillar-steps {
		margin-top: 0.5rem;
		border-top: 1px solid rgb(255 255 255 / 0.18);
	}

	.pillar-steps a {
		display: flex;
		gap: 0.875rem;
		align-items: baseline;
		padding: 0.625rem 0;
		border-bottom: 1px solid rgb(255 255 255 / 0.18);
		font-size: 1.0625rem;
		font-weight: 600;
	}

	.step-n {
		flex: none;
		width: 1.25rem;
		font-family: var(--font-serif);
		font-size: 1.375rem;
		font-weight: 400;
		line-height: 1;
		font-variant-numeric: lining-nums tabular-nums;
		color: rgb(255 255 255 / 0.78);
	}

	.pillar-foot {
		margin-top: 1.5rem;
		font-size: 0.9375rem;
		color: rgb(255 255 255 / 0.86);
	}

	.pillar-foot a {
		text-decoration: underline;
		text-decoration-color: rgb(255 255 255 / 0.45);
		text-underline-offset: 0.18em;
	}

	.pillar-groups {
		margin-top: 1.5rem;
		border-top: 1px solid rgb(255 255 255 / 0.18);
	}

	.pillar-groups li {
		padding: 0.625rem 0;
		border-bottom: 1px solid rgb(255 255 255 / 0.18);
	}

	.pillar-groups a {
		font-size: 1.0625rem;
		font-weight: 600;
	}

	.pillar-groups span {
		display: block;
		margin-top: 0.125rem;
		font-size: 0.875rem;
		line-height: 1.45;
		color: rgb(255 255 255 / 0.8);
	}

	/* The bridge: grey like the bar in the mark, joining the two pillars */
	.bridge {
		display: grid;
		place-items: center;
		justify-self: center;
		width: 62%;
		min-height: 4.5rem;
		padding: 0.75rem 1rem;
		background: #9A94A8;
		text-align: center;
	}

	@media (min-width: 60rem) {
		.bridge {
			align-self: center;
			justify-self: stretch;
			width: auto;
			min-height: 7.5rem;
		}
	}

	.bridge p {
		font-size: 1rem;
		font-weight: 700;
		line-height: 1.25;
		color: var(--color-ink);
	}
</style>
