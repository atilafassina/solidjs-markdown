import { createServerAction$, redirect } from "solid-start/server"
import { signOut } from "~/lib/auth/db"
import { endSession } from "~/lib/session"

export function Logout() {
  const [, { Form }] = createServerAction$(async (_f: FormData, { request }) =>
    redirect("/", {
      headers: {
        "Set-Cookie": await endSession(request),
      },
    })
  )

  return (
    <Form class="fixed right-5">
      <button name="logout" type="submit" class="text-xs hover:underline">
        Logout
      </button>
    </Form>
  )
}
