import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import { Box, Button, ButtonGroup, Grid, TextField, Typography } from '@mui/material';

export default function FormCommentCreate({
   comments,
   setComments,
   post,
   badgeComment,
   setBadgeComment,
   setShowAddComment,
}) {
   const navigate = useNavigate();
   const handleSubmit = async (event) => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);

      // Si le commentaire est vide éfface la zone de saisie, pour le moment...
      if (data.get('body') === '') {
         console.log('Le commentaire ne peut être vide');
         setShowAddComment(false);
         return;
      }

      // Récupère le body dans formData
      const body = { body: data.get('body'), postId: post.id };
      try {
         const response = await axios.post('http://localhost:3001/api/commentCreate', body, { withCredentials: true });
         console.log(response.data);
         const newComments = comments;
         newComments.unshift(response.data);
         setBadgeComment(badgeComment + 1);
         setComments(newComments);
         // setShowAddComment(false);
      } catch (error) {
         if (error.code === 'ERR_BAD_RESPONSE') {
            console.log(error.response.data.message);
         } else {
            console.log(error.response.data.error.message);
         }
         if (error.response.status === 401) {
            console.log(error.response.statusText);
            navigate('/login');
         }
         console.log(error);
      }
   };

   return (
      <Box component="form" novalidate onSubmit={handleSubmit}>
         <Grid container spacing={1}>
            <Grid item xs={12}>
               <Typography variant="h6">Commenter</Typography>
            </Grid>

            <Grid item xs={12}>
               <TextField id="body" label="Contenu" name="body" multiline rows={3} fullWidth={true} />
            </Grid>
         </Grid>

         <ButtonGroup sx={{ mt: 1 }}>
            <Button type="submit" variant="contained">
               Enregistrer
            </Button>
            <Button
               variant="contained"
               onClick={() => {
                  setShowAddComment(false);
               }}
            >
               Annuler
            </Button>
         </ButtonGroup>
      </Box>
   );
}
