const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
//Protect Only for users
const checkAuth = require('../middleware/check-auth');



const ActivitieController = require('../controllers/activities');

//GET Activities
router.get('/',  ActivitieController.activities_get_all);

//POST activity
router.post("/", checkAuth, ActivitieController.activities_create_activity);

//GET Specific activity
router.get('/:activityId', ActivitieController.activities_get_activity);

//PATCH Specific activity
router.patch('/:activityId', checkAuth, ActivitieController.activities_update_activity);

//DELETE Specific activity
router.delete('/:activityId', checkAuth, ActivitieController.activities_delete_activity );

module.exports = router;