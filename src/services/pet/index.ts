import { Request, Response, NextFunction } from "express"
import { Router } from "express"
import { checkCredentials, User } from "../../sql/UserModel"

import bcrypt from "bcrypt"
import createHttpError from "http-errors"
import { authenticateUser } from "../auth/GenerateToken"
import { authMiddleware } from "../auth/AuthMiddleware"
import { adminMiddleware } from "../auth/AdminMiddleware"
import sequelize from "../../database/connection"

import { cloudinary, parser } from "../utils/cloudinary"
import { Op } from "sequelize"
import Pet from "../../sql/PetModel"

const petsRouter = Router()

petsRouter
  .get(
    "/",
    authMiddleware,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const pets = await Pet.findAll()
        res.send(pets)
      } catch (error) {
        next(error)
      }
    }
  )

  .post(
    "/",
    authMiddleware,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const userId = req.user!.id
        const pet = await Pet.create({
          ...req.body,
          ownerId: userId,
        })

        if (pet) {
          res.send(pet)
        } else {
          next(createHttpError(500, "user was not created!"))
        }
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
        const pet = await Pet.findByPk(req.params.id)
        if (pet) {
          res.send(pet)
        } else {
          res.status(404)
        }
      } catch (error) {
        next(error)
      }
    }
  )

  .post(
    "/:id/avatar",
    authMiddleware,
    parser.single("petAvatar"),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const loggedInUser = req.user
        if (loggedInUser) {
          const pet = await Pet.findByPk(req.params.id)
          if (loggedInUser.id === pet?.ownerId) {
            if (pet && req.file) {
              pet.avatar = req.file.path
              const updatedPet = await pet.save()
              if (updatedPet) {
                res.send(updatedPet)
              } else {
                next(
                  createHttpError(400, "Could not save avatar try again later")
                )
              }
            } else {
              next(
                createHttpError(400, "Could not save avatar try again later")
              )
            }
          } else {
            next(createHttpError(400, "This is not your pet  "))
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
    "/:id",
    authMiddleware,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const loggedInUser = req.user

        if (loggedInUser) {
          const pet = await Pet.findByPk(req.params.id)
          if (loggedInUser.id === pet?.ownerId) {
            const [success, updatedPet] = await Pet.update(req.body, {
              where: { id: pet.id },
              returning: true,
            })
            if (success) {
              res.send(updatedPet)
            } else {
              next(createHttpError(400, "Failed to upload"))
            }
          } else {
            res.status(404).send({ message: "This is not your pet  " })
          }
        } else {
          res.status(404).send({ message: "no such user" })
        }
      } catch (error) {
        next(error)
      }
    }
  )

//   .put(
//     "/:id",
//     authMiddleware,
//     adminMiddleware,
//     async (req: Request, res: Response, next: NextFunction) => {
//       try {
//         const [success, updatedUser] = await User.update(req.body, {
//           where: { id: req.params.id },
//           returning: true,
//         })
//         if (success) {
//           res.send(updatedUser)
//         } else {
//           res.status(404).send({ message: "no such user" })
//         }
//       } catch (error) {
//         next(error)
//       }
//     }
//   )

export default petsRouter
