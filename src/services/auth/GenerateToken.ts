import jwt from "jsonwebtoken"
import { UserPayload, User } from "../../types"

export const authenticateUser = async (user: User) => {
  const accessToken = await generateJWTToken({ id: user.id, role: user.role })
  return accessToken
}

const generateJWTToken = (user: { id: number; role: string }) =>
  new Promise<string>((resolve, reject) =>
    jwt.sign(
      user,
      process.env.JWT_SECRET!,
      { expiresIn: "1 week" },
      (err, token) => {
        if (err || !token) reject(err)
        else resolve(token)
      }
    )
  )

export const verifyJWTToken = (token: string): Promise<UserPayload> =>
  new Promise((res, rej) =>
    jwt.verify(token, process.env.JWT_SECRET!, (err, user) => {
      if (err) rej(err)
      else res(user as UserPayload)
    })
  )