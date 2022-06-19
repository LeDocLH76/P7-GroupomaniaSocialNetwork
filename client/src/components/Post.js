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

function Post({ post }) {
   const date = new Date(post.updatedAt);
   // userId?
   // userId dans post.userLike?
   // userId dans post.userDislike?
   // si userId dans post.userLike setLike = true
   // si userId dans post.userDislike setDislike = true
   // !! like et dislike pas == true les deux !!

   const [like, setLike] = useState(false);
   const [dislike, setDislike] = useState(false);

   const handleClickLike = () => {
      // si dislike = true => ne fait rien
      // si like = true => post.like -= et retirer userId de post.userLike (vérifier l'état avant!!)
      // si like = false => post.like += et ajouter userId dans post.userLike (vérifier l'état avant!!)
      // enregister le post
      setLike(!like);
   };

   const handleClickDislike = () => {
      // si like = true => ne fait rien
      setDislike(!dislike);
   };

   return (
      <Grid item xs={12} sm={6} md={4} lg={3} key={post.id}>
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
