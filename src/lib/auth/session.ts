import { redirect } from "solid-start/server"
import { createCookieSessionStorage } from "solid-start/session"
import { ENV } from "~/lib/schema"

const storage = createCookieSessionStorage({
  cookie: {
    name: "SOLID_session",
    secure: true,
    secrets: [ENV.SESSION_SECRET],
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
  },
})

export async function createUserSession(
  userId: string,
  redirectTo: string,
  request: Request
) {
  const session = await storage.getSession(request.headers.get("Cookie"))
  session.set("userId", userId)

  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await storage.commitSession(session),
    },
  })
}

export function getUserSession(request: Request) {
  return storage.getSession(request.headers.get("Cookie"))
}

export async function endSession(request: Request) {
  const session = await storage.getSession(request.headers.get("Cookie"))
  const destroyedSession = await storage.destroySession(session)

  return destroyedSession
}
