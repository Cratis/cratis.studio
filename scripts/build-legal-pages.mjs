// Copyright (c) Cratis. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

// Builds terms-and-conditions.html and privacy-policy.html from the legal documents Cratis Studio ships
// (Cratis/Studio: Legal/*.md) - the same versioned documents Studio's lobby asks people to accept, so the
// site never says something different from what was agreed to.
//
// Usage: node scripts/build-legal-pages.mjs <path-to-Studio/Legal>
//
// The markdown is deliberately simple (headings, paragraphs, bullet lists, tables, bold, italics, inline code
// and links), so this converts exactly that and fails loudly on anything else rather than rendering it wrong.

import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const legalDirectory = process.argv[2];
if (!legalDirectory) {
    console.error('Usage: node scripts/build-legal-pages.mjs <path-to-Studio/Legal>');
    process.exit(1);
}

const escape = text => text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

const inline = text => escape(text)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[^*])\*(?!\s)(.+?)\*(?!\*)/g, '$1<em>$2</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\[([^\]]+)\]\((https?:[^)\s]+|mailto:[^)\s]+)\)/g, '<a href="$2">$1</a>');

const convert = markdown => {
    const lines = markdown.replace(/\r\n/g, '\n').split('\n');
    const title = lines.shift().replace(/^#\s+/, '');
    let subtitle = '';
    const sections = [{ heading: '', blocks: [] }];
    let paragraph = [];
    let list = null;
    let table = null;

    const flushParagraph = () => {
        if (paragraph.length > 0) sections.at(-1).blocks.push(`<p>${inline(paragraph.join(' '))}</p>`);
        paragraph = [];
    };
    const flushTable = () => {
        if (table) {
            const cells = row => row.replace(/^\||\|$/g, '').split('|').map(cell => inline(cell.trim()));
            const [header, , ...rows] = table;
            sections.at(-1).blocks.push([
                '<table class="legal-table">',
                `                    <thead><tr>${cells(header).map(cell => `<th>${cell}</th>`).join('')}</tr></thead>`,
                '                    <tbody>',
                ...rows.map(row => `                        <tr>${cells(row).map(cell => `<td>${cell}</td>`).join('')}</tr>`),
                '                    </tbody>',
                '                </table>',
            ].join('\n'));
        }
        table = null;
    };
    const flushList = () => {
        if (list) sections.at(-1).blocks.push(`<ul>\n${list.map(item => `                    <li>${inline(item)}</li>`).join('\n')}\n                </ul>`);
        list = null;
    };

    for (const line of lines) {
        if (!subtitle && /^\*\*Version .+\*\*$/.test(line.trim())) {
            subtitle = line.trim().slice(2, -2);
            continue;
        }

        if (/^##\s+/.test(line)) {
            flushParagraph(); flushList(); flushTable();
            sections.push({ heading: line.replace(/^##\s+/, ''), blocks: [] });
        } else if (/^###\s+/.test(line)) {
            flushParagraph(); flushList(); flushTable();
            sections.at(-1).blocks.push(`<h4>${inline(line.replace(/^###\s+/, ''))}</h4>`);
        } else if (/^\|/.test(line)) {
            flushParagraph(); flushList();
            table ??= [];
            table.push(line.trim());
        } else if (/^[-*]\s+/.test(line)) {
            flushParagraph();
            list ??= [];
            list.push(line.replace(/^[-*]\s+/, ''));
        } else if (/^\s{2,}\S/.test(line) && list) {
            list[list.length - 1] += ` ${line.trim()}`;
        } else if (line.trim() === '') {
            flushParagraph(); flushList(); flushTable();
        } else if (/^(#|>|```)/.test(line)) {
            throw new Error(`Unsupported markdown in the legal documents: "${line}"`);
        } else {
            flushList();
            paragraph.push(line.trim());
        }
    }

    flushParagraph(); flushList(); flushTable();
    if (!subtitle) throw new Error(`"${title}" has no **Version ...** line`);

    const body = sections
        .filter(section => section.heading || section.blocks.length > 0)
        .map(section => [
            '            <div class="section-block">',
            ...(section.heading ? [`                <h3>${inline(section.heading)}</h3>`] : []),
            ...section.blocks.map(block => `                ${block}`),
            '            </div>',
        ].join('\n'))
        .join('\n\n');

    return { title, subtitle, body };
};

const render = (file, label) => {
    const page = readFileSync(file.target, 'utf8');
    const { title, subtitle, body } = convert(readFileSync(join(legalDirectory, file.source), 'utf8'));
    const start = page.indexOf('<div class="page-header">');
    const end = page.indexOf('</main>');
    if (start < 0 || end < 0) throw new Error(`${file.target} does not have the expected page structure`);

    const content = `<div class="page-header">
                <span class="section-label section-label--blue">${label}</span>
                <h1 class="section-heading">${escape(title)}</h1>
                <p class="page-subtitle">${escape(subtitle)}</p>
            </div>

${body}
        </div>
    `;
    writeFileSync(file.target, page.slice(0, start) + content + page.slice(end));
    console.log(`${file.target}: ${subtitle}`);
};

render({ source: 'terms-and-conditions.md', target: 'terms-and-conditions.html' }, 'Terms &amp; Conditions');
render({ source: 'privacy-policy.md', target: 'privacy-policy.html' }, 'Privacy Policy');
