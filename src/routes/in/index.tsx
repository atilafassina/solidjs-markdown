import { useRouteData } from "solid-start"
import { createServerData$, redirect } from "solid-start/server"
import { getUserById } from "~/lib/auth/db"
import { userLoginSchema } from "~/lib/schema"
import { getUserSession } from "~/lib/auth/session"
import { z } from "zod"
import { Logout } from "~/components/logout"

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

export default function In() {
  const username = useRouteData<RouteData>()

  return (
    <main class="w-full p-4">
      <Logout />
      <article>
        <h2 class="text-2xl pb-5 text-neutral-400">
          Welcome to your dashboard{" "}
          <span class="bg-neutral-200 text-black px-1">{username}</span>
        </h2>
        <a href="/in/compose" class="hover:underline focus:underline">
          Compose a new note.
        </a>
      </article>
    </main>
  )
}
