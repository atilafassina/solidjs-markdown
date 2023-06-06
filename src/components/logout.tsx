import { createServerAction$, redirect } from "solid-start/server"
import { endSession } from "~/lib/auth/session"

export function Logout() {
  const [, { Form }] = createServerAction$(async (_: FormData, { request }) =>
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
