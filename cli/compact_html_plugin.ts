import { basename, normalize, dirname, join, extname } from 'https://deno.land/std@0.121.0/path/mod.ts'
import { compactHtml } from './compact_html.ts'

function toLocalDir(src: string) {
  const dir = normalize(dirname(src)).replace('.', '__')
  return join('.cache', 'components', dir)
}

export const compactHtmlPlugin = {
  name: 'compact-html',
  setup(build: any) {
    build.onResolve({ filter: /^.+\.html$/ }, async (args: any) => {
      const html = await Deno.readTextFile(args.path)
      const files = compactHtml(basename(args.path).split('.')[0], html)
      const dir = toLocalDir(args.path)
      try {
        Deno.mkdir(dir, { recursive: true })
      } catch {}
      await Deno.writeTextFile(join(dir, files.dataFile.name), files.dataFile.content)
      await Deno.writeTextFile(join(dir, files.componentFile.name), files.componentFile.content)
      return {
        path: join(dir, files.componentFile.name),
        namespace: 'compact-html'
      }
    })
    build.onLoad({ filter: /.*/, namespace: 'compact-html' }, 
      async (args: any) => {
        await Deno.readTextFile(args.path)
        return {
          contents: await Deno.readTextFile(args.path),
          loader: extname(args.path).slice(1),
          resolveDir: dirname(args.path)
        }
      }
    )
  }
}