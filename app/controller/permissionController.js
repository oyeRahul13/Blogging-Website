import Users from "../models/users.model.js";
import Posts from "../models/posts.model.js";
const isAdmin = async (req, res) => {
  try {
    const users = await Users.findAll();
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const grant = async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await Users.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.isAdmin = !user.isAdmin;
    await user.save();
    res.json(user);
  } catch (error) {
    console.error("Error changing isAdmin status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const removeUser = async (req, res) => {
  try {
      const id = req.params.id;
      const deletedPosts = await Posts.destroy({
          where: {
              userId: id,
          },
      });
      if (deletedPosts < 0) throw new Error("Error while deleting Posts of user");
      else if (deletedPosts === 0) console.log("No posts found for the user");

      const deletedUser = await Users.destroy({
          where: {
              id: id,
          },
      });
      if (deletedUser === 1) {
          res.status(200).json({ message: "User deleted successfully" });
      } else {
          throw new Error("User not found or not deleted");
      }
  } catch (error) {
      console.log("Error while deleting user:", error);
      res.status(500).json({ error: "Internal server error" });
  }
};


export { isAdmin, grant, removeUser };
