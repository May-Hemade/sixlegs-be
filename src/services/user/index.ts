import db from "../../database/connection";
import { Request, Response, NextFunction, RequestHandler } from "express";
import { Router } from "express";

const usersRouter = Router()

usersRouter.get("/", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await db.query(`SELECT * FROM users`);
        res.send(users.rows);
    } catch (error) {
        next(error);
    }
})

    .post("/register", async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { first_name, last_name, email, password, gender } = req.body;
            const user = await db.query(
                `INSERT INTO users(first_name,last_name, email, pwd, gender ) VALUES('${first_name}','${last_name}','${email}','${password}','${gender}') RETURNING *;`
            );
            res.send(user.rows[0]);
        } catch (error) {
            next(error);
        }
    })

    .get("/:user_id", async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { user_id } = req.params;
            const users = await db.query(
                `SELECT user_id, first_name,last_name, email, avatar, gender  FROM users WHERE user_id=${user_id};`
            );
            const [found, ...rest] = users.rows;

            res.status(found ? 200 : 404).send(found);
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