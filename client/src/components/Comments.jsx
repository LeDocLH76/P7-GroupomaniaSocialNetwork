import { Avatar, Card, CardActions, CardContent, CardHeader, Grid, IconButton, Typography } from '@mui/material';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { DeleteForever } from '@mui/icons-material';

export default function Comments({
   post,
   comment,
   userId,
   comments,
   setComments,
   posts,
   setPosts,
   badgeComment,
   setBadgeComment,
}) {
   const navigate = useNavigate();
   const date = new Date(comment.createdAt);
   // Gère l'état des infos user
   const [commentUserAvatar, setCommentUserAvatar] = useState(null);
   const [commentUserPseudo, setCommentUserPseudo] = useState('');

   // Get infos user
   async function getUser(comment) {
      try {
         const response = await axios({
            method: 'get',
            url: `http://localhost:3001/api/user/${comment.userId}`,
            withCredentials: true,
         });
         setCommentUserPseudo(response.data.pseudo);
         setCommentUserAvatar(response.data.avatar);
      } catch (error) {
         if (error.response.status === 401) {
            console.log(error.response.statusText);
            navigate('/login');
         }

         console.log(error);
      }
   }
   getUser(comment);

   const handleClickDeleteComment = async () => {
      console.log('Delete button pressed posts = ', posts);
      console.log("Les comments avant l'appel à delete comment", comments);
      await deleteComment(post, comment, navigate, posts, setPosts, badgeComment, setBadgeComment);
   };

   return (
      <Grid item>
         <Card>
            <CardHeader
               avatar={<Avatar alt="avatar" src={commentUserAvatar}></Avatar>}
               title={commentUserPseudo}
               subheader={date.toLocaleString()}
            />
            <CardContent>
               <Typography variant="body2" color="text.secondary">
                  {comment.body}
               </Typography>
            </CardContent>
            <CardActions>
               {comment.userId === userId ? (
                  <IconButton aria-label="éffacer commentaire" color={'error'} onClick={handleClickDeleteComment}>
                     <DeleteForever />
                  </IconButton>
               ) : null}
            </CardActions>
         </Card>
      </Grid>
   );
}

async function deleteComment(post, comment, navigate, posts, setPosts, badgeComment, setBadgeComment) {
   console.log('Dans delete comment, posts avant try = ', posts);

   try {
      // const response =
      await axios.delete(`http://localhost:3001/api/commentDelete/${comment.id}`, {
         withCredentials: true,
      });

      try {
         const response = await axios.get(`http://localhost:3001/api/post/${post.id}`, { withCredentials: true });
         console.log('Le nouveau post sur la BD = ', response.data);

         let newPosts = posts;
         console.log('La copie du state des posts newPosts = ', newPosts);
         const index = newPosts.indexOf(post);
         console.log("Le post à remplacer est à l'index", index);

         console.log('newPosts avant = ', newPosts);
         // Remplace le post à la position index
         newPosts.splice(index, 1, response.data);
         console.log('newPosts apres = ', newPosts);
         // Met à jour le compteur de post
         setBadgeComment(badgeComment - 1);
         // Met à jour les posts
         setPosts(newPosts);
      } catch (error) {
         if (error.response.status === 401) {
            console.log(error.response.statusText);
            navigate('/login');
         }
         // else {
         //    console.log(error.response.data.error.message);
         // }
         console.log(error);
      }
   } catch (error) {
      if (error.response.status === 401) {
         console.log(error.response.statusText);
         navigate('/login');
      }
      // else {
      //    console.log(error.response.data.error.message);
      // }
      console.log(error);
   }
   console.log('posts en fin de delete comment = ', posts);
}
