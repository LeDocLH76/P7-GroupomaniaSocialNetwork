const Router = require('express');
const ctrlUser = require('../controllers/ctrlUser.js');
const ctrlComment = require('../controllers/ctrlComment.js');
const ctrlPost = require('../controllers/ctrlPost.js');
const auth = require('../middlewares/auth.js');
const multer = require('../middlewares/multer.js');
const isAdmin = require('../middlewares/isAdmin.js');
const validation = require('../middlewares/validation');
const userCreate = require('../validation/userCreateValidation'); //, validation(userCreate)
const userLogin = require('../validation/userLoginValidation'); //, validation(userLogin)
const userUpdate = require('../validation/userUpdateValidation'); //, validation(userUpdate)
const post = require('../validation/postValidation'); //, validation(post)
const comment = require('../validation/commentValidation'); //, validation(comment)

const router = Router();

router.get('/users', auth, isAdmin, ctrlUser.getAllUsers); // is admin
router.get('/user/:id', auth, ctrlUser.getOneUser);
router.post('/logUser', validation(userLogin), ctrlUser.logUser);
router.post('/userCreate', multer.single('image'), validation(userCreate), ctrlUser.createUser);
router.put('/userUpdate', auth, multer.single('image'), validation(userUpdate), ctrlUser.updateUser);
router.delete('/userDelete', auth, ctrlUser.deleteUser);
router.delete('/logoutUser', auth, ctrlUser.logoutUser);

router.get('/posts', auth, ctrlPost.getAllposts);
router.get('/post/:id', auth, ctrlPost.getOnepost);
router.post('/postCreate', auth, multer.array('images', 6), validation(post), ctrlPost.createpost);
router.put('/postUpdate/:id', auth, multer.array('images', 6), validation(post), ctrlPost.updatepost);
router.delete('/postDelete/:id', auth, ctrlPost.deletepost);

router.get('/comments', auth, ctrlComment.getAllcomments); // isAdmin
router.get('/comments/:id', auth, ctrlComment.getAllcommentsUser); // isAdmin
router.get('/comment/:id', auth, ctrlComment.getOnecomment);
router.post('/commentCreate', auth, validation(comment), ctrlComment.createcomment);
router.put('/commentUpdate/:id', auth, validation(comment), ctrlComment.updatecomment);
router.delete('/commentDelete/:id', auth, ctrlComment.deletecomment);

module.exports = router;
