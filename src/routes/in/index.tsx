import { createEffect, createSignal } from "solid-js"
import { useRouteData } from "solid-start"
import {
  createServerAction$,
  createServerData$,
  redirect,
} from "solid-start/server"
import { getUserById, signOut } from "~/lib/db"
import { userLoginSchema } from "~/lib/schema"
import { getUserSession } from "~/lib/session"
import MdWorker from "~/lib/md-worker?worker"
import { countWords, countChars } from "~/lib/stat-helpers"

export function routeData() {
  return createServerData$(async (_, { request }) => {
    const session = await getUserSession(request)
    const user = await getUserById(session.get("userId"))

    const validateUser = userLoginSchema.safeParse(user)

    if (validateUser.success) {
      return validateUser.data.username
    }

    redirect("/")
    return ""
  })
}

export default function Home() {
  let mdw: Worker
  const username = useRouteData<typeof routeData>()
  const [, { Form }] = createServerAction$((_f: FormData, { request }) =>
    signOut(request)
  )
  const [note, setNote] = createSignal("")
  const charCount = () => countChars(note())
  const wordCount = () => countWords(note())

  createEffect(async () => {
    if (window.Worker) {
      mdw = mdw instanceof Worker ? mdw : new MdWorker()

      mdw.postMessage(note())

      const previewContainer = document.getElementById(
        "preview"
      ) as HTMLParagraphElement

      mdw.addEventListener("message", function (evt) {
        previewContainer.innerHTML = evt.data
      })
    }
  })

  return (
    <main class="w-full p-4">
      <Form class="fixed right-5">
        <button name="logout" type="submit" class="text-xs hover:underline">
          Logout
        </button>
      </Form>
      <h1 class="font-bold text-3xl">Hello {username()}</h1>
      <nav>
        <h2>Your notes</h2>
        <ul>
          <li>
            <strong>Your newest note!</strong>
            <a href="/in/compose">Edit</a>
          </li>
        </ul>
      </nav>
      <aside>
        <h2 class="font-bold text-xl">Composer</h2>
        <input type="text" placeholder="Thoughts on Life" />
        <button type="button">save</button>
        <div class="grid grid-cols-2">
          <div class="relative">
            <textarea
              placeholder="I should have eaten that burger..."
              class="p-2 h-full border-neutral-500 resize-y min-h-[10rem] w-full  text-white bg-neutral-900 rounded-sm"
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
              class="text-white h-full whitespace-break-spaces p-2 markdown-body bg-black"
            />
            <small class="absolute right-0 -bottom-5 font-mono">
              {charCount()} chars
            </small>
          </div>
        </div>
      </aside>
      <article>
        <h2 class="font-bold text-xl">Notes</h2>
        <ul>
          <li>
            <h3>Note number 123</h3>
            <table>
              <thead>
                <tr>
                  <th>Word Counter</th>
                  <th>Last Modified</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{wordCount()}</td>
                  <td>{new Date().toISOString()}</td>
                </tr>
              </tbody>
            </table>
          </li>
        </ul>
      </article>
    </main>
  )
}
