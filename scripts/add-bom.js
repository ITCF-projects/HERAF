// Prepend a UTF-8 byte order mark to the published plain-text files in build/.
//
// Static hosts (GitHub Pages, vite preview) send .md and .txt without
// "charset=utf-8", so browsers fall back to Windows-1252 and show å, ä, ö
// as "Ã¥", "Ã¤", "Ã¶". A BOM makes every browser read the file as UTF-8, and
// unlike response headers it travels with the file. Sources stay BOM-free.
import fs from 'node:fs';
import path from 'node:path';

const BOM = Buffer.from([0xef, 0xbb, 0xbf]);
const root = path.join(process.cwd(), 'build');
const extensions = new Set(['.md', '.txt']);

function walk(dir) {
	return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
		const full = path.join(dir, entry.name);
		return entry.isDirectory() ? walk(full) : [full];
	});
}

if (!fs.existsSync(root)) {
	console.warn('⚠️  add-bom: build/ not found – skipped');
	process.exit(0);
}

let count = 0;
for (const file of walk(root)) {
	if (!extensions.has(path.extname(file).toLowerCase())) continue;
	if (path.basename(file) === 'robots.txt') continue; // ASCII, read by crawlers
	const bytes = fs.readFileSync(file);
	if (bytes.subarray(0, 3).equals(BOM)) continue;
	fs.writeFileSync(file, Buffer.concat([BOM, bytes]));
	count++;
}
console.log(`✅ add-bom: marked ${count} text file(s) in build/ as UTF-8`);
