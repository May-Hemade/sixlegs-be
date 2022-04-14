import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  DataTypes,
  ForeignKey,
  NonAttribute,
} from "sequelize"

import sequelize from "../database/connection"
import { User } from "./UserModel"

export class Pet extends Model<
  InferAttributes<Pet>,
  InferCreationAttributes<Pet>
> {
  declare id: CreationOptional<number>
  declare ownerId: ForeignKey<User["id"]>
  declare petName: string
  declare gender: string | null
  declare avatar: string | null
  declare species: string
  declare breed: string | null
  declare description: string | null
  declare dob: Date | null

  declare owner?: NonAttribute<User>

  declare createdAt: CreationOptional<Date>
  declare updatedAt: CreationOptional<Date>
}

Pet.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    petName: {
      type: new DataTypes.STRING(128),
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
    species: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
    breed: {
      type: new DataTypes.STRING(128),
      allowNull: true,
    },
    dob: {
      type: new DataTypes.DATE(),
      allowNull: true,
    },
    description: {
      type: new DataTypes.TEXT(),
      allowNull: true,
    },

    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    tableName: "pets",
    sequelize,
  }
)

export default Pet
