import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  DataTypes,
  ForeignKey,
} from "sequelize"

import sequelize from "../database/connection"
import { Listing } from "./ListingModel"

export class ListingImage extends Model<
  InferAttributes<ListingImage>,
  InferCreationAttributes<ListingImage>
> {
  declare id: CreationOptional<number>
  declare listingId: ForeignKey<Listing["id"]>
  declare url: string

  declare createdAt: CreationOptional<Date>
  declare updatedAt: CreationOptional<Date>
}

ListingImage.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    tableName: "listing_images",
    sequelize,
  }
)
