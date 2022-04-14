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

export class Booking extends Model<
  InferAttributes<Booking>,
  InferCreationAttributes<Booking>
> {
  declare id: CreationOptional<number>
  declare ownerId: ForeignKey<User["id"]>
  declare listingId: ForeignKey<Listing["id"]>
  declare checkInDate: Date
  declare checkOutDate: Date

  declare owner?: NonAttribute<User>

  declare createdAt: CreationOptional<Date>
  declare updatedAt: CreationOptional<Date>
}
Booking.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    checkInDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    checkOutDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },

    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    tableName: "bookings",
    sequelize,
  }
)

User.hasMany(Booking, {
  onDelete: "CASCADE",
  sourceKey: "id",
  foreignKey: "ownerId",
  as: "bookings", // this determines the name in `associations`!
})

Booking.belongsTo(User, { targetKey: "id" })

Listing.hasMany(Booking, {
  onDelete: "CASCADE",
  sourceKey: "id",
  foreignKey: "listingId",
  as: "bookings", // this determines the name in `associations`!
})

Booking.belongsTo(Listing, { targetKey: "id" })
