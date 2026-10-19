# Cratis Studio Landing Page

Simple static landing page for `cratis.studio`.

## Local development

This project uses a lightweight static server with **live reload**.

### 1) Install dependencies

Using Yarn:

```bash
yarn
```

Or npm:

```bash
npm install
```

### 2) Start dev server

Using Yarn:

```bash
yarn dev
```

Or npm:

```bash
npm run dev
```

The site is served at:

- `http://127.0.0.1:5173`

When you save changes to `index.html` or `styles.css`, the browser reloads automatically.

## How the dev script works

The `dev` script runs:

- `node ./node_modules/live-server/live-server.js . --port=5173 --no-browser`

Why this form is used:

- It avoids shell/shebang issues some environments can hit with `live-server` directly.
- It keeps startup consistent across macOS shells.

## Troubleshooting

### `yarn dev` exits with code `127`

- Run `yarn` first to ensure dependencies are installed.
- Then run `yarn dev` again.
- If needed, remove `node_modules` and reinstall:

```bash
rm -rf node_modules yarn.lock
yarn
```

## Notes

- This is a static site; no backend is required.
- Deploying can be done via any static hosting provider.

## Tailwind CSS

`index.html` uses Tailwind utility classes. The stylesheet is compiled ahead of time into `tailwind.css`, which is
committed because the site is served as-is (there is no build step on deploy). Do not edit it by hand. After you add
or change Tailwind classes in `index.html`, `signup.js` or `site-config.js`, or change `tailwind.config.js`, run:

```bash
npm run build:css
```

and commit the updated `tailwind.css`.

## Sitemap

`sitemap.xml` lists each page with a `<lastmod>` taken from the date of the last commit that changed it. After
committing page changes, regenerate it and commit the result:

```bash
npm run build:sitemap
```

## Legal pages

`terms-and-conditions.html` and `privacy-policy.html` are generated from Cratis Studio's legal documents
(`Legal/*.md` in Cratis/Studio) - the versioned set people accept when they sign up. Do not edit their content
by hand (this includes their titles and descriptions, which `scripts/build-legal-pages.mjs` sets); change the documents in Studio and run:

```bash
node scripts/build-legal-pages.mjs ../Studio/Legal
```

The *Sync legal documents* workflow does the same weekly (or on demand) and opens a pull request when they
changed.

