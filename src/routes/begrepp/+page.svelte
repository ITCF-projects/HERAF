<script lang="ts">
	// The concept list now lives on the HERAM page; keep old links working.
	// A client-side forward instead of redirect() in a load function: when
	// prerendering, SvelteKit follows a redirect target literally and wrote a
	// duplicate page named "heram#grunden.html".
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';

	const target = `${resolve('/heram')}#grunden`;

	onMount(() => location.replace(target));
</script>

<svelte:head>
	<title>Begreppen har flyttat – HERAF</title>
	<meta name="robots" content="noindex" />
	<meta http-equiv="refresh" content="0;url={target}" />
	<link rel="canonical" href={target} />
</svelte:head>

<div class="mx-auto max-w-3xl px-4 py-14 sm:px-6">
	<p class="font-serif text-lg">
		Begreppen finns nu på sidan <a class="text-petrol underline underline-offset-2" href={target}>HERAM</a>.
	</p>
</div>
