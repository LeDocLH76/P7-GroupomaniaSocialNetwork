import { Router } from 'express';
import {
   getAllUsers,
   getOneUser,
   createUser,
   updateUser,
   deleteUser,
} from '../controllers/ctrlUser.js';
import {
   getAllposts,
   getOnepost,
   createpost,
   updatepost,
   deletepost,
} from '../controllers/ctrlPost.js';
import {
   getOnecomment,
   createcomment,
   updatecomment,
   deletecomment,
} from '../controllers/ctrlComment.js';

const router = Router();

router.get('/', (req, res) => res.send('Hello Denis'));

router.get('/users', getAllUsers);
router.get('/user/:id', getOneUser);
router.post('/userCreate', createUser);
router.put('/userUpdate/:id', updateUser);
router.delete('/userDelete/:id', deleteUser);

router.get('/posts', getAllposts);
router.get('/post/:id', getOnepost);
router.post('/postCreate', createpost);
router.put('/postUpdate/:id', updatepost);
router.delete('/postDelete/:id', deletepost);

// router.get('/comments', getAllcomments);
router.get('/comments/:id', getOnecomment);
router.post('/commentCreate/:id', createcomment);
router.put('/commentUpdate/:id', updatecomment);
router.delete('/commentDelete/:id', deletecomment);

export default router;
