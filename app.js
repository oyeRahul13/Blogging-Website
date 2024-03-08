import express from 'express';
import path from 'path';
import dotenv from "dotenv";
dotenv.config();
import session from 'express-session';
import sequelize from "./app/models/index.js";
import bodyParser from 'body-parser';

const app = express();
const port = process.env.PORT || '3000';

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use((req,res,next)=>{
  res.header("Cache-Control","no-store");
  next();
});
app.use(session({
  secret: '123', 
  resave: false,
  saveUninitialized: true,
}));

app.use(express.static( 'images'));

import web from './routes/web.js';
app.set('views', path.join(process.cwd(), 'app/views'));
app.set('view engine', 'ejs');

app.use('/', web);

sequelize
  .sync()
  .then(() => {
    console.log("All Tables are created");
    app.listen(port, () => {
      console.log(`Running on http://localhost:${port}/`);
    });
  })
  .catch((err) => {
    console.log(err);
  });


  