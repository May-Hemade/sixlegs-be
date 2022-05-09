import e, { Request, Response, NextFunction } from "express"
import { Router } from "express"
import createHttpError from "http-errors"
import { authMiddleware } from "../auth/AuthMiddleware"
import { Listing } from "../../sql/ListingModel"
import User from "../../sql/UserModel"
import { Op } from "sequelize"
import { parser } from "../utils/cloudinary"
import { ListingImage } from "../../sql/ListingImageModel"

const listingsRouter = Router()

listingsRouter
  .get(
    "/",
    authMiddleware,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const listingId = req.query.id

        const listings = await Listing.findAll({
          include: { model: User, as: "owner" },
        })
        res.send(listings)
      } catch (error) {
        next(error)
      }
    }
  )

  .post(
    "/search",
    authMiddleware,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { lonStart, latStart, lonEnd, latEnd } = req.body

        console.log(req.body)

        const whereLatitude =
          latStart >= latEnd
            ? /* both edges on same side */
              {
                [Op.and]: {
                  [Op.lt]: latStart,
                  [Op.gte]: latEnd,
                },
              }
            : /* edges on opposite sides */
              {
                [Op.or]: {
                  [Op.gt]: latStart,
                  [Op.lte]: latEnd,
                },
              }

        const whereLongitude =
          lonStart <= lonEnd
            ? /* both edges on same side */
              {
                [Op.and]: {
                  [Op.gt]: lonStart,
                  [Op.lte]: lonEnd,
                },
              }
            : /* edges on opposite sides */
              {
                [Op.and]: {
                  [Op.gt]: lonStart,
                  [Op.lte]: lonEnd,
                },
              }

        const lisitings = await Listing.findAll({
          where: {
            ownerId: {
              [Op.not]: req.user!.id,
            },
            latitude: whereLatitude,
            longitude: whereLongitude,
          },
          include: [
            { model: User, as: "owner" },
            { model: ListingImage, as: "images" },
          ],
        })

        res.send(lisitings)
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
          next(createHttpError(500, "Lisiting was not created!"))
        }
      } catch (error) {
        next(error)
      }
    }
  )

  .post(
    "/:id/images",
    authMiddleware,
    parser.single("listingImage"),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const loggedInUser = req.user!
        const listingId = req.params.id

        const listing = await Listing.findOne({
          where: {
            id: listingId,
            ownerId: loggedInUser.id,
          },
        })
        if (listing && req.file) {
          const image = await ListingImage.create({
            listingId: listing.id,
            url: req.file.path,
          })

          if (image) {
            await listing.reload()
            res.send(listing)
          } else {
            next(createHttpError(400, "Could not upload image"))
          }
        } else {
          next(createHttpError(404, "Listing not found"))
        }
      } catch (error) {
        next(error)
      }
    }
  )

  .get(
    "/me",
    authMiddleware,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const loggedInUser = req.user!
        const listings = await Listing.findAll({
          where: {
            ownerId: loggedInUser.id,
          },
        })
        {
          res.send(listings)
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
        const listing = await Listing.findByPk(req.params.id, {
          include: [
            { model: User, as: "owner" },
            { model: ListingImage, as: "images" },
          ],
        })
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

  .put(
    "/:id",
    authMiddleware,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const loggedInUser = req.user

        if (loggedInUser) {
          const listing = await Listing.findByPk(req.params.id)
          if (loggedInUser.id === listing?.ownerId) {
            const [success, updatedListing] = await Listing.update(req.body, {
              where: { id: listing.id },
              returning: true,
            })
            if (success) {
              await listing.reload()
              res.send(listing)
            } else {
              next(createHttpError(400, "Failed to upload"))
            }
          } else {
            res.status(404).send({ message: "This is not your listing" })
          }
        } else {
          res.status(404).send({ message: "no such user" })
        }
      } catch (error) {
        next(error)
      }
    }
  )

  .delete(
    "/images/:id",
    authMiddleware,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const loggedInUser = req.user!
        const listingId = req.params.id
        const lisiting = await Listing.findOne({
          where: {
            id: listingId,
            ownerId: loggedInUser.id,
          },
        })

        if (lisiting && req.file) {
          const image = await ListingImage.destroy({})
        }

        res.status(204).send()
      } catch (error) {
        res.status(500).send({ message: "Couldn't delete" })
      }
    }
  )

export default listingsRouter
