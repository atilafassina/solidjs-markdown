import { createServerAction$ } from "solid-start/server"
import { signOut } from "~/lib/db"

export function Logout() {
  const [, { Form }] = createServerAction$((_f: FormData, { request }) =>
    signOut(request)
  )

  return (
    <Form class="fixed right-5">
      <button name="logout" type="submit" class="text-xs hover:underline">
        Logout
      </button>
    </Form>
  )
}
