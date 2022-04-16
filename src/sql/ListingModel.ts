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

export class Listing extends Model<
  InferAttributes<Listing>,
  InferCreationAttributes<Listing>
> {
  declare id: CreationOptional<number>
  declare ownerId: ForeignKey<User["id"]>
  declare longitude: number
  declare latitude: number
  declare address: string | null

  declare description: string | null
  declare owner?: NonAttribute<User>

  declare createdAt: CreationOptional<Date>
  declare updatedAt: CreationOptional<Date>
}

Listing.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    longitude: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    latitude: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },

    description: {
      type: new DataTypes.TEXT(),
      allowNull: false,
    },
    address: {
      type: DataTypes.TEXT(),
      allowNull: true,
    },

    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    tableName: "listings",
    sequelize,
  }
)

User.hasMany(Listing, {
  onDelete: "CASCADE",
  sourceKey: "id",
  foreignKey: "ownerId",
  as: "listings",
})

Listing.belongsTo(User, { targetKey: "id" })
