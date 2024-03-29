import { NextFunction, Request, Response } from "express"
import { Error } from "./types"

export const badRequestHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err.status === 400) {
    console.log("I am the bad request handler", err)
    res.status(400).send({ message: err.message, errorsList: err.errorsList })
  } else {
    next(err)
  }
}

export const unauthorizedHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err.status === 401) {
    console.log("I am the unauthorized handler", err)
    res.status(401).send({ message: err.message })
  } else {
    next(err)
  }
}

export const notFoundHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err.status === 404) {
    console.log("I am the not found handler", err)
    res.status(404).send({ message: err.message })
  } else {
    next(err)
  }
}

export const genericErrorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("I am the error handler here is the error: ", err)
  res.status(500).send({ message: "Generic Server Error!" })
}

export const forbiddenHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err.status === 403) {
    res
      .status(403)
      .send({ message: err.message || "You are not allowed to do that!" })
  } else {
    next(err)
  }
}

export const catchAllHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(err)

  res.status(500).send({ message: "Generic Server Error" })
}
