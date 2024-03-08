// middleware/auditLogMiddleware.js
import auditLog from "../models/audit.model.js";

const auditLogMiddleware = async (req, res) => {
  try {
    const { method } = req;

    let action;
    switch (method) {
      case "POST":
        action = "CREATE";
        break;
      case "PUT":
        action = "UPDATE";
        break;
      case "DELETE":
        action = "DELETE";
        break;
      default:
        action = "UNKNOWN";
    }

    await auditLog.create({
      userId: req.session.user.id,
      action,
      postId: req.postId,
    });

    return res.send({ success: true, data: req.data });
  } catch (error) {
    console.error("Audit Log Middleware Error:", error);
    throw new Error("Successfull but Error Audit Log");
  }
};

export default auditLogMiddleware;