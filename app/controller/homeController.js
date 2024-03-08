import bodyParser from 'body-parser';

const homeController= (req,res)=>{
    req.session.authorized = false;
    req.session.destroy(()=>{
        res.render('home');
    });
   
}

export {homeController} 