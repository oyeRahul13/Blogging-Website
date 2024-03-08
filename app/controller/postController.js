import Posts from "../models/posts.model.js";
import Users from "../models/users.model.js";
import Category from "../models/category.js";
import CryptoJS from "crypto-js";
import { Sequelize,Op } from "sequelize";
const secretKey = "skyyy";


const encryptPostId = (postId) => {
  const encrypted = CryptoJS.AES.encrypt(
    postId.toString(),
    secretKey
  ).toString();

  const hexString = CryptoJS.enc.Hex.stringify(
    CryptoJS.enc.Base64.parse(encrypted)
  );

  return hexString;
};
const decryptPostId = (encryptedPostId) => {
  const base64String = CryptoJS.enc.Base64.stringify(
    CryptoJS.enc.Hex.parse(encryptedPostId)
  );

  try {
    const decrypted = CryptoJS.AES.decrypt(base64String, secretKey).toString(
      CryptoJS.enc.Utf8
    );

    return parseInt(decrypted, 10);
  } catch (error) {
    console.error("Error decrypting post ID:", error);
    return null;
  }
};

class PostsController {
  static async create(req, res, next) {
    try {
      if (!req.session.authorized) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const { title, postText, category, userid ,summary, tags} = req.body;
      const image = req.file ? req.file.path : null;
      let categoryObj = await Category.findOne({ where: { name: category } });
      if (!categoryObj) {
        categoryObj = await Category.create({ name: category });
      }
    // console.log(req.body);
      const newPost = new Posts({
        title,
        summary,
        tags,
        postText,
        categoryId: categoryObj.id, 
        image,
        userid,
      });
      await newPost.save();
      req.postId = newPost.id;
      req.data = newPost;
      next();
    } catch (error) {
      console.error("Error creating post:", error);
      res
        .status(500)
        .json({ error: "An error occurred while creating the post" });
    }
  }

  static async read(req, res) {
    try {
      let posts;
      const { limit, offset } = req.query;
      let parsedLimit, parsedOffset;
      if (limit && offset) {
        parsedLimit = parseInt(limit);
        parsedOffset = parseInt(offset);
      }

      const includeOption = [
        { model: Users, as: "user", attributes: ["name", "isAdmin"] },
        { model: Category, as: "category", attributes: ["name"] }, // Include category details
      ];

      if (req.params.id) {
        const id = decryptPostId(req.params.id);
        posts = await Posts.findByPk(id, { include: includeOption });
        if (!posts) {
          return res.status(404).json({ message: "Post not found" });
        }
      } else if (req?.query.cat) {
        const cat = req.query.cat;

        posts = await Posts.findAll({
          include: includeOption,
          where: { categoryID: parseInt(cat) }, // Query by category name from included table
          limit: 9999,
          offset: 0,
        });
      } else if (req.query.userid) {
        const userId = req.query.userid;
        posts = await Posts.findAll({
          include: includeOption,
          where: { userid: userId },
          limit: 999,
          offset: 0,
        });
      } 
      else if (req.query.tags) {
        const tags = req.query.tags;
        posts = await Posts.findAll({
          include: includeOption,
          where: {
            tags: {
              [Op.like]: `%${tags}%`
            }
          },
          limit: 999,
          offset: 0,
        });
      }else {
        posts = await Posts.findAll({
          include: includeOption,
          limit: parsedLimit,
          offset: parsedOffset,
        });
      }

      if (Array.isArray(posts))
        posts = posts.map((post) => {
          let postData = post.toJSON();
          postData.eid = encryptPostId(postData.id);
          return postData;
        });
      else {
        posts.toJSON().eid = encryptPostId(posts.id);
        // postData.eid = encryptPostId(postData.id);
        // posts.eid=
        //console.log(posts.toJSON());
      }
      res
        .status(200)
        .json({ message: "Posts retrieved successfully", data: posts });
    } catch (error) {
      console.error("Error reading posts:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  static async update(req, res, next) {
    try {
      const postId = decryptPostId(req.params.id);
      //console.log(postId);
      const { title, postText, categoryId,summary,tags } = req.body;
      let image;

      // Check if a new image file is uploaded
      if (req.file) {
        image = req.file.path;
      }

      const post = await Posts.findByPk(postId);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      // Update fields if provided
      if (title) post.title = title;
      if (postText) post.postText = postText;
      if(summary) post.summary = summary;
      if(tags) post.tags=tags;
      if (categoryId) {
        const category = await Category.findByPk(categoryId);
        if (!category) {
          return res.status(404).json({ message: "Category not found" });
        }
        post.categoryId = categoryId;
      }
      if (image) post.image = image;
      await post.save();
      req.postId = postId;
      req.data = post;
      next();
      // res
      //   .status(200)
      //   .json({ message: "Post updated successfully", data: post });
    } catch (error) {
      console.error("Error updating post:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  static async delete(req, res, next) {
    try {
      const postId = req.params.id;
      const post = await Posts.findByPk(postId);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      await post.destroy();
      req.postId = postId;
      req.data = post;
      next();
      // res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
      console.error("Error deleting post:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}
export {decryptPostId} ;
export default PostsController ;
//export default decryptPostId;