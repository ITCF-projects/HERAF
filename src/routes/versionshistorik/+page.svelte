<script lang="ts">
	import { contentData } from '$lib/content-data.generated.js';
	import DocLayout, { type DocSection } from '$lib/components/DocLayout.svelte';
	import BrandMark from '$lib/components/BrandMark.svelte';

	const changelog = contentData.changelog;
	const sections: DocSection[] = changelog?.sections ?? [];

	let currentSection = $state('');
</script>

<svelte:head>
	<title>Versionshistorik – HERAF</title>
	<meta name="description" content="Ändringar i HERAF per version: Vägledningen, HERAM, iterationsmallen och webbplatsen." />
</svelte:head>

<DocLayout {sections} bind:currentSection>
	<BrandMark name="heraf" size={44} class="mb-5" />
	{#if changelog?.htmlContent}
		<article class="doc-article">
			{@html changelog.htmlContent}
		</article>
	{:else}
		<p class="text-muted">Versionshistoriken kunde inte laddas. Kör <code>npm run build:content</code> och ladda om sidan.</p>
	{/if}
</DocLayout>
