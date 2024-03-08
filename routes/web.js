import express from 'express';
const router = express.Router();
import { loginController } from '../app/controller/loginController.js';
import { homeController } from '../app/controller/homeController.js';
import { checkController, gotoadmin, adminController,allowed } from '../app/controller/checkController.js';
import PostsController from '../app/controller/postController.js';
import active from '../app/controller/actionController.js';
import multer from 'multer'; // Import Multer
import { signupController,Singup,verifyOtp ,sendOtp } from '../app/controller/signupController.js';
import auditLogMiddleware from '../app/controller/auditController.js';
import { details,displayaudits } from '../app/controller/getauditController.js';
import { isAdmin,grant,removeUser} from '../app/controller/permissionController.js';
import CategoryController from '../app/controller/categoryController.js';
import  {readComment,readAllComment,ceateComment,approveComment,deleteComment,filterComment } from '../app/controller/CommentController.js';

//captcha
import {RecaptchaV2} from 'express-recaptcha';
const RECAPTCHA_SITE_KEY = '6Ld40YopAAAAALaRZnBk1XrxyU577GnfnVsJp5wz';
const RECAPTCHA_SECRET_KEY = '6Ld40YopAAAAAEvsuVTysYnRuVgvnFI8n_EVHYNt';
const recaptchaMiddleware = new RecaptchaV2(RECAPTCHA_SITE_KEY, RECAPTCHA_SECRET_KEY);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'images/'); 
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); 
  }
})
const upload = multer({ storage: storage });
//signup
router.get('/signup',Singup);
router.post('/sendotp',sendOtp);

router.post('/signup',verifyOtp,signupController);
// Routes
router.get('/', homeController);
router.get('/admin', gotoadmin, adminController);
router.get('/login', loginController);
router.post('/login', checkController);
// CRUD Operations
router.post('/create',upload.single('image'),PostsController.create,auditLogMiddleware); 
router.get('/read', PostsController.read);
router.get('/read/:id', PostsController.read);
router.put('/update/:id',upload.single('image'),PostsController.update,auditLogMiddleware); 
router.delete('/delete/:id', PostsController.delete, auditLogMiddleware);
// Loading
router.get('/create', gotoadmin, active.create,);
router.get('/update', gotoadmin, active.update,);
router.get('/readpost/:id',  active.read,);
//Audit
router.get('/auditLogs',details);
router.get('/auditsdisplay',gotoadmin,allowed,displayaudits)
//permission
router.get('/makeadmin',gotoadmin,allowed,active.permission);
router.get('/userdetails',isAdmin);
router.put('/grant/:id',grant)
router.delete('/user/remove/:id',removeUser)
//category
router.get('/allcategory',CategoryController.read);
router.put('/categories/:id',CategoryController.update)
//tags
router.get('/search', PostsController.read);
//comments 
router.get('/comment/read/:id',readComment);
router.get('/comment/readAll/:id',readAllComment);
router.post('/comment/create/:id',gotoadmin,recaptchaMiddleware.middleware.verify,filterComment,ceateComment);
router.put('/comment/update/:id',approveComment);
router.delete('/comment/:id',deleteComment);

router.get('/commentpage',gotoadmin,active.comment);
//nopage found
router.get('/*',(req,res)=>res.render('404'))



export default router;
