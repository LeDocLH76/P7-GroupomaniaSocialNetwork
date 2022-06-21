import {
   Avatar,
   Badge,
   Card,
   CardActions,
   CardContent,
   CardHeader,
   CardMedia,
   Grid,
   IconButton,
   Typography,
} from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Post({ post, userId, posts, setPosts }) {
   const navigate = useNavigate();
   let userIncludeLike = false;
   let userIncludeDislike = false;
   let badgeContentLike = post.like;
   let badgeContentDislike = post.dislike;
   if (post.userLike.includes(userId)) {
      // si userId dans post.userLike setLike = true
      userIncludeLike = true;
   }
   if (post.userDislike.includes(userId)) {
      // si userId dans post.userDislike setDislike = true
      userIncludeDislike = true;
   }
   console.log(post.userLike, post.userDislike, post.userId);

   const [like, setLike] = useState(userIncludeLike);
   const [dislike, setDislike] = useState(userIncludeDislike);
   const [badgeLike, setBadgeLike] = useState(badgeContentLike);
   const [badgeDislike, setBadgeDislike] = useState(badgeContentDislike);
   const [postUserAvatar, setPostUserAvatar] = useState(null);
   const [postUserPseudo, setPostUserPseudo] = useState('');
   const date = new Date(post.updatedAt);

   // Get info user
   async function getUser(post) {
      try {
         const response = await axios({
            method: 'get',
            url: `http://localhost:3001/api/user/${post.userId}`,
            withCredentials: true,
         });
         setPostUserPseudo(response.data.pseudo);
         setPostUserAvatar(response.data.avatar);
      } catch (error) {
         if (error.response.status === 401) {
            console.log(error.response.statusText);
            navigate('/login');
         }

         console.log(error);
      }
   }
   getUser(post);

   const handleClickLike = async () => {
      // si dislike = true => ne fait rien
      if (dislike !== true) {
         // si like = true => post.like -= et retirer userId de post.userLike
         if (like === true) {
            console.log('post.like -- post.userLike -user');
            // retirer le like 0 => BD
            const param = 0;
            const response = await updateDB(post, param);
            setLike(!like);
            setBadgeLike(response.data.like);
            return;
         }
         // si like = false => post.like += et ajouter userId dans post.userLike
         if (like === false) {
            console.log('post.like ++ post.userLike +user');
            // ajouter le like 1 => BD
            const param = 1;
            const response = await updateDB(post, param);
            setLike(!like);
            setBadgeLike(response.data.like);
         }
      }
   };

   const handleClickDislike = async () => {
      // si like = true => ne fait rien
      if (like !== true) {
         // si dislike = true => post.dislike -= et retirer userId de post.userDislike
         if (dislike === true) {
            console.log('post.dislike -- post.userDislike -user');
            // retirer le dislike 0 => BD
            const param = 0;
            const response = await updateDB(post, param);
            setDislike(!dislike);
            setBadgeDislike(response.data.dislike);

            return;
         }
         // si dislike = false => post.dislike += et ajouter userId dans post.userDislike
         if (dislike === false) {
            console.log('post.dislike ++ post.userDislike +user');
            // ajouter le dislike -1 => BD
            const param = -1;
            const response = await updateDB(post, param);
            setDislike(!dislike);
            setBadgeDislike(response.data.dislike);
         }
      }
   };

   const handleClickDeletePost = async () => {
      console.log('Delete button pressed');
      await deletePost(post, navigate, posts, setPosts);
   };

   return (
      <Grid item xs={12} sm={6} md={4} lg={3}>
         <Card sx={{ maxWidth: 345 }}>
            <CardHeader
               avatar={<Avatar alt="avatar" src={postUserAvatar}></Avatar>}
               title={postUserPseudo}
               subheader={date.toLocaleString()}
            />
            {post.picture.map((image, i) => (
               <CardMedia component="img" height="194" image={image} alt={`image ${i + 1} du post`} key={i} />
            ))}

            <CardContent>
               <Typography variant="body2" color="text.secondary">
                  {post.body}
               </Typography>
            </CardContent>

            <CardActions disableSpacing>
               <Badge
                  badgeContent={badgeLike}
                  color="secondary"
                  showZero
                  overlap="circular"
                  anchorOrigin={{
                     vertical: 'top',
                     horizontal: 'left',
                  }}
               >
                  <IconButton aria-label="like" color={like ? 'primary' : 'secondary'} onClick={handleClickLike}>
                     <ThumbUpIcon />
                  </IconButton>
               </Badge>

               <Badge
                  badgeContent={badgeDislike}
                  color="secondary"
                  showZero
                  overlap="circular"
                  anchorOrigin={{
                     vertical: 'bottom',
                     horizontal: 'right',
                  }}
               >
                  <IconButton
                     aria-label="dislike"
                     color={dislike ? 'primary' : 'secondary'}
                     onClick={handleClickDislike}
                  >
                     <ThumbDownIcon />
                  </IconButton>
               </Badge>
               {post.userId === userId ? (
                  <IconButton aria-label="dislike" color={'error'} onClick={handleClickDeletePost}>
                     <DeleteForeverIcon />
                  </IconButton>
               ) : null}

               {/* <ExpandMore
                                 expand={expanded}
                                 onClick={handleExpandClick}
                                 aria-expanded={expanded}
                                 aria-label="show more"
                              >
                                 <ExpandMoreIcon />
                              </ExpandMore> */}
            </CardActions>
         </Card>
      </Grid>
   );
}

export default Post;

async function deletePost(post, navigate, posts, setPosts) {
   try {
      const response = await axios.delete(`http://localhost:3001/api/postDelete/${post.id}`, { withCredentials: true });
      console.log(response.data);
      const newPosts = posts.filter((element) => element !== post);
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
}

async function updateDB(post, param) {
   try {
      const response = await axios.put(
         `http://localhost:3001/api/postLike/${post.id}`,
         {
            like: param,
         },
         { withCredentials: true }
      );
      // console.log(response.data);
      return response.data;
   } catch (error) {
      if (error.response.status === 401) {
         console.log(error.response.statusText);
         // navigate('/login');
      }
      // else {
      //    console.log(error.response.data.error.message);
      // }
      console.log(error);
   }
}
