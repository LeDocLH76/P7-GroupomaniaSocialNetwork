import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import { Box, Button, ButtonGroup, Grid, TextField, Typography } from '@mui/material';

export default function FormCommentCreate({
   post,
   setPosts,
   badgeComment,
   setBadgeComment,
   setShowAddComment,
   setIsAuth,
   setIsAdmin,
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

         try {
            const response = await axios.get(`http://localhost:3001/api/posts`, {
               withCredentials: true,
            });
            console.log('Les posts = ', response.data);
            setBadgeComment(badgeComment + 1);
            setShowAddComment(false);
            setPosts(response.data);
         } catch (error) {
            if (error.response.status === 401) {
               console.log(error.response.statusText);
               localStorage.removeItem('user');
               setIsAuth(false);
               setIsAdmin(false);
               navigate('/login');
            }
            // else {
            //    console.log(error.response.data.error.message);
            // }
            console.log(error);
         }
      } catch (error) {
         if (error.code === 'ERR_BAD_RESPONSE') {
            console.log(error.response.data.message);
         } else {
            console.log(error.response.data.error.message);
         }
         if (error.response.status === 401) {
            console.log(error.response.statusText);
            localStorage.removeItem('user');
            setIsAuth(false);
            setIsAdmin(false);
            navigate('/login');
         }
         console.log(error);
      }
   };

   return (
      <Box component="form" novalidate onSubmit={handleSubmit}>
         <Grid container spacing={1}>
            <Grid item xs={12}>
               <Typography component="h3" variant="h6">
                  Commenter
               </Typography>
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
