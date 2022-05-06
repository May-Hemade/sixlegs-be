import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  DataTypes,
} from "sequelize"

import sequelize from "../database/connection"

export class Product extends Model<
  InferAttributes<Product>,
  InferCreationAttributes<Product>
> {
  declare id: CreationOptional<number>
  declare productName: string
  declare shop: string | null
  declare avatar: string | null
  declare website: string | null
  declare description: string | null
  declare createdAt: CreationOptional<Date>
  declare updatedAt: CreationOptional<Date>
}

Product.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    productName: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
    shop: {
      type: new DataTypes.STRING(150),
      allowNull: true,
    },
    avatar: {
      type: new DataTypes.TEXT(),
      allowNull: true,
    },
    website: {
      type: new DataTypes.TEXT(),
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
    tableName: "products",
    sequelize,
  }
)

export default Product
