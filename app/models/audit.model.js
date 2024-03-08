//auditLog.model.js
import sequelize from "../../config/connect.js";
import { DataTypes } from "sequelize";
import User from "./users.model.js";

const auditLog = sequelize.define("auditLog", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  action: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [["CREATE", "UPDATE", "DELETE"]],
    },
  },
  postId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

auditLog.belongsTo(User, { foreignKey: "userId", as: "user" });

export default auditLog;