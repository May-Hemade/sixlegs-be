import { Response, NextFunction, RequestHandler, Request } from "express"
import createHttpError from "http-errors"
import { verifyJWTToken } from "./GenerateToken"

export const authMiddleware: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.headers.authorization) {
      next(createHttpError(401, "Please provide Bearer token on headers!"))
    } else {
      const token = req.headers.authorization.replace("Bearer ", "")
      const user = await verifyJWTToken(token)
      if (!user) return next(createHttpError(401, "Invalid Details"))
      req.user = {
        id: user.id,
        role: user.role,
      }
      next()
    }
  } catch (error) {
    next(createHttpError(401, "Token not valid!"))
  }
}
