// comment.model.js
import sequelize from "../../config/connect.js";
import { DataTypes } from "sequelize";
import Users from "./users.model.js";
// import Post from "./posts.model.js";

const Comment = sequelize.define("Comment", {
 id: {
 type: DataTypes.INTEGER,
 primaryKey: true,
 autoIncrement: true,
 },
 comment: {
 type: DataTypes.TEXT,
 allowNull: false,
 },
 userId: {
 type: DataTypes.INTEGER,
 allowNull: false,
 },
 postId: {
 type: DataTypes.INTEGER,
 allowNull: false,
 },
 status: {
 type: DataTypes.BOOLEAN,
 defaultValue: false,
 },
});

Comment.belongsTo(Users, { foreignKey: "userId", as: "user" });
// Comment.belongsTo(Post, { foreignKey: "postId", as: "post" });

export default Comment;