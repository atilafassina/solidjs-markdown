import { createEffect, createSignal } from "solid-js"
import { countWords, countChars } from "~/lib/stat-helpers"
import { Logout } from "~/components/logout"
import MdWorker from "~/lib/md-worker?worker"

export default function Home() {
  let mdw: Worker
  const [note, setNote] = createSignal("")
  const charCount = () => countChars(note())
  const wordCount = () => countWords(note())

  createEffect(async () => {
    if (window.Worker) {
      mdw = mdw instanceof Worker ? mdw : new MdWorker()

      mdw.postMessage(note())
      const preview = document.getElementById("preview") as HTMLParagraphElement

      mdw.addEventListener("message", function (evt) {
        preview.innerHTML = evt.data
      })
    }
  })

  return (
    <>
      <Logout />
      <main class="w-full h-screen p-4 grid grid-rows-[auto_1fr_auto]">
        <aside class="text-neutral-400">
          <h2 class="font-bold text-xl">Composer</h2>
          <ul class="flex justify-end flex-row gap-5">
            <li>
              <span>{wordCount()}</span>{" "}
              <span>word{wordCount() > 1 ? "s" : ""}</span>
            </li>
            <li>
              <span>{charCount()}</span>{" "}
              <span>char{charCount() > 1 ? "s" : ""}</span>
            </li>
          </ul>
        </aside>

        <article class="grid grid-rows-2">
          <div class="relative">
            <textarea
              placeholder="I should have eaten that burger..."
              class="p-2 h-full border-neutral-500 resize-y min-h-[10rem] w-full  text-white bg-neutral-900 rounded-sm outline-neutral-600"
              value={note()}
              onKeyUp={({ currentTarget }) => setNote(currentTarget.value)}
            />
          </div>
          {/**
           * this paragraph will have HTML inserted.
           */}
          <div class="relative">
            <p
              id="preview"
              class="text-white h-full whitespace-break-spaces px-2 markdown-body bg-black"
            />
          </div>
        </article>
        <footer class="h-24 grid grid-rows-2 place-items-start font-mono">
          <a
            href="https://atila.io"
            target="_blank"
            rel="noopener"
            class="text-neutral-600"
          >
            subscribe
          </a>
          <span class="opacity-40">🔔</span>
        </footer>
      </main>
    </>
  )
}
