import { Request, Response, NextFunction } from "express"
import { Router } from "express"
import createHttpError from "http-errors"
import { authMiddleware } from "../auth/AuthMiddleware"
import { Listing } from "../../sql/ListingModel"
import fetch from "node-fetch"
import User from "../../sql/UserModel"
import sequelize, { Op } from "sequelize"

const listingsRouter = Router()

listingsRouter
  .get(
    "/",
    authMiddleware,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
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
          include: { model: User, as: "owner" },
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

  // .get(
  //   "/searchCity",
  //   authMiddleware,
  //   async (req: Request, res: Response, next: NextFunction) => {
  //     try {
  //       const searchCity = req.params.city
  //       let response = await fetch(
  //         `{https://geocode.maps.co/search?q=${searchCity}}`
  //       )
  //       const result = await response.json()

  //       res.send(result)
  //     } catch (error) {
  //       next(error)
  //     }
  //   }
  // )

  .get(
    "/:id",
    authMiddleware,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const listing = await Listing.findByPk(req.params.id, {
          include: { model: User, as: "owner" },
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

export default listingsRouter
