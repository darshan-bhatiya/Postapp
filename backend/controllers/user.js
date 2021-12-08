const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

exports.createUser = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
    .then(hash =>{
        const user = new User({
            email: req.body.email,
            password: hash
        });
        user.save()
            .then(result => {
                res.status(201).json({
                    message : "User saved data!",
                    result : result
                });
            }).
            catch(err => {
                res.status(500).json({
                    error: {
                        message : "Invalid authentication credentials!"
                    }
                });
            });
    });
}

exports.userLogin =  async (req,res,next) => {
    let fatchedUser;
    let result = false;
    User.findOne({email: req.body.email})
        .then( async user => {
            if (!user) {
                return res.status(401).json({
                    message:"User Notfound"
                });
            }
            fatchedUser = user;
            try { 
                result = await bcrypt.compare(req.body.password, fatchedUser.password);  //this will send response back-to site that usernot found
            } catch (err) {
                return res.json({message: err.message ? err.message : err})
            }
            if(!result) return res.status(401).json({message:"Auth failed"});
            const token = jwt.sign(
                {email: fatchedUser.email, userId: fatchedUser._id},
                process.env.JWT_KEY,
                { expiresIn: "1h" }
            );
            return res.status(200).json({
                token: token,
                expiresIn: 3600,
                userId: fatchedUser._id 
            });
        })
        .catch(err => {
            console.log(err);
            return res.status(401).json({
                message:"Invalid authentication credentials!"
            });
        });
}