<script lang="ts">
	// Self-hosted fonts: no requests to third parties
	import '@fontsource-variable/public-sans';
	import '@fontsource-variable/source-serif-4/opsz.css';
	import '@fontsource-variable/source-serif-4/opsz-italic.css';
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { page } from '$app/state';
	import { resolve, asset } from '$app/paths';
	import { createSidebarContext } from '$lib/sidebar-state.svelte';
	import { contentData } from '$lib/content-data.generated.js';
	import Sidebar from '$lib/Sidebar.svelte';
	import BrandMark from '$lib/components/BrandMark.svelte';

	let { children } = $props();

	// Concept/principle drawer used across the site
	createSidebarContext();

	const version = contentData.guidance?.version ?? '';

	const navItems = [
		{ path: resolve('/vagledning'), label: 'Vägledning', mark: 'vagledning', active: 'border-aubergine text-aubergine' },
		{ path: resolve('/heram'), label: 'HERAM', mark: 'heram', active: 'border-petrol text-petrol' }
	] as const;

	let isMobileMenuOpen = $state(false);

	function isActive(path: string) {
		return page.url.pathname === path || page.url.pathname.startsWith(path + '/');
	}
</script>

<svelte:window onkeydown={(e) => e.key === 'Escape' && (isMobileMenuOpen = false)} />

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="flex min-h-screen flex-col bg-paper">
	<!-- Sticky: the other part of the framework is always one click away. Height = --header-h -->
	<header class="sticky top-0 z-30 border-b border-line bg-paper">
		<div class="mx-auto flex h-14 max-w-[90rem] items-center justify-between gap-6 px-4 sm:px-6">
			<div class="flex items-center gap-4">
				<a href={resolve('/')} class="flex items-center gap-2 text-aubergine no-underline">
					<BrandMark name="heraf" size={22} />
					<span class="text-lg font-bold tracking-tight">HERAF</span>
					{#if version}<span class="text-xs text-muted">v{version}</span>{/if}
				</a>
				<span class="hidden h-6 w-px bg-line sm:block" aria-hidden="true"></span>
				<img src={asset('/img/itcf-logga.svg')} alt="ITCF" class="hidden h-6 w-auto sm:block" />
			</div>

			<nav class="hidden h-full md:flex" aria-label="Huvudnavigering">
				{#each navItems as item (item.path)}
					<a
						href={item.path}
						aria-current={isActive(item.path) ? 'page' : undefined}
						class="flex h-full items-center gap-2 border-b-2 px-4 text-sm font-medium
							{isActive(item.path)
								? item.active
								: 'border-transparent text-muted hover:text-ink'}"
					>
						<BrandMark name={item.mark} size={16} />
						{item.label}
					</a>
				{/each}
			</nav>

			<button
				class="rounded p-2 text-muted hover:bg-shade hover:text-ink md:hidden"
				aria-label={isMobileMenuOpen ? 'Stäng meny' : 'Öppna meny'}
				aria-expanded={isMobileMenuOpen}
				onclick={() => (isMobileMenuOpen = !isMobileMenuOpen)}
			>
				<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
					{#if isMobileMenuOpen}
						<path stroke-linecap="round" d="M6 18L18 6M6 6l12 12" />
					{:else}
						<path stroke-linecap="round" d="M4 6h16M4 12h16M4 18h16" />
					{/if}
				</svg>
			</button>
		</div>

		{#if isMobileMenuOpen}
			<nav class="border-t border-line md:hidden" aria-label="Huvudnavigering">
				{#each navItems as item (item.path)}
					<a
						href={item.path}
						aria-current={isActive(item.path) ? 'page' : undefined}
						onclick={() => (isMobileMenuOpen = false)}
						class="flex items-center gap-2 border-l-2 px-4 py-3 text-sm font-medium
							{isActive(item.path) ? item.active : 'border-transparent text-muted'}"
					>
						<BrandMark name={item.mark} size={16} />
						{item.label}
					</a>
				{/each}
			</nav>
		{/if}
	</header>

	<main class="flex-1">
		{@render children()}
	</main>

	<Sidebar />

	<footer class="border-t border-line bg-shade">
		<div class="mx-auto flex max-w-[90rem] flex-col gap-2 px-4 py-6 text-sm text-muted sm:flex-row sm:justify-between sm:px-6">
			<p>
				<strong class="font-semibold text-ink">HERAF</strong> Higher Education Reference Architecture Framework.
				<strong class="font-semibold text-ink">HERAM</strong> Higher Education Reference Architecture Model.
			</p>
			<p>Under utveckling. Innehållet är preliminärt och kan ändras.</p>
		</div>
	</footer>
</div>
