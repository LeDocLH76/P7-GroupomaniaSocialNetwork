import { Avatar, Card, CardActions, CardContent, CardHeader, Grid, IconButton, Typography } from '@mui/material';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { DeleteForever } from '@mui/icons-material';

export default function Comments({ comment, userId }) {
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
      console.log('Delete button pressed');
      // await deleteComment(comment, navigate, posts, setPosts);
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
