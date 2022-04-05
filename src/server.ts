import express from 'express'

import cors from "cors"

import usersRouter from './services/user';

import createDefaultTables from "./scripts/create-tables";

const server = express()
const port = process.env.PORT || 3001
process.env.TS_NODE_DEV && require("dotenv").config()

server.use(express.json());
server.use(cors())




server.use("/user", usersRouter);

server.listen(port, async () => {
    await createDefaultTables();
    console.log(`✅ Server is running on port  ${port}`);
});

server.on("error", (error) => console.log(`❌ Server is failed  :  ${error}`));






