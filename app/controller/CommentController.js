import { decryptPostId } from "./postController.js";
import Comment from "../models/comments.js";
import Users from "../models/users.model.js";
import gaaliya from "../../gaaliya.js";

const filterComment = (req, res, next) => {
  try {
    const { comment } = req.body;
    console.log(gaaliya);
    const commentArray = comment.split(" ");
    commentArray.forEach((e, i) => {
      if (gaaliya.includes(e)) {
        let gaali = "";
        for (let j = 0; j < e.length; j++) gaali += "*";
        commentArray[i] = gaali;
      }
    });
    const finalCommnet = commentArray.join(" ");
    req.finalComment = finalCommnet;
    next();
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};
const readComment = async (req, res) => {
  try {
    const includeOptions = [{ model: Users, as: "user", attributes: ["name"] }];
    const comments = await Comment.findAll({
      where: {
        status: true,
        postId: decryptPostId(req.params.id),
      },
      include: includeOptions,
    });
    res.send({ success: true, data: comments });
  } catch (error) {
    return res
      .status(500)
      .send({ success: false, data: error.message || "Internal Server Error" });
  }
};
const readAllComment = async (req, res) => {
  try {
    const comments = await Comment.findAll({
      where: {
        postId: decryptPostId(req.params.id),
      },
    });
    res.send({ success: true, data: comments });
  } catch (error) {
    return res
      .status(500)
      .send({ success: false, data: error.message || "Internal Server Error" });
  }
};
const ceateComment = async (req, res) => {
  try {
    const userId = req.session.user.id;
    const postId = decryptPostId(req.params.id);
    // const { comment } = req.body;
    // //  console.log(userId,postId,comment);
    const comment=req.finalComment;
    const createdComment = await Comment.create({
      userId,
      postId,
      comment,
    });
    res.send({ success: true, data: createdComment });
  } catch (error) {
    return res
      .status(500)
      .send({ success: false, data: error.message || "Internal Server Error" });
  }
};
const approveComment = async (req, res) => {
  try {
    const id = req.body.id;
    if (!id) {
      return res.send({ success: false, data: "please provide id" });
    }
    const comment = await Comment.findByPk(id);
    console.log(comment);

    if (comment) {
      comment.status = !comment.status;
      await comment.save();
      return res.send({ success: true, data: comment });
    } else
      return res.send({
        success: false,
        data: "cant toggle the comment approval",
      });
  } catch (error) {
    return res
      .status(500)
      .send({ success: false, data: error.message || "Internal Server Error" });
  }
};
const deleteComment = async (req, res) => {
  try {
    const id = req.body.id;
    if (!id) {
      return res.send({ success: false, data: "please provide id" });
    }
    const deletedComment = await Comment.destroy({
      where: {
        id: id,
      },
    });
    if (deletedComment === 1) {
      return res.send({ success: true, data: "Comment deleted" });
    }
    return res.send({ success: false, data: "cant delete" });
  } catch (error) {
    return res
      .status(500)
      .send({ success: false, data: error.message || "Internal Server Error" });
  }
};
export {
  readComment,
  readAllComment,
  ceateComment,
  approveComment,
  deleteComment,
  filterComment ,
};
