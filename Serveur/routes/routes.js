const Router = require('express');
const ctrlUser = require('../controllers/ctrlUser.js');
const ctrlComment = require('../controllers/ctrlComment.js');
const ctrlPost = require('../controllers/ctrlPost.js');

const router = Router();

router.get('/users', ctrlUser.getAllUsers);
router.get('/user/:id', ctrlUser.getOneUser);
router.get('/logUser', ctrlUser.logUser);
router.post('/userCreate', ctrlUser.createUser);
router.put('/userUpdate/:id', ctrlUser.updateUser);
router.delete('/userDelete/:id', ctrlUser.deleteUser);

router.get('/posts', ctrlPost.getAllposts);
router.get('/post/:id', ctrlPost.getOnepost);
router.post('/postCreate/:id', ctrlPost.createpostUser);
router.put('/postUpdate/:id', ctrlPost.updatepost);
router.delete('/postDelete/:id', ctrlPost.deletepost);

router.get('/comments/:id', ctrlComment.getAllcommentsUser);
router.get('/comments/:id', ctrlComment.getOnecomment);
router.post('/commentCreate', ctrlComment.createcommentUser);
router.put('/commentUpdate/:id', ctrlComment.updatecomment);
router.delete('/commentDelete/:id', ctrlComment.deletecomment);

module.exports = router;
