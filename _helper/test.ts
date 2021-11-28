import { dirname } from 'https://deno.land/std/path/mod.ts'

export async function buildBrowserFile(fileName: string) {
  const { files } = await Deno.emit(`${fileName}`, {
    bundle: "module",
  })
  try {
    await Deno.mkdir(`./public/${dirname(fileName)}`, { recursive: true })
  } catch (e) {}
  
  await Deno.writeTextFile(`./public/${fileName}.html`, `<!DOCTYPE html>
<style>
body {
  white-space: pre-wrap;
}
</style>
<body></body>
<script>${files['deno:///bundle.js']}</script>`)
}

export function getTextById(id: string) {
  return () => document.getElementById(id)?.innerText;
}