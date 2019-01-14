const Activity = require('../models/activity');
const app = require('../../app');
const mongoose = require('mongoose');

exports.activities_get_all =  (req, res, next) => {
    Activity.find()
        .select('name type _id user')
        .exec()
        .then(docs => {
            //SENDING MORE DATA to the responde in GET
            res.status(200).json({ 
                count: docs.length,
                activities: docs.map(doc => {
                    return {
                        _id: doc.id,
                        name: doc.name,
                        type: doc.type,
                        creator: app.Root+'users/' + doc.user,
                        request: {
                            type: 'GET',
                            description:'GET more info About the activity',
                            url: app.Root+'activities/' + doc.id
                        }
                    };
                })
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

exports.activities_create_activity = (req, res, next) => {
    const activity = new Activity({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        type: req.body.type,
        user: req.body.userId
    });
    activity
        .save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: "Activity Created Successfully",
                createdActivity: {
                    _id: result.id,
                    name: result.name,
                    type: result.type,
                    creator: app.Root + 'users/' + result.user,
                    request: {
                        type: 'GET',
                        description: 'GET info about the created activity',
                        url: app.Root + 'activities/' + result.id
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

exports.activities_get_activity = (req, res, next) => {
    const activityId = req.params.activityId;
    Activity.findById(activityId)
        .select('name type _id user')
        .exec()
        .then(doc => {
            console.log("From database", doc);
            if (doc) {
                res.status(200).json({
                    activity: doc,
                    request: {
                        type: 'GET',
                        description: 'Get all Activities',
                        url: app.Root + 'activities/'
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

exports.activities_delete_activity = (req, res, next) => {
    const id = req.params.activityId;
    Activity.remove({
            _id: id
        })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Activity Deleted',
                request: {
                    type: 'POST',
                    description: 'Create New Activity ',
                    url: app.Root + 'activities/',
                    body: {
                        name: 'String',
                        type: 'String'
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

exports.activities_update_activity = (req, res, next) => {
    const id = req.params.activityId;
    const updateOps = {};
    //Change only one param or all of them
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Activity.update({
            _id: id
        }, {
            $set: updateOps
        })
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json({
                message: 'Activity Updated',
                request: {
                    type: 'GET',
                    description: 'Get the updated Activity',
                    url: app.Root + 'activities/' + id
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