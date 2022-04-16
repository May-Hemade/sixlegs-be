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

import { Listing } from "../../sql/ListingModel"

const listingsRouter = Router()

listingsRouter
  .get(
    "/",
    authMiddleware,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const listings = await Listing.findAll()
        res.send(listings)
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
        const listing = await Listing.findByPk(req.params.id)
        if (listing) {
          res.send(listing)
        } else {
          res.status(404)
        }
      } catch (error) {
        next(error)
      }
    }
  )

  //   .post(
  //     "/:id/avatar",
  //     authMiddleware,
  //     parser.single("petAvatar"),
  //     async (req: Request, res: Response, next: NextFunction) => {
  //       try {
  //         res.json(req.file)
  //         const loggedInUser = req.user
  //         if (loggedInUser) {
  //           const pet = await Pet.findByPk(req.params.id)
  //           if (loggedInUser.id === pet?.ownerId) {
  //             if (pet && req.file) {
  //               pet.avatar = req.file.path
  //               const updatedPet = await pet.save()
  //               if (updatedPet) {
  //                 res.send(updatedPet)
  //               } else {
  //                 next(
  //                   createHttpError(400, "Could not save avatar try again later")
  //                 )
  //               }
  //             } else {
  //               next(
  //                 createHttpError(400, "Could not save avatar try again later")
  //               )
  //             }
  //           } else {
  //             next(createHttpError(400, "This is not your pet  "))
  //           }
  //         } else {
  //           next(createHttpError(404, "User not found"))
  //         }
  //       } catch (error) {
  //         next(error)
  //       }
  //     }
  //   )

  .put(
    "/:id",
    authMiddleware,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const loggedInUser = req.user

        if (loggedInUser) {
          const lisiting = await Listing.findByPk(req.params.id)
          if (loggedInUser.id === lisiting?.ownerId) {
            const [success, updatedListing] = await Listing.update(req.body, {
              where: { id: lisiting.id },
              returning: true,
            })
            if (success) {
              res.send(updatedListing)
            } else {
              next(createHttpError(400, "Failed to upload"))
            }
          } else {
            res.status(404).send({ message: "This is not your listing  " })
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

export default listingsRouter
