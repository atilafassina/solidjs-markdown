import { redirect } from "solid-start/server"
import { createCookieSessionStorage } from "solid-start/session"
import { ENV } from "~/lib/schema"

const storage = createCookieSessionStorage({
  cookie: {
    name: "RJ_session",
    // secure doesn't work on localhost for Safari
    // https://web.dev/when-to-use-local-https/
    secure: true,
    secrets: [ENV.SESSION_SECRET],
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
  },
})

export function getUserSession(request: Request) {
  return storage.getSession(request.headers.get("Cookie"))
}

export async function getUserId(request: Request) {
  const session = await getUserSession(request)
  const userId = session.get("userId")

  if (!userId || typeof userId !== "string") return null

  return userId
}

export async function requireUserId(
  request: Request,
  redirectTo: string = new URL(request.url).pathname
) {
  const session = await getUserSession(request)
  const userId = session.get("userId")
  if (!userId || typeof userId !== "string") {
    const searchParams = new URLSearchParams([["redirectTo", redirectTo]])

    throw redirect(`/?${searchParams}`)
  }

  return userId
}

export async function endSession(request: Request) {
  const session = await storage.getSession(request.headers.get("Cookie"))

  console.log("redirecting")

  const destroyedSession = await storage.destroySession(session)
  return destroyedSession
}

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
