import type {Plugin} from 'esbuild';

import {minify} from 'html-minifier';
import {writeFile} from 'node:fs/promises';
import {dirname, join, relative} from 'node:path';

export interface HtmlPluginOptions {
  /**
   * The output file's name for the generated HTML. This name will be combined
   * with the `outdir` or the dirname of the `outfile` from the esbuild options.
   */
  readonly outfile: string;

  /**
   * The language attribute for the HTML tag.
   */
  readonly language?: string;

  /**
   * A function that receives the output URLs of the bundled assets and returns
   * an array of strings representing the custom head elements.
   */
  readonly createHeadElements?: (
    outputUrls: readonly string[],
  ) => readonly string[];

  /**
   * A function that receives the output URLs of the bundled assets and returns
   * an array of strings representing the custom body elements.
   */
  readonly createBodyElements?: (
    outputUrls: readonly string[],
  ) => readonly string[];
}

export function htmlPlugin({
  outfile,
  language,
  createHeadElements,
  createBodyElements,
}: HtmlPluginOptions): Plugin {
  return {
    name: `esbuild-html-plugin`,

    setup(build) {
      const {initialOptions: options} = build;

      options.metafile = true;

      build.onEnd(async (result) => {
        const outdir = options.outdir ?? dirname(options.outfile!);
        const publicPath = options.publicPath || `/`;

        const outputUrls = (
          result.metafile ? Object.keys(result.metafile.outputs) : []
        ).map((outputName) => join(publicPath, relative(outdir, outputName)));

        const html = [
          `<!DOCTYPE html>`,
          language ? `<html lang="${language}">` : `<html>`,
          `<head>`,
          ...(createHeadElements?.(outputUrls) ?? []),
          `</head>`,
          `<body>`,
          ...(createBodyElements?.(outputUrls) ?? []),
          `</body>`,
          `</html>`,
        ].join(`\n`);

        await writeFile(
          join(outdir, outfile),
          minify(html, {
            caseSensitive: true,
            collapseWhitespace: true,
            conservativeCollapse: true,
            decodeEntities: true,
            keepClosingSlash: true,
            minifyCSS: options.minify,
            minifyJS: options.minify,
            removeComments: options.minify,
            removeScriptTypeAttributes: true,
            removeStyleLinkTypeAttributes: true,
          }),
          {encoding: `utf-8`},
        );
      });
    },
  };
}
