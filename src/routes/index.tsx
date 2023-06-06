import { Show, createSignal } from "solid-js"
import { useParams } from "solid-start"
import {
  createServerAction$,
  createServerData$,
  redirect,
} from "solid-start/server"
import { FormError } from "solid-start/data"
import { createUser, signIn } from "~/lib/auth/db"
import { loginFormSchema } from "~/lib/schema"
import { getUserSession } from "~/lib/auth/session"

async function loginAction(
  formData: FormData,
  { request }: Record<"request", Request>
) {
  const form = Object.fromEntries(formData.entries())
  const fields = loginFormSchema.safeParse(form)

  if (!fields.success) return null

  const { loginType, username, password, redirectTo } = fields.data

  switch (loginType) {
    case "login": {
      try {
        return await signIn({ username, password }, request, redirectTo)
      } catch {
        throw new FormError(`Username/Password combination is incorrect`, {
          fields,
        })
      }
    }
    case "register": {
      try {
        return await createUser({ username, password }, request, redirectTo)
      } catch {
        throw new FormError(
          `Something went wrong trying to create a new user`,
          { fields }
        )
      }
    }

    default: {
      throw new FormError(`Login type invalid`, { fields })
    }
  }
}

export function routeData() {
  return createServerData$(async (_, { request }) => {
    const session = await getUserSession(request)

    if (Boolean(session.get("userId"))) {
      return redirect("/in")
    }

    return {}
  })
}

export default function Login() {
  const params = useParams()
  const [loggingIn, { Form }] = createServerAction$(loginAction)
  const [formType, setFormType] = createSignal<"login" | "register">("login")

  return (
    <main>
      <header class="py-5 grid place-items-center bg-gradient-to-tr from-cyan-300 via-blue-400 to-slate-600 ">
        <h1 class="text-6xl text-black">
          {formType().charAt(0).toLocaleUpperCase() + formType().substring(1)}
        </h1>
      </header>
      <article class="mt-32 grid place-items-center relative">
        <Form class="py-3 px-5 border border-neutral-600 rounded-sm relative">
          <input
            type="hidden"
            name="redirectTo"
            value={params.redirectTo ?? "/"}
          />
          <fieldset class="absolute -top-3 right-2 bg-neutral-400 text-black px-2  hover:bg-cyan-300 hover:text-black">
            <legend class="sr-only">Action type selection</legend>
            <input
              id="loginTrigger"
              type="radio"
              name="loginType"
              value="login"
              class="hidden"
              checked={formType() === "login"}
              onChange={() => {
                setFormType("login")
              }}
            />
            <label
              for="loginTrigger"
              class={`${formType() === "login" ? "hidden" : "block"}`}
            >
              Login
            </label>
            <input
              id="registerTrigger"
              type="radio"
              name="loginType"
              value="register"
              class="hidden"
              checked={formType() === "register"}
              onChange={() => {
                setFormType("register")
              }}
            />
            <label
              for="registerTrigger"
              class={`${formType() === "register" ? "hidden" : "block"}`}
            >
              Register
            </label>
          </fieldset>
          <fieldset class="py-10 grid gap-8">
            <legend class="sr-only">User data</legend>
            <div class="group w-80">
              <label
                for="username-input"
                class="block text-neutral-400 group-focus-within:text-white"
              >
                Username
              </label>
              <input class="w-full" name="username" placeholder="Solid Snake" />
            </div>
            <Show when={loggingIn.error?.fieldErrors?.username}>
              <p role="alert">{loggingIn.error.fieldErrors.username}</p>
            </Show>
            <div class="group">
              <label
                class="block text-neutral-400 group-focus-within:text-white"
                for="password-input"
              >
                Password
              </label>
              <input
                class="w-full"
                name="password"
                type="password"
                placeholder="******"
              />
            </div>
            <Show when={loggingIn.error?.fieldErrors?.password}>
              <p role="alert">{loggingIn.error.fieldErrors.password}</p>
            </Show>
            <Show when={loggingIn.error}>
              <p role="alert" id="error-message">
                {loggingIn.error.message}
              </p>
            </Show>
          </fieldset>
          <button
            type="submit"
            class="border border-neutral-600 text-neutral-400 py-2 px-4 block w-full hover:border-cyan-300 hover:text-cyan-300 rounded-sm"
          >
            {formType().charAt(0).toLocaleUpperCase() + formType().substring(1)}
          </button>
        </Form>
      </article>
    </main>
  )
}
