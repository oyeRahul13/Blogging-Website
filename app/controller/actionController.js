class active {
  static create = (req, res) => {
    res.render("create",{user:req.session.user});
  };
  static update  = (req, res) => {
    res.render("update",{user:req.session.user});
  };
  static read  = (req, res) => {
    res.render("read",{user:req.session.user});
   
  };
  static permission =(req,res)=> {
    res.render("permission",{user:req.session.user});
  }
   static comment=(req,res)=>{
    res.render("comment");
   }
}

export default active;
