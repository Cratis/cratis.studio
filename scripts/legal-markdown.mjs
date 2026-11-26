// Copyright (c) Cratis. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

export const escape = text => text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
export const escapeQuotes = text => text.replaceAll('"', '&quot;').replaceAll("'", '&#39;');

export const inline = text => escape(text)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[^*])\*(?!\s)(.+?)\*(?!\*)/g, '$1<em>$2</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\[([^\]]+)\]\(((?:[^()\r\n]|\([^()\r\n]*\))*)\)/g, (_, label, href) => {
        // Reject whitespace, text-escaped angle brackets, and generated inline tags in the destination.
        if (/[<>\s]|&(?:lt|gt);/.test(href)) return label;
        const url = URL.parse(href);
        return ['http:', 'https:', 'mailto:'].includes(url?.protocol)
            ? `<a href="${escapeQuotes(href)}">${label}</a>`
            : label;
    });
