import {
  StartServer,
  createHandler,
  renderAsync,
} from "solid-start/entry-server"
import { getUserSession } from "./lib/auth/session"
import { redirect } from "solid-start"

const protectedPaths = ["/in"]

function isProtected(route: string) {
  return protectedPaths.find((path) => (route.startsWith(path) ? true : false))
}

export default createHandler(
  ({ forward }) => {
    return async (event) => {
      const session = await getUserSession(event.request)
      const userId = session.get("userId")
      const path = new URL(event.request.url).pathname

      if (isProtected(path) && !userId) {
        return redirect("/")
      } else if (path === "/" && userId) {
        return redirect("/in")
      }

      return forward(event)
    }
  },

  renderAsync((event) => <StartServer event={event} />)
)
