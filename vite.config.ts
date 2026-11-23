import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, type Connect, type Plugin } from 'vite';

// @types/node isn't installed, so the request/response types are narrowed by hand
type Req = { url?: string };
type Res = { setHeader: (name: string, value: number | string | readonly string[]) => unknown };

// Dev and preview serve .md/.txt as "text/markdown" without a charset, so browsers
// read them as Windows-1252 and å/ä/ö break. Add charset=utf-8 to those responses.
// (The deployed site is covered by the BOM that scripts/add-bom.js adds to build/.)
function utf8TextFiles(): Plugin {
	const middleware: Connect.NextHandleFunction = (request, response, next) => {
		const req = request as unknown as Req;
		const res = response as unknown as Res;
		if (/\.(md|txt)(\?|$)/i.test(req.url ?? '')) {
			const setHeader = res.setHeader.bind(res);
			res.setHeader = (name: string, value: number | string | readonly string[]) => {
				if (
					name.toLowerCase() === 'content-type' &&
					typeof value === 'string' &&
					/^text\//i.test(value) &&
					!/charset=/i.test(value)
				) {
					value = `${value}; charset=utf-8`;
				}
				return setHeader(name, value);
			};
		}
		next();
	};

	return {
		name: 'utf8-text-files',
		configureServer: (server) => void server.middlewares.use(middleware),
		configurePreviewServer: (server) => void server.middlewares.use(middleware)
	};
}

export default defineConfig({
	plugins: [utf8TextFiles(), tailwindcss(), sveltekit()]
});
