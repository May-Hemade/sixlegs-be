import { NextFunction, RequestHandler, Request, Response } from "express"
import createHttpError from "http-errors"

export const adminMiddleware: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.user?.role === "admin") {
    next()
  } else {
    next(createHttpError(403, "Only admin is allowed!"))
  }
}
