import db from "../../database/connection";
import { Request, Response, NextFunction, RequestHandler } from "express";
import { Router } from "express";
import { User } from "../../sql/UserModel";
import { body } from "express-validator";

const usersRouter = Router()

usersRouter.get("/", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await User.findAll()
        res.send(users);
    } catch (error) {
        next(error);
    }
})

    .post("/register", async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = await User.create({
                ...req.body,
                password: "hashme"

            })

            res.send(user);
        } catch (error) {
            next(error);
        }
    })

    .get("/:user_id", async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { user_id } = req.params;
            const user = await User.findOne({ where: { id: user_id } })
            if (user) {
                res.send(user)
            } else {
                res.status(404)
            }
        } catch (error) {
            next(error);
        }
    })

    .put("/:user_id", async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { user_id } = req.params;
            const { first_name, last_name, email, gender, avatar } = req.body;
            const authors = await db.query(
                `UPDATE authors
			 SET first_name ='${first_name}',
			 last_name = '${last_name}',
			 email = '${email}',
             gender = '${gender}',
             avatar = '${avatar}',
			 updated_at = NOW()
			 WHERE author_id=${user_id} RETURNING *;`
            );
            const [found, ...rest] = authors.rows;
            res.status(found ? 200 : 400).send(found);
        } catch (error) {
            next(error);
        }
    })

export default usersRouter;