import { Options, Sequelize } from "sequelize"

const { POSTGRES_URI } = process.env

if (!POSTGRES_URI) {
  throw "Postgres URI not found"
}

const options: Options = {
  dialect: "postgres",
  logging: false,
}

if (process.env.REQUIRE_SSL === "true") {
  options.dialectOptions = {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  }
}

const sequelize = new Sequelize(POSTGRES_URI, options)

export const authenticateDatabase = async () => {
  try {
    await sequelize.authenticate()
    /**
     * alter:true -> if there is any change apply without dropping tables
     * force:true -> apply changes and drop tables
     */
    await sequelize.sync({ alter: true })
    console.log("✅ Connection has been established successfully.")
  } catch (error) {
    console.log(error)
    console.error("❌ Unable to connect to the database:", error)
  }
}

export default sequelize
