const mongoose = require('mongoose');
const app = require('../../app');

const bcrypt = require('bcrypt');
//JWT
const jwt = require('jsonwebtoken');
const User = require('../models/user');



exports.users_get_all = (req, res, next) => {
    User.find()
        .select('name email _id userImage')
        .exec()
        .then(docs => {
            //SENDING MORE DATA to the responde in GET
            const response = {
                count: docs.length,
                Users: docs.map(doc => {
                    return {
                        _id: doc.id,
                        name: doc.name,
                        email: doc.email,
                        userImage: doc.userImage,
                        request: {
                            type: 'GET',
                            descryption: 'GET more info about this User',
                            url: app.Root + 'users/' + doc.id
                        }
                    }
                })
            };
            res.status(200).json(response);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        })
}

exports.users_create_user =  (req, res, next) => {

    //see if User already exists by email
    User.find({
            email: req.body.email
        })
        .exec()
        .then(user => {
            if (user.length >= 1) {
                //409 means conflict
                return res.status(409).json({
                    message: "Email already exists"
                });
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        });
                    } else {
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            name: req.body.name,
                            email: req.body.email,
                            password: hash,
                            userImage: app.Root + 'uploads/' + req.file.filename
                        });
                        user
                            .save()
                            .then(result => {
                                console.log(result);
                                res.status(201).json({
                                    message: "User Created Successfully",
                                    createdActivity: {
                                        _id: result.id,
                                        name: result.name,
                                        email: result.email,
                                        password: result.password,
                                        request: {
                                            type: 'GET',
                                            description: 'GET info about the created User',
                                            url: app.Root + 'users/' + result.id
                                        }

                                    }
                                });
                            })
                            .catch(err => {
                                console.log(err);
                                res.status(500).json({
                                    error: err
                                });
                            });
                    }
                });
            }
        })



    console.log(req.file);


}

exports.users_login_user = (req, res, next) => {
    User.find({
            email: req.body.email
        })
        .exec()
        .then(user => {
            //If we got no user
            if (user.length < 1) {
                return res.status(401).json({
                    message: 'Auth failed 1'
                });
            }
            //user z because find returns an array of objects
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if (err) {
                    return res.status(401).json({
                        message: 'Auth failed 2'
                    });
                }
                if (result) {
                    const token = jwt.sign({
                        email:user[0].email,
                        _id: user[0]._id
                    },
                    process.env.JWT_KEY,
                    {
                        expiresIn:"1h"
                    });
                    return res.status(200).json({
                        message: 'Auth successfull',
                        token:token
                    });
                }
                return res.status(401).json({
                    message: 'Auth failed 3'
                });
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

exports.users_update_user = (req, res, next) => {
    const userId = req.params.userId;
    const updateOps = {};
    //Change only one param or all of them
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    User.update({
            _id: userId
        }, {
            $set: updateOps
        })
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json({
                message: 'User Updated',
                request: {
                    type: 'GET',
                    description: 'Get the updated User',
                    url: app.Root + 'users/' + userId
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

exports.users_delete_user = (req, res, next) => {
    const userId = req.params.userId;
    User.remove({
            _id: userId
        })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'User Deleted',
                request: {
                    type: 'POST',
                    description: 'Create New User ',
                    url: app.Root + 'users/',
                    body: {
                        name: 'String',
                        email: 'String'
                    }
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

exports.users_get_user = (req, res, next) => {
    const userId = req.params.userId
    User.findById(userId)
        .select('name email _id userImage')
        .exec()
        .then(doc => {
            console.log("From database", doc);
            if (doc) {
                res.status(200).json({
                    user: doc,
                    request: {
                        type: 'GET',
                        description: 'Get all Users',
                        url: app.Root + 'users/'
                    }
                });
            } else {
                res.status(404).json({
                    message: "no valid id"
                })
            }

        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })

        });
}