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
import { Listing } from "./ListingModel"
import { User } from "./UserModel"

export class Review extends Model<
  InferAttributes<Review>,
  InferCreationAttributes<Review>
> {
  declare id: CreationOptional<number>
  declare ownerId: ForeignKey<User["id"]>
  declare listingId: ForeignKey<Listing["id"]>
  declare comment: string | null
  declare rating: number

  declare owner?: NonAttribute<User>

  declare createdAt: CreationOptional<Date>
  declare updatedAt: CreationOptional<Date>
}
Review.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    comment: {
      type: DataTypes.TEXT(),
      allowNull: false,
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    tableName: "reviews",
    sequelize,
  }
)
