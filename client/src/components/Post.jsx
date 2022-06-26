import {
   Avatar,
   Badge,
   Card,
   CardActions,
   CardContent,
   CardHeader,
   CardMedia,
   Collapse,
   Grid,
   IconButton,
   Tooltip,
   Typography,
} from '@mui/material';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ThumbUp, ThumbDown, Comment, DeleteForever, ExpandMore, ExpandLess } from '@mui/icons-material';
import FormCommentCreate from './FormCommentCreate';
import Comments from './Comments';

function Post({ post, userId, isAdmin, posts, setPosts }) {
   const navigate = useNavigate();
   let userIncludeLike = false;
   let userIncludeDislike = false;
   let badgeContentLike = post.like;
   let badgeContentDislike = post.dislike;
   // console.log(post.comments);
   let badgeContentComment = post.comments.length;
   // si userId dans post.userLike setLike = true
   if (post.userLike.includes(userId)) {
      userIncludeLike = true;
   }
   // si userId dans post.userDislike setDislike = true
   if (post.userDislike.includes(userId)) {
      userIncludeDislike = true;
   }
   // console.log(post.userLike, post.userDislike, post.userId);
   // Gère l'état allumé éteint des pouces haut et bas
   const [like, setLike] = useState(userIncludeLike);
   const [dislike, setDislike] = useState(userIncludeDislike);
   // Gère l'état du nombre de like dislike inscrit dans les badges
   const [badgeLike, setBadgeLike] = useState(badgeContentLike);
   const [badgeDislike, setBadgeDislike] = useState(badgeContentDislike);
   // Gère l'état des infos user
   const [postUserAvatar, setPostUserAvatar] = useState(null);
   const [postUserPseudo, setPostUserPseudo] = useState('');
   // Gère l'état du nombre de commentaire inscrit dans le badge
   const [badgeComment, setBadgeComment] = useState(badgeContentComment);
   // Gère l'état de l'affichage d'ajout de commentaire
   const [showAddComment, setShowAddComment] = useState(false);
   // Gère l'état de l'affichage des commentaires
   const [showComment, setShowComment] = useState(false);
   // Gère le contenu de post.comments
   const [comments, setComments] = useState(post.comments);

   const date = new Date(post.createdAt);
   // Get infos user
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
            // console.log('post.like -- post.userLike -user');
            // retirer le like 0 => BD
            const param = 0;
            const response = await updateDB(post, param, navigate);
            setLike(!like);
            setBadgeLike(response.data.like);
            return;
         }
         // si like = false => post.like += et ajouter userId dans post.userLike
         if (like === false) {
            // console.log('post.like ++ post.userLike +user');
            // ajouter le like 1 => BD
            const param = 1;
            const response = await updateDB(post, param, navigate);
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
            // console.log('post.dislike -- post.userDislike -user');
            // retirer le dislike 0 => BD
            const param = 0;
            const response = await updateDB(post, param, navigate);
            setDislike(!dislike);
            setBadgeDislike(response.data.dislike);

            return;
         }
         // si dislike = false => post.dislike += et ajouter userId dans post.userDislike
         if (dislike === false) {
            // console.log('post.dislike ++ post.userDislike +user');
            // ajouter le dislike -1 => BD
            const param = -1;
            const response = await updateDB(post, param, navigate);
            setDislike(!dislike);
            setBadgeDislike(response.data.dislike);
         }
      }
   };

   const handleClickDeletePost = async () => {
      // console.log('Delete button pressed');
      await deletePost(post, navigate, posts, setPosts);
   };

   const handleClickAddComment = async () => {
      setShowAddComment(!showAddComment);
   };

   const handleClickShowComments = () => {
      console.log('clic showComment');
      setShowComment(!showComment);
   };

   return (
      <Grid item xs={12} sm={6} md={4} lg={3}>
         <Card sx={{ maxWidth: 345 }}>
            {/* L'auteur et la date de publication */}
            <CardHeader
               avatar={<Avatar alt="avatar" src={postUserAvatar}></Avatar>}
               title={postUserPseudo}
               subheader={`${date.toLocaleString()}`}
            />

            {/* Les images de la publication */}
            {post.picture.map((image, i) => (
               <CardMedia component="img" height="194" image={image} alt={`image ${i + 1} du post`} key={i} />
            ))}

            {/* Le texte de la publication */}
            <CardContent>
               <Typography variant="body2" color="text.secondary">
                  {post.body}
               </Typography>
            </CardContent>

            {/* La zone des boutons d'action */}
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
                  <Tooltip title={'Like'} followCursor={true}>
                     <IconButton aria-label="like" color={like ? 'primary' : 'secondary'} onClick={handleClickLike}>
                        <ThumbUp />
                     </IconButton>
                  </Tooltip>
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
                  <Tooltip title={'Dislike'} followCursor={true}>
                     <IconButton
                        aria-label="dislike"
                        color={dislike ? 'primary' : 'secondary'}
                        onClick={handleClickDislike}
                     >
                        <ThumbDown />
                     </IconButton>
                  </Tooltip>
               </Badge>

               {post.userId === userId || isAdmin ? (
                  <Tooltip title={'Supprimer'} followCursor={true}>
                     <IconButton aria-label="éffacer publication" color={'error'} onClick={handleClickDeletePost}>
                        <DeleteForever />
                     </IconButton>
                  </Tooltip>
               ) : null}

               <Badge
                  badgeContent={badgeComment}
                  color="primary"
                  showZero
                  overlap="circular"
                  anchorOrigin={{
                     vertical: 'top',
                     horizontal: 'right',
                  }}
               >
                  <Tooltip title={'Ajouter'} followCursor={true}>
                     <IconButton aria-label="nouveau commentaire" color="primary" onClick={handleClickAddComment}>
                        <Comment />
                     </IconButton>
                  </Tooltip>
               </Badge>

               <Tooltip title={showComment ? 'Voir moins' : 'Voir plus'} followCursor={true}>
                  <IconButton aria-label="voir commentaire" color={'success'} onClick={handleClickShowComments}>
                     {showComment ? <ExpandLess /> : <ExpandMore />}
                  </IconButton>
               </Tooltip>
            </CardActions>

            {/* Zone de saisie du nouveau commentaire */}
            {showAddComment ? (
               <CardContent>
                  <FormCommentCreate
                     post={post}
                     setPosts={setPosts}
                     badgeComment={badgeComment}
                     setBadgeComment={setBadgeComment}
                     setShowAddComment={setShowAddComment}
                  />
               </CardContent>
            ) : null}

            {/* Zone dépliable des commentaires */}
            <Collapse in={showComment} timeout="auto" unmountOnExit>
               <CardContent>
                  <Grid container spacing={3}>
                     {post.comments.map((comment) => (
                        <Comments
                           key={comment.id}
                           post={post}
                           comment={comment}
                           userId={userId}
                           isAdmin={isAdmin}
                           setComments={setComments}
                           posts={posts}
                           setPosts={setPosts}
                           badgeComment={badgeComment}
                           setBadgeComment={setBadgeComment}
                        />
                     ))}
                  </Grid>
               </CardContent>
            </Collapse>
         </Card>
      </Grid>
   );
}

export default Post;

async function deletePost(post, navigate, posts, setPosts) {
   try {
      // const response =
      await axios.delete(`http://localhost:3001/api/postDelete/${post.id}`, { withCredentials: true });
      // console.log(response.data);
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

async function updateDB(post, param, navigate) {
   try {
      const response = await axios.put(
         `http://localhost:3001/api/postLike/${post.id}`,
         {
            like: param,
         },
         { withCredentials: true }
      );
      return response;
   } catch (error) {
      if (error.response.status === 401) {
         console.log('error 401', error.response.statusText);
         navigate('/login');
      }
      // else {
      //    console.log(error.response.data.error.message);
      // }
      console.log('updateDB error = ', error);
   }
}
