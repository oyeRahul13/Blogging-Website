import auditLog from "../models/audit.model.js";
import Users from "../models/users.model.js";
const details = async (req, res) => {
  try {
    const allAuditLogs = await auditLog.findAll({
      include: [{ model: Users, as: 'user' }] 
    });
    res.json(allAuditLogs); 
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    res.status(500).json({ error: 'Internal server error' }); 
  }
};

const displayaudits= (req,res)=>{
  res.render('audit')
}

  export {details,displayaudits} 
  