import { Request, Response, NextFunction } from "express"
import { Router } from "express"

import { authMiddleware } from "../auth/AuthMiddleware"

import Product from "../../sql/ProductModel"
import createHttpError from "http-errors"

const productsRouter = Router()

productsRouter
  .get(
    "/",
    authMiddleware,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const products = await Product.findAll()
        res.send(products)
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
        console.log("hey")
        const product = await Product.create(req.body)

        if (product) {
          res.send(product)
        } else {
          next(createHttpError(500, "Product was not created!"))
        }
      } catch (error) {
        next(error)
      }
    }
  )
export default productsRouter
