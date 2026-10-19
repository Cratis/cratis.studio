// Copyright (c) Cratis. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

// Regenerates sitemap.xml. Each page's <lastmod> is the date of the last commit that changed that page.
//
// Usage: node scripts/build-sitemap.mjs
//
// Run it after committing page changes, then commit sitemap.xml.

import { execFileSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';

const origin = 'https://cratis.studio';
const pages = [
    { file: 'index.html', path: '/' },
    { file: 'vision.html', path: '/vision.html' },
    { file: 'beta.html', path: '/beta.html' },
    { file: 'privacy-policy.html', path: '/privacy-policy.html' },
    { file: 'terms-and-conditions.html', path: '/terms-and-conditions.html' },
];

const lastModified = file => {
    const date = execFileSync('git', ['log', '-1', '--format=%cs', '--', file], { encoding: 'utf8' }).trim();
    if (!date) throw new Error(`${file} has no commit history, so it has no last modified date`);
    return date;
};

const entries = pages.map(page => [
    '    <url>',
    `        <loc>${origin}${page.path}</loc>`,
    `        <lastmod>${lastModified(page.file)}</lastmod>`,
    '    </url>',
].join('\n'));

writeFileSync('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join('\n')}
</urlset>
`);
console.log(`sitemap.xml: ${pages.length} pages`);
