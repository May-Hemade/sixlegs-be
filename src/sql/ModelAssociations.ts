import { Booking } from "./BookingModel"
import { Listing } from "./ListingModel"
import { Pet } from "./PetModel"
import { Review } from "./ReviewModel"
import User from "./UserModel"

User.hasMany(Pet, {
  onDelete: "CASCADE",
  sourceKey: "id",
  foreignKey: "ownerId",
  as: "pets",
})

Pet.belongsTo(User, { targetKey: "id" })

User.hasMany(Listing, {
  onDelete: "CASCADE",
  sourceKey: "id",
  foreignKey: "ownerId",
  as: "listings",
})

Listing.belongsTo(User, { targetKey: "id", as: "owner" })

User.hasMany(Review, {
  onDelete: "CASCADE",
  sourceKey: "id",
  foreignKey: "ownerId",
  as: "reviews",
})

Review.belongsTo(User, { targetKey: "id" })

Listing.hasMany(Review, {
  onDelete: "CASCADE",
  sourceKey: "id",
  foreignKey: "listingId",
  as: "reviews",
})

Review.belongsTo(Listing, { targetKey: "id" })

User.hasMany(Booking, {
  onDelete: "CASCADE",
  sourceKey: "id",
  foreignKey: "ownerId",
  as: "bookings",
})

Booking.belongsTo(User, { targetKey: "id" })

Listing.hasMany(Booking, {
  onDelete: "CASCADE",
  sourceKey: "id",
  foreignKey: "listingId",
  as: "bookings",
})

Booking.belongsTo(Listing, { targetKey: "id" })
