// posts.model.js
import sequelize from "../../config/connect.js";
import { DataTypes } from "sequelize";
import Users from "./users.model.js"; // Import the Users model
import Category from "./category.js"; // Import the Category model

const Posts = sequelize.define(
  "Posts",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    summary:{
      type:DataTypes.STRING,
      allowNull:false,
    },
    tags:{
      type:DataTypes.TEXT,
      allowNull:true,
    },
    postText: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING, 
      allowNull: true, 
    },
    userid: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

Posts.belongsTo(Users, { foreignKey: 'userid', as: "user" });
Posts.belongsTo(Category, { foreignKey: 'categoryId', as: "category" });

export default Posts;
