import { Request, Response, NextFunction } from "express"
import { Router } from "express"
import createHttpError from "http-errors"
import { authMiddleware } from "../auth/AuthMiddleware"
import { Listing } from "../../sql/ListingModel"
import { Booking } from "../../sql/BookingModel"
import User from "../../sql/UserModel"

const bookingsRouter = Router()

bookingsRouter

  .get(
    "/booking/me",
    authMiddleware,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const loggedInUser = req.user!

        const bookings = await Booking.findAll({
          where: {
            ownerId: loggedInUser.id,
          },
        })
        if (bookings) {
          res.status(200).send(bookings)
        } else {
          next(createHttpError(500, "Couldn't retrieve bookings"))
        }
      } catch (error) {
        next(error)
      }
    }
  )

  .get(
    "/:listingId/booking",
    authMiddleware,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const listingId = req.params.listingId

        const listing = await Listing.findByPk(listingId, {
          include: {
            model: Booking,
            as: "bookings",
            include: [{ model: User, as: "owner" }],
          },
        })

        res.send(listing)
      } catch (error) {
        next(error)
      }
    }
  )

  .get(
    "/booking/:bookingId",
    authMiddleware,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const loggedInUser = req.user!
        const bookingId = req.params.bookingId

        const booking = await Booking.findOne({
          where: {
            id: bookingId,
            ownerId: loggedInUser.id,
          },
          include: { model: User, as: "owner" },
        })
        if (booking) {
          res.status(200).send(booking)
        } else {
          next(createHttpError(404, "booking not found!"))
        }
      } catch (error) {
        next(error)
      }
    }
  )

  .put(
    "/booking/:bookingId",
    authMiddleware,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const loggedInUser = req.user!
        const bookingId = req.params.bookingId

        const booking = await Booking.findByPk(bookingId, {
          include: { model: User, as: "owner" },
        })
        if (loggedInUser.id !== booking?.ownerId) {
          res.status(404).send({ message: "This is not your booking " })
          return
        }

        const [success, updatedBooking] = await Booking.update(req.body, {
          where: { id: bookingId },
          returning: true,
        })
        if (success) {
          res.send(updatedBooking)
        } else {
          next(createHttpError(400, "Can't update "))
        }
      } catch (error) {
        next(error)
      }
    }
  )

  .post(
    "/:listingId/booking",
    authMiddleware,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const userId = req.user!.id
        const listingId = req.params.listingId

        const booking = await Booking.create(
          {
            ...req.body,
            ownerId: userId,
            listingId: listingId,
          },
          { include: { model: User, as: "owner" } }
        )

        if (booking) {
          res.send(booking)
        } else {
          next(createHttpError(500, "booking was not created!"))
        }
      } catch (error) {
        next(error)
      }
    }
  )

  .delete(
    "/booking/:bookingId",
    authMiddleware,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const loggedInUser = req.user!
        const bookingId = req.params.bookingId
        const booking = await Booking.findByPk(bookingId)
        if (loggedInUser.id !== booking?.ownerId) {
          res.status(404).send({ message: "This is not your Booking" })
          return
        }
        await Booking.destroy({
          where: {
            id: bookingId,
          },
        })
        res.status(204).send()
      } catch (error) {
        res.status(500).send({ message: "Booking could not be deleted!" })
      }
    }
  )

export default bookingsRouter
