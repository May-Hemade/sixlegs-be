import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  DataTypes,
  NonAttribute,
} from "sequelize"
import sequelize from "../database/connection"
import { Booking } from "./BookingModel"
import { Listing } from "./ListingModel"
import { Pet } from "./PetModel"

import bcrypt from "bcrypt"
import { UserRole } from "../types"

export class User extends Model<
  InferAttributes<User>,
  InferCreationAttributes<User>
> {
  declare id: CreationOptional<number>
  declare pets?: NonAttribute<Pet[]>
  declare listings?: NonAttribute<Listing[]>
  declare bookings?: NonAttribute<Booking[]>
  declare firstName: string
  declare lastName: string
  declare gender: string | null
  declare email: string
  declare avatar: string | null
  declare role: CreationOptional<string>
  declare password: string
  declare description: string | null
  declare googleId: string | null
  declare createdAt: CreationOptional<Date>
  declare updatedAt: CreationOptional<Date>
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    firstName: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
    lastName: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
    email: {
      type: new DataTypes.STRING(255),
      allowNull: false,
    },
    password: {
      type: new DataTypes.STRING(255),
      allowNull: false,
    },
    gender: {
      type: new DataTypes.STRING(50),
      allowNull: true,
    },
    avatar: {
      type: new DataTypes.TEXT(),
      allowNull: true,
    },

    role: {
      type: new DataTypes.STRING(55),
      allowNull: false,
      defaultValue: UserRole.User,
    },
    description: {
      type: new DataTypes.TEXT(),
      allowNull: true,
    },
    googleId: {
      type: new DataTypes.TEXT(),
      allowNull: true,
    },

    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    defaultScope: {
      attributes: { exclude: ["password"] },
    },
    tableName: "users",
    sequelize,
  }
)

export const checkCredentials = async function (
  email: string,
  plainPw: string
): Promise<any> {
  const user = await User.findOne({ where: { email: email } })

  if (user) {
    const isMatch = await bcrypt.compare(plainPw, user.password)
    if (isMatch) {
      return user
    } else {
      return null
    }
  } else {
    return null
  }
}

export default User
