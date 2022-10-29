const jwt = require('jsonwebtoken');
const multer = require('multer');
const shortid = require('shortid');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(path.dirname(__dirname),'uploads'))
    },
    filename: function (req, file, cb) {
      cb(null, shortid.generate() + '-' + file.originalname)
    }
});

exports.upload = multer({ storage:storage });

exports.requireSignin = (req, res, next) => {
    if (req.headers.authorization && req.headers.authorization.split(" ").length===2) {
        const token = req.headers.authorization.split(" ")[1];
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if(err) return res.status(401).json({ message:"Invalid token. Retry!" });
            if(user) {
                req.user = user;
                next();
            }
        });
    } else return res.status(401).json({ message: "Authorization required!"});
};

exports.userMiddleware = (req, res, next) => {
    if (req.user.role !== 'user')
        return res.status(401).json({ message: "Access denied! Login needed." });
    else next();
};

exports.adminMiddleware = (req, res, next) => {
    if (req.user.role !== 'admin')
        return res.status(401).json({ message: "Access denied! Authorization needed." });
    else next();
};