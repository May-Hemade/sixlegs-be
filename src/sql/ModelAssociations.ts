import { Pet } from "./PetModel"
import User from "./UserModel"

User.hasMany(Pet, {
  onDelete: "CASCADE",
  sourceKey: "id",
  foreignKey: "ownerId",
  as: "pets", // this determines the name in `associations`!
})

Pet.belongsTo(User, { targetKey: "id" })
