import db from "../../database/connection"
import { Request, Response, NextFunction, RequestHandler } from "express"
import { Router } from "express"
import { User } from "../../sql/UserModel"
const usersRouter = Router()

usersRouter
  .get("/", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await User.findAll()
      res.send(users)
    } catch (error) {
      next(error)
    }
  })

  .post(
    "/register",
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const user = await User.create({
          ...req.body,
          password: "hashme",
        })

        res.send(user)
      } catch (error) {
        next(error)
      }
    }
  )

  .get("/:id", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await User.findOne({ where: { id: req.params.id } })
      if (user) {
        res.send(user)
      } else {
        res.status(404)
      }
    } catch (error) {
      next(error)
    }
  })

  .put("/:id", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const [success, updatedUser] = await User.update(req.body, {
        where: { id: req.params.id },
        returning: true,
      })
      if (success) {
        res.send(updatedUser)
      } else {
        res.status(404).send({ message: "no such author" })
      }
    } catch (error) {
      next(error)
    }
  })

export default usersRouter
