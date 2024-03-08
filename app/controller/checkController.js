import bodyParser from 'body-parser';
import bcrypt from 'bcrypt';
import Users from '../models/users.model.js';

const checkController = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const user = await Users.findOne({ where: { email } });
        if (!user) {
            res.send({ auth: false });
        } else {
            // Compare the provided password with the encrypted password in the database
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (isPasswordValid) {
                req.session.authorized = true;
                req.session.user=user;
                res.send({ auth: true });
            } else {
                res.send({ auth: false });
            }
        }
    } catch (err) {
        console.log(err);
        res.status(500).send({ error: 'Internal server error' });
    }
}

const gotoadmin = (req, res, next) => {
    if (req.session.authorized) {
        next();
    } else {
        res.redirect('/login');
    }
}

const allowed = (req, res, next) => {
    if (req?.session?.user?.isAdmin) {
        next();
    } else {
        res.redirect('/login');
    }
}




const adminController = (req, res) => {
    res.render('admin',{user:req.session.user})
}

export { checkController, gotoadmin, adminController,allowed };
