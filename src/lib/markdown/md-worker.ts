import { marked } from "marked"

onmessage = ({ data: rawMd }: MessageEvent<string>) => {
  const html = marked.parse(rawMd, {
    mangle: false,
    headerIds: false,
  })

  postMessage(html)
}
