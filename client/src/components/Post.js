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
import { useState } from 'react';
import axios from 'axios';

function Post({ post, userId }) {
   let userIncludeLike = false;
   let userIncludeDislike = false;
   if (post.userLike.includes(userId)) {
      // si userId dans post.userLike setLike = true
      userIncludeLike = true;
   }
   if (post.userDislike.includes(userId)) {
      // si userId dans post.userDislike setDislike = true
      userIncludeDislike = true;
   }
   console.log(post.userLike, userId, userIncludeLike, userIncludeDislike);

   const [like, setLike] = useState(userIncludeLike);
   const [dislike, setDislike] = useState(userIncludeDislike);
   const date = new Date(post.updatedAt);

   const handleClickLike = async () => {
      // si dislike = true => ne fait rien
      if (dislike !== true) {
         // si like = true => post.like -= et retirer userId de post.userLike
         if (like === true) {
            console.log('post.like -- post.userLike -user');
            // retirer le like 0 => BD
            const param = 0;
            await updateDB(post, param);
            setLike(!like);
            return;
         }
         // si like = false => post.like += et ajouter userId dans post.userLike
         if (like === false) {
            console.log('post.like ++ post.userLike +user');
            // ajouter le like 1 => BD
            const param = 1;
            await updateDB(post, param);
            setLike(!like);
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
            await updateDB(post, param);
            setDislike(!dislike);
            return;
         }
         // si dislike = false => post.dislike += et ajouter userId dans post.userDislike
         if (dislike === false) {
            console.log('post.dislike ++ post.userDislike +user');
            // ajouter le dislike -1 => BD
            const param = -1;
            await updateDB(post, param);
            setDislike(!dislike);
         }
      }
   };

   return (
      <Grid item xs={12} sm={6} md={4} lg={3}>
         <Card sx={{ maxWidth: 345 }}>
            <CardHeader
               avatar={<Avatar aria-label="recipe">R</Avatar>}
               title={`Posté par ${post.userId}`}
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
                  badgeContent={post.like}
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
                  badgeContent={post.dislike}
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

async function updateDB(post, param) {
   try {
      const reponse = await axios.put(
         `http://localhost:3001/api/postLike/${post.id}`,
         {
            like: param,
         },
         { withCredentials: true }
      );
      console.log(reponse.data);
   } catch (error) {
      if (error.code === 'ERR_BAD_RESPONSE') {
         console.log(error.response.data.message);
      } else {
         console.log(error.response.data.error.message);
      }
      console.log(error);
   }
}
