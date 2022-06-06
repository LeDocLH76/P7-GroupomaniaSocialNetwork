const Router = require('express');
const ctrlUser = require('../controllers/ctrlUser.js');
const ctrlComment = require('../controllers/ctrlComment.js');
const ctrlPost = require('../controllers/ctrlPost.js');
const auth = require('../middlewares/auth.js');
const multer = require('../middlewares/multer.js');
const isAdmin = require('../middlewares/isAdmin.js');

const router = Router();
// , isAdmin
router.get('/users', auth, ctrlUser.getAllUsers);
router.get('/user/:id', auth, ctrlUser.getOneUser);
router.get('/logUser', ctrlUser.logUser);
router.post('/userCreate', multer.single('image'), ctrlUser.createUser);
router.put('/userUpdate', auth, multer.single('image'), ctrlUser.updateUser);
router.delete('/userDelete', auth, ctrlUser.deleteUser);
router.delete('/logoutUser', auth, ctrlUser.logoutUser);

router.get('/posts', auth, ctrlPost.getAllposts);
router.get('/post/:id', auth, ctrlPost.getOnepost);
router.post('/postCreate', auth, multer.array('images', 6), ctrlPost.createpost);
router.put('/postUpdate/:id', auth, multer.array('images', 6), ctrlPost.updatepost);
router.delete('/postDelete/:id', auth, ctrlPost.deletepost);

router.get('/comments/:id', auth, ctrlComment.getAllcommentsUser);
router.get('/comment/:id', auth, ctrlComment.getOnecommentUser);
router.post('/commentCreate', auth, ctrlComment.createcommentUser);
router.put('/commentUpdate/:id', auth, ctrlComment.updatecommentUser);
router.delete('/commentDelete/:id', auth, ctrlComment.deletecommentUser);

module.exports = router;
