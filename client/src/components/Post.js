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

   const handleClickLike = () => {
      // si dislike = true => ne fait rien
      if (dislike !== true) {
         // si like = true => post.like -= et retirer userId de post.userLike
         if (like === true) {
            if (post.like > 0) {
               // post.like --
               console.log('post.like --');
            }
            // post.userLike = post.userLike.filter(!userId)
            console.log('post.userLike -user');
            // enregister le post
            setLike(!like);
            return;
         }
         // si like = false => post.like += et ajouter userId dans post.userLike
         if (like === false) {
            // post.like ++
            console.log('post.like ++');
            // post.userLike.push(userId)
            console.log('post.userLike +user');
            // enregister le post
            setLike(!like);
         }
      }
   };

   const handleClickDislike = () => {
      // si like = true => ne fait rien
      if (like !== true) {
         // si dislike = true => post.dislike -= et retirer userId de post.userDislike
         if (dislike === true) {
            if (post.dislike > 0) {
               // post.dislike --
               console.log('post.dislike --');
            }
            // post.userDislike = post.userdislike.filter(!userId)
            console.log('post.userDislike -user');
            // enregister le post
            setDislike(!dislike);
            return;
         }
         // si dislike = false => post.dislike += et ajouter userId dans post.userDislike
         if (dislike === false) {
            // post.dislike ++
            console.log('post.dislike ++');
            // post.userdislike.push(userId)
            console.log('post.userDislike +user');
            // enregister le post
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
