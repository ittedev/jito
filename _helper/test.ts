import { dirname } from 'https://deno.land/std/path/mod.ts'

export async function buildBrowserFile(fileName: string, htmlFileName?: string) {
  const { files } = await Deno.emit(fileName, {
    bundle: "module",
  })
  try {
    await Deno.mkdir(`./public/${dirname(fileName)}`, { recursive: true })
  } catch (e) {}

  const html = htmlFileName ? Deno.readTextFileSync(htmlFileName) : '<body></body>'
  
  Deno.writeTextFileSync(`./public/${fileName}.html`, `<!DOCTYPE html>
<title>${fileName}</title>
<style>
body {
  white-space: pre-wrap;
}
</style>
${html}
<script>${files['deno:///bundle.js']}</script>`)

  console.info('bundled:', fileName)
}
