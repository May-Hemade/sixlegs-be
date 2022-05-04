import { Request, Response, NextFunction } from "express"
import { Router } from "express"
import createHttpError from "http-errors"
import { authMiddleware } from "../auth/AuthMiddleware"
import { Review } from "../../sql/ReviewModel"
import User from "../../sql/UserModel"

const reviewsRouter = Router()

reviewsRouter
  .get(
    "/:listingId/review",
    authMiddleware,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const listingId = req.params.listingId

        const reviews = await Review.findAll({
          where: {
            listingId: listingId,
          },
          include: { model: User, as: "owner" },
        })

        res.send(reviews)
      } catch (error) {
        next(error)
      }
    }
  )

  .put(
    "/review/:reviewId",
    authMiddleware,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const loggedInUser = req.user!
        const reviewId = req.params.reviewId

        const review = await Review.findByPk(reviewId)
        if (loggedInUser.id !== review?.ownerId) {
          res.status(404).send({ message: "This is not your Review  " })
          return
        }

        const [success, updatedReview] = await Review.update(req.body, {
          where: { id: reviewId },
          returning: true,
        })
        if (success) {
          res.send(updatedReview)
        } else {
          next(createHttpError(400, "Can't update "))
        }
      } catch (error) {
        next(error)
      }
    }
  )

  .post(
    "/:listingId/review",
    authMiddleware,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const userId = req.user!.id
        const listingId = req.params.listingId

        const review = await Review.create(
          {
            ...req.body,
            ownerId: userId,
            listingId: listingId,
          },
          { include: { model: User, as: "owner" } }
        )

        if (review) {
          res.send(review)
        } else {
          next(createHttpError(500, "Review was not created!"))
        }
      } catch (error) {
        next(error)
      }
    }
  )

  .delete(
    "/review/:reviewId",
    authMiddleware,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const loggedInUser = req.user!
        const reviewId = req.params.reviewId
        const review = await Review.findByPk(reviewId)
        if (loggedInUser.id !== review?.ownerId) {
          res.status(404).send({ message: "This is not your Review" })
          return
        }
        await Review.destroy({
          where: {
            id: reviewId,
          },
        })
        res.status(204).send()
      } catch (error) {
        res.status(500).send({ message: "Review could not be deleted!" })
      }
    }
  )

export default reviewsRouter
