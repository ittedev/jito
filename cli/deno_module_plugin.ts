// Copyright 2022 itte.dev. All rights reserved. MIT license.
// deno-lint-ignore-file no-explicit-any
import { relative, dirname, join, extname } from 'https://deno.land/std@0.121.0/path/mod.ts'
import { parse } from 'https://deno.land/x/module_url@v0.3.0/mod.ts'

function toLocalPath(src: string) {
  const { format, name, tag, path, } = parse(src)
  return join('.cache', 'deps', format, name, tag, path)
}

async function localize(module: any, dst: string) {
  await Deno.stat(dirname(dst))
    .catch(() => {
      Deno.mkdir(dirname(dst), { recursive: true })
      return Deno.stat(dirname(dst))
    })
    .then(async fileInfo => {
      if (fileInfo.isDirectory) {
        const cacheTextLines = (await Deno.readTextFile(module.local)).split('\n')
        module.dependencies
          .filter((dependency: any) => {
            try {
              parse(dependency.specifier)
              return true // absolute path
            } catch {
              return false // relative path
            }
          })
          .reverse()
          .forEach((dependency: any) => {
            const lineIndex = dependency.code.span.start.line
            const line = cacheTextLines[lineIndex]
            const start = dependency.code.span.start.character
            const end = dependency.code.span.end.character
            const path = relative(toLocalPath(dependency.code.specifier), dst)
            cacheTextLines[lineIndex] =
              line.slice(0, start) + '"' + path + '"' + line.slice(end)
          })
          
        await Deno.writeTextFile(dst, cacheTextLines.join('\n'))
      } else {
        throw Error(dirname(dst) + ' is not directory')
      }
    })
}

async function copyModule(module: any) {
  const dst = toLocalPath(module.specifier)
  await Deno.stat(dst)
    .catch(() => localize(module, dst))
}

export const denoModulePlugin = {
  name: 'deno-module',
  setup(build: any) {
    build.onResolve({ filter: /^https:\/\/.+\.(js|ts)$/ }, async (args: any) => {
      let dst: string
      try {
        dst = toLocalPath(args.path)
      } catch {
        return // not deno module
      }
      const ps = Deno.run({
        cmd: ['deno', 'info', '--json', args.path],
        stdout: 'piped',
      })
      const info = JSON.parse(new TextDecoder().decode(await ps.output()))
      ps.close()
      for (const module of info.modules) {
        await copyModule(module)
      }
      return {
        path: dst,
        namespace: 'deno-module'
      }
    })
    build.onLoad({ filter: /.*/, namespace: 'deno-module' }, 
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
