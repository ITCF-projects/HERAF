<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import BrandMark from '$lib/components/BrandMark.svelte';

	const notFound = $derived(page.status === 404);
</script>

<svelte:head>
	<title>{notFound ? 'Sidan finns inte' : 'Något gick fel'} – HERAF</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="mx-auto max-w-5xl px-4 py-14 sm:px-6 sm:py-20">
	<div class="max-w-2xl">
		<p class="text-sm font-semibold text-muted">Fel {page.status}</p>
		<h1 class="mt-2 text-4xl font-bold tracking-tight text-ink">
			{notFound ? 'Sidan finns inte' : 'Något gick fel'}
		</h1>
		<p class="mt-4 font-serif text-xl leading-relaxed text-ink">
			{#if notFound}
				Adressen <code class="rounded bg-shade px-1.5 py-0.5 font-sans text-base">{page.url.pathname}</code> leder
				inte till någon sida. Den kan ha flyttats när ramverket strukturerades om.
			{:else}
				Sidan kunde inte visas. Ladda om sidan eller börja från någon av delarna nedan.
			{/if}
		</p>
	</div>

	<div class="mt-12 grid max-w-3xl gap-8 sm:grid-cols-2">
		<a href={resolve('/vagledning')} class="group block border-t-4 border-aubergine pt-4 no-underline">
			<span class="flex items-center gap-2 text-xl font-bold text-aubergine group-hover:underline">
				<BrandMark name="vagledning" size={22} />
				Vägledningen
			</span>
			<span class="mt-1 block font-serif text-ink">Processen för att ta fram en referensarkitektur.</span>
		</a>
		<a href={resolve('/heram')} class="group block border-t-4 border-petrol pt-4 no-underline">
			<span class="flex items-center gap-2 text-xl font-bold text-petrol group-hover:underline">
				<BrandMark name="heram" size={22} />
				HERAM
			</span>
			<span class="mt-1 block font-serif text-ink">Begrepp, konceptkarta och styrning.</span>
		</a>
	</div>

	<p class="mt-12 text-[0.9375rem] text-muted">
		Eller gå till <a class="text-petrol underline underline-offset-2" href={resolve('/')}>startsidan</a>.
	</p>
</div>
