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

  .post(
    "/",
    authMiddleware,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const userId = req.user!.id

        const lisiting = await Listing.create({
          ...req.body,
          ownerId: userId,
        })

        if (lisiting) {
          res.send(lisiting)
        } else {
          next(createHttpError(500, "lisiting was not created!"))
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

  .put(
    "/:id",
    authMiddleware,

    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const userId = req.user!.id
        const listingId = req.params.id

        const lisiting = await Listing.findByPk(listingId)
        if (userId !== lisiting?.ownerId) {
          res.status(404).send({ message: "This is not your listing" })
          return
        }
        const [success, updatedListing] = await Listing.update(req.body, {
          where: { id: listingId },
          returning: true,
        })
        if (success) {
          res.send(updatedListing)
        } else {
          res.status(404).send({ message: "Can't update!" })
        }
      } catch (error) {
        next(error)
      }
    }
  )

export default listingsRouter
