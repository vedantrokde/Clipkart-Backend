const User = require('../../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const shortid = require('shortid');

exports.signup = (req, res) => {
    User.findOne({ email: req.body.email})
    .exec( async (err, user)=>{
        if(err) return res.status(400).json({
            message: err
        });

        if(user) return res.status(400).json({
            message: 'Admin already exists'
        });

        const {
            firstName,
            lastName,
            email,
            password
        } = req.body;

        const hash_password = await bcrypt.hash(password, 10);
        const _user = new User({
            firstName,
            lastName,
            email,
            hash_password,
            role:'admin',
            username: shortid.generate()
        });

        _user.save((err,data)=>{
            if(err) return res.status(400).json({
                message: 'Something went wrong'
            });
            if(data) return res.status(201).json({
                message: 'Admin user created successfully'
            });
        });
    });
};

exports.signin = (req, res) => {
    User.findOne({ email: req.body.email})
    .exec(async (err, user)=>{
        if(err) return res.status(400).json({
            message: err
        });

        if(user) {
            const isAuthenticated = await user.authenticate(req.body.password)
            if(isAuthenticated && user.role==='admin'){
                const token = jwt.sign({ _id:user._id, role:user.role }, process.env.JWT_SECRET, { expiresIn: '10h'});
                const { _id, firstName, lastName, email, role, fullName} = user;

                res.cookie('token',token, { expiresIn: '10h'});
                res.status(200).json({
                    token,
                    user:{
                        _id, firstName, lastName, email, role, fullName
                    }
                });
            } else {
                return res.status(400).json({ message: 'Password invalid' });
            }
        } else {
            return res.status(400).json({ message: 'Something went wrong' });
        }
    });
};

exports.signout = (req, res) => {
    res.clearCookie('token');
    res.status(200).json({
        message: 'Signout successfully..!'
    })
}