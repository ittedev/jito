import * as esbuild from 'https://deno.land/x/esbuild@v0.14.39/mod.js'
import { denoPlugin } from 'https://deno.land/x/esbuild_deno_loader@0.5.0/mod.ts'

await esbuild.build({
  plugins: [denoPlugin()],
  entryPoints: ['./mod.ts'],
  outfile: './jito.js',
  bundle: true,
  minify: true,
  format: 'esm',
})

await esbuild.build({
  plugins: [denoPlugin()],
  entryPoints: ['./routing/mod.ts'],
  outfile: './routing.js',
  bundle: true,
  minify: true,
  format: 'esm',
})

esbuild.stop()
