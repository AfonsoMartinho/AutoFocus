const express = require('express');
const router = express.Router();

//multer parses form-data simplfying tha managment of file uploads
const multer = require('multer');

//Protect Only for users
const checkAuth = require('../middleware/check-auth');

const UserController = require('../controllers/users.js');


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toDateString().replace(/ /g, '') + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    //reject a file
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, false);
    } else {

    }
    cb(null, true);

};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});




router.get('/', UserController.users_get_all);



//GET Specific User by ID
router.get('/:userId', UserController.users_get_user);


//DELETE Specific User by IDs
router.delete('/:userId', checkAuth, UserController.users_delete_user);

//Create new User
router.post('/signup', upload.single('userImage'), UserController.users_create_user);
//login User
router.post('/login', UserController.users_login_user);

//PATCH Specific activity
router.patch('/:userId', checkAuth, UserController.users_update_user);


module.exports = router;