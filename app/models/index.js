import sequelize from "../../config/connect.js";

import Posts from "./posts.model.js";
import Users from "./users.model.js";

const syncModels = async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log("All models synchronized successfully.");
  } catch (error) {
    console.error("Error synchronizing models: ", error);
  } finally {
    await sequelize.close();
  }
};

export default sequelize;
