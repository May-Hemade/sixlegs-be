import express from "express"
import cors from "cors"
import usersRouter from "./services/user"
import { authenticateDatabase } from "./database/connection"
import {
  badRequestHandler,
  genericErrorHandler,
  notFoundHandler,
  unauthorizedHandler,
} from "./errorHandlers"
import petsRouter from "./services/pet"
import listingsRouter from "./services/lisiting"
import listEndpoints from "express-list-endpoints"
import reviewsRouter from "./services/review"
import bookingsRouter from "./services/booking"
import "./sql/ModelAssociations"
import "./services/auth/oauth"
import productsRouter from "./services/product"

const server = express()
const port = process.env.PORT || 3001
process.env.TS_NODE_DEV && require("dotenv").config()

server.use(express.json())
server.use(cors())

server.use("/user", usersRouter)
server.use("/pet", petsRouter)
server.use("/listing", listingsRouter)
server.use("/listing", reviewsRouter)
server.use("/listing", bookingsRouter)
server.use("/product", productsRouter)

server.use(badRequestHandler)
server.use(unauthorizedHandler)
server.use(notFoundHandler)
server.use(genericErrorHandler)

server.listen(port, async () => {
  authenticateDatabase()
  console.table(listEndpoints(server))
  console.log(`✅ Server is running on port  ${port}`)
})

server.on("error", (error) => console.log(`❌ Server stopped  :  ${error}`))
