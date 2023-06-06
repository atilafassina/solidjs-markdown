import { useRouteData } from "solid-start"
import { createServerData$, redirect } from "solid-start/server"
import { getUserById } from "~/lib/auth/db"
import { userLoginSchema } from "~/lib/schema"
import { getUserSession } from "~/lib/auth/session"
import { z } from "zod"

type RouteData = z.infer<typeof userLoginSchema>["username"]

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
  const username = useRouteData<RouteData>()

  return (
    <main class="w-full p-4">
      <form class="fixed right-5">
        <button name="logout" type="submit" class="text-xs hover:underline">
          Logout
        </button>
      </form>
      <article>
        <h2 class="text-2xl pb-5 text-neutral-400">
          Welcome to your dashboard {username}
        </h2>
        <a href="/in/compose" class="hover:underline focus:underline">
          Compose a new note.
        </a>
      </article>
    </main>
  )
}
