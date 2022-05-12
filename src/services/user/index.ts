import { Request, Response, NextFunction } from "express"
import { Router } from "express"
import { checkCredentials, User } from "../../sql/UserModel"

import bcrypt from "bcrypt"
import createHttpError from "http-errors"
import { authenticateUser } from "../auth/GenerateToken"
import { authMiddleware } from "../auth/AuthMiddleware"
import { adminMiddleware } from "../auth/AdminMiddleware"
import sequelize from "../../database/connection"

import { parser } from "../utils/cloudinary"
import { Op } from "sequelize"
import passport from "passport"

const usersRouter = Router()

usersRouter.get(
  "/",
  authMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await User.findAll()
      res.send(users)
    } catch (error) {
      next(error)
    }
  }
)

usersRouter
  .get(
    "/search",
    authMiddleware,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const users = await User.findAll({
          where: sequelize.where(
            sequelize.fn(
              "concat",
              sequelize.col("firstName"),
              " ",
              sequelize.col("lastName")
            ),
            {
              [Op.like]: `%${req.body.query}%`,
            }
          ),
        })

        res.send(users)
      } catch (error) {
        next(error)
      }
    }
  )

  .post(
    "/register",
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)

        const user = await User.create({
          ...req.body,
          password: hashedPassword,
        })

        if (user) {
          res.send(user)
        } else {
          next(createHttpError(500, "user was not created!"))
        }
      } catch (error) {
        next(error)
      }
    }
  )

  .post("/login", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body

      const user = await checkCredentials(email, password)

      if (user) {
        const accessToken = await authenticateUser(user)
        res.send({ accessToken, profile: user })
      } else {
        next(createHttpError(401, "Credentials not ok!"))
      }
    } catch (error) {
      next(error)
    }
  })

  .get(
    "/me",
    authMiddleware,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const loggedInUser = req.user
        if (loggedInUser) {
          const user = await User.findByPk(loggedInUser.id)
          if (user) {
            res.status(200).send(user)
          } else {
            next(createHttpError(404, "user not found!"))
          }
        } else {
          next(createHttpError(400))
        }
      } catch (error) {
        next(error)
      }
    }
  )

  .get(
    "/googleLogin",
    passport.authenticate("google", { scope: ["email", "profile"] })
  )

  .get(
    "/googleRedirect",
    passport.authenticate("google"),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        console.log("TOKENS: ", req.user?.token)

        res.redirect(`${process.env.FE_URL}?accessToken=${req.user?.token}`)
      } catch (error) {
        next(error)
      }
    }
  )

  .get(
    "/:id",
    authMiddleware,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const user = await User.findByPk(req.params.id)
        if (user) {
          res.send(user)
        } else {
          res.status(404)
        }
      } catch (error) {
        next(error)
      }
    }
  )

  .post(
    "/me/avatar",
    authMiddleware,
    parser.single("userAvatar"),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const loggedInUser = req.user
        if (loggedInUser) {
          const user = await User.findByPk(loggedInUser.id)
          if (user && req.file) {
            user.avatar = req.file.path
            const updatedUser = await user.save()
            if (updatedUser) {
              res.send(updatedUser)
            } else {
              next(
                createHttpError(400, "Could not save avatar try again later")
              )
            }
          } else {
            next(createHttpError(400, "Could not save avatar try again later"))
          }
        } else {
          next(createHttpError(404, "User not found"))
        }
      } catch (error) {
        next(error)
      }
    }
  )

  .put(
    "/me",
    authMiddleware,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const loggedInUser = req.user
        if (loggedInUser) {
          const [success, updatedUser] = await User.update(req.body, {
            where: { id: loggedInUser.id },
            returning: true,
          })
          if (success) {
            res.send(updatedUser)
          } else {
            res.status(404).send({ message: "no such user" })
          }
        }
      } catch (error) {
        next(error)
      }
    }
  )

  .post(
    "/me/changePassword",
    authMiddleware,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const loggedInUser = req.user!

        const { currentPassword, newPassword } = req.body
        const user = await User.scope("withPassword").findByPk(loggedInUser.id)
        if (!user) {
          res.status(404).send({ message: "no such user" })
          return
        }

        const passwordsMatch = await bcrypt.compare(
          currentPassword,
          user.password
        )

        if (!passwordsMatch) {
          res.status(400).send({ message: "Passwords don't match" })
          return
        }
        const newHashedPassword = await bcrypt.hash(newPassword, 10)

        const [success] = await User.update(
          { password: newHashedPassword },
          {
            where: { id: loggedInUser.id },
          }
        )
        if (success) {
          res.sendStatus(200)
        } else {
          res.status(500).send({ message: "Could not update password" })
        }
      } catch (error) {
        next(error)
      }
    }
  )

  .put(
    "/:id",
    authMiddleware,
    adminMiddleware,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const [success, updatedUser] = await User.update(req.body, {
          where: { id: req.params.id },
          returning: true,
        })
        if (success) {
          res.send(updatedUser)
        } else {
          res.status(404).send({ message: "no such user" })
        }
      } catch (error) {
        next(error)
      }
    }
  )

export default usersRouter
