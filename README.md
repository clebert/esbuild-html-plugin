# esbuild-html-plugin

> An esbuild plugin that generates an HTML file.

This esbuild plugin allows the creation of an HTML file featuring output URLs of bundled assets,
while supporting customization of head and body elements.

## Installation

```
npm install esbuild-html-plugin
```

## Usage Example

```js
import * as esbuild from 'esbuild';

await esbuild.build({
  entryPoints: [`app.ts`],
  bundle: true,
  outdir: `dist`,
  publicPath: `/static`,
  plugins: [
    htmlPlugin({
      outfile: `index.html`,

      createHeadElements: () => [
        `<meta charset="utf-8" />`,
        `<meta name="viewport" content="width=device-width, initial-scale=1" />`,
        `<title>Example</title>`,
      ],

      createBodyElements: (outputUrls) =>
        outputUrls
          .filter((outputUrl) => outputUrl.endsWith(`.js`))
          .map((outputUrl) => `<script src="${outputUrl}"></script>`),
    }),
  ],
});
```

## Options

### `outfile` (required)

The output file's name for the generated HTML. This name will be combined with the `outdir` or the
dirname of the `outfile` from the esbuild options.

```
{
  outfile: `index.html`,
}
```

### `language` (optional)

The language attribute for the HTML tag.

```
{
  language: `en`,
}
```

### `createHeadElements` (optional)

A function that receives the output URLs of the bundled assets and returns an array of strings
representing the custom head elements.

```
{
  createHeadElements: (outputUrls) =>
    outputUrls
      .filter((outputUrl) => outputUrl.endsWith(`.css`))
      .map((outputUrl) => `<link rel="stylesheet" href="${outputUrl}">`),
}
```

### `createBodyElements` (optional)

A function that receives the output URLs of the bundled assets and returns an array of strings
representing the custom body elements.

```
{
  createBodyElements: (outputUrls) =>
    outputUrls
      .filter((outputUrl) => outputUrl.endsWith(`.js`))
      .map((outputUrl) => `<script src="${outputUrl}"></script>`),
}
```
