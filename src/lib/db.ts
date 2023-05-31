import { type UserLoginForm, userLoginSchema, fullUserSchema } from "./schema"
import { getXataClient } from "./xata.codegen"
import bcrypt from "bcrypt"
import { createUserSession, endSession } from "./session"
import { nanoid } from "nanoid"

const xata = getXataClient()

export const getUserByEmail = async (email: string) => {
  return xata.db.users.filter({ username: email }).getFirst()
}

export const getUserById = async (id: string) => {
  try {
    return fullUserSchema.parse(await xata.db.users.filter({ id }).getFirst())
  } catch {
    return null
  }
}

export const createUser = async (
  user: UserLoginForm,
  request: Request,
  redirectTo = "/"
) => {
  const parsedForm = userLoginSchema.safeParse(user)

  if (!parsedForm.success) {
    throw new Error("Invalid form data")
  }

  const userExists = await getUserByEmail(user.username)

  if (userExists) {
    throw new Error(`User with username ${user.username} already exists`)
  }

  const hash = await bcrypt.hash(user.password, await bcrypt.genSalt())
  const parsedUser = fullUserSchema.parse(
    await xata.db.users.create({
      id: nanoid(),
      username: user.username,
      password: hash,
    })
  )

  return createUserSession(parsedUser.id, redirectTo, request)
}

export const signIn = async (
  userLogin: UserLoginForm,
  request: Request,
  redirectTo = "/"
) => {
  const { username, password } = userLogin
  const user = fullUserSchema.safeParse(await getUserByEmail(username))

  if (!user.success) {
    return null
  }

  const isCorrectPassword = await bcrypt.compare(password, user.data.password)

  if (!isCorrectPassword) return null

  return createUserSession(user.data.id, redirectTo, request)
}

export const signOut = async (request: Request) => {
  return await endSession(request)
}
