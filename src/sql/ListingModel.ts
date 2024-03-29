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
import { ListingImage } from "./ListingImageModel"
import { User } from "./UserModel"

export class Listing extends Model<
  InferAttributes<Listing>,
  InferCreationAttributes<Listing>
> {
  declare id: CreationOptional<number>
  declare ownerId: ForeignKey<User["id"]>
  declare longitude: number | null
  declare latitude: number | null
  declare address: string | null
  declare description: string | null
  declare listingName: string
  declare pricePerNight: number
  declare owner?: NonAttribute<User>
  declare images?: NonAttribute<ListingImage[]>

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
      allowNull: true,
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
    listingName: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
    pricePerNight: {
      type: DataTypes.DOUBLE(),
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    defaultScope: {
      include: { model: ListingImage, as: "images" },
    },
    tableName: "listings",
    sequelize,
  }
)
