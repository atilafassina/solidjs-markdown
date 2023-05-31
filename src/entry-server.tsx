import {
  StartServer,
  createHandler,
  renderAsync,
} from "solid-start/entry-server"
import { getUserSession } from "./lib/session"
import { redirect } from "solid-start"

const protectedPaths = ["/in"]

export default createHandler(
  ({ forward }) => {
    return async (event) => {
      const session = await getUserSession(event.request)
      const userId = session.get("userId")
      const route = new URL(event.request.url).pathname

      if (protectedPaths.includes(route) && !userId) {
        return redirect("/")
      } else if (route === "/" && userId) {
        return redirect("/in")
      }

      return forward(event)
    }
  },
  renderAsync((event) => <StartServer event={event} />)
)
