
import sequelize from "../../config/connect.js";
import { DataTypes } from "sequelize";

const Category = sequelize.define(
  "Category",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    }
  },
  {
    timestamps: false,
  }
);

export default Category;
