// Copyright (c) Cratis. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { strictEqual } from 'node:assert/strict';
import { test } from 'node:test';
import { inline } from './legal-markdown.mjs';

for (const [kind, destination] of [
    ['JavaScript', 'javascript:alert(1)'],
    ['mixed-case JavaScript', 'JaVaScRiPt:alert(1)'],
    ['data', 'data:text/html,a'],
    ['VBScript', 'vbscript:example'],
    ['FTP', 'ftp://a.b/c'],
    ['protocol-relative', '//a.b/c'],
    ['fragment-only', '#privacy'],
    ['one with angle brackets', 'https://a.b/<c>'],
    ['one with inline markup', 'https://a.b/**bold**'],
    ['one with an attribute-like suffix', 'https://a.b/c" onmouseover="y'],
]) {
    test(`renders only the label for a ${kind} destination`, () => {
        strictEqual(inline(`[x](${destination})`), 'x');
    });
}

test('renders the relative privacy policy link as plain text', () => {
    strictEqual(inline('[privacy policy](privacy-policy.md)'), 'privacy policy');
});

for (const [kind, destination, href] of [
    ['HTTP', 'http://a.b/c', 'http://a.b/c'],
    ['HTTPS with a query string', 'https://a.b/c?d=1&e=2', 'https://a.b/c?d=1&amp;e=2'],
    ['HTTPS with quotes', `https://a.b/c"'`, 'https://a.b/c&quot;&#39;'],
    ['email', 'mailto:a@b.c', 'mailto:a@b.c'],
]) {
    test(`links a valid ${kind} destination with an escaped href`, () => {
        strictEqual(inline(`[x](${destination})`), `<a href="${href}">x</a>`);
    });
}

test('escapes raw HTML in text', () => {
    strictEqual(inline('<script>'), '&lt;script&gt;');
});

test('renders bold Markdown as strong text', () => {
    strictEqual(inline('**bold**'), '<strong>bold</strong>');
});
