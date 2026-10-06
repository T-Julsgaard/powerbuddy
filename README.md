# PowerBuddy

A self-contained electricity and water household simulation by GreenBuddies, built with plain JavaScript, CSS and HTML.

**[Open the live demo](https://t-julsgaard.github.io/powerbuddy/)**

The demo uses fictional households, synthetic consumption and illustrative prices. It runs entirely in your browser and stores simulation state locally when browser storage is available.

## Run locally

Open [`outputs/powerbuddy.html`](outputs/powerbuddy.html) in a modern browser. The single HTML file includes all its assets and works offline.

See [`outputs/README.md`](outputs/README.md) for the walkthrough, calculations, simulation controls and limitations.

## Develop

The source lives in `src/`. Rebuild the standalone output with Node.js:

```sh
node build.cjs
node tests/domain.cjs
```

The build and domain checks require no additional packages. Existing browser verification scripts in `tests/` use Playwright and a local Chrome installation; their runtime paths are specific to the development machine. Recorded screenshots and reports live in `outputs/verification/`.

## GitHub Pages

The [deployment workflow](.github/workflows/pages.yml) publishes the committed `outputs/powerbuddy.html` as both `index.html` and `powerbuddy.html` on every push to `main`. Rebuild and commit the output after changing source files. You can also run the workflow manually from GitHub Actions.

The bundled icon licensing is preserved in [`src/ICON-LICENSE.txt`](src/ICON-LICENSE.txt) and embedded in the HTML output.
