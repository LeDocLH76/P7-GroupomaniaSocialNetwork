import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import { Box, Button, Grid, TextField, Typography } from '@mui/material';

export default function FormCommentCreate(post) {
   const navigate = useNavigate();
   const handleSubmit = async (event) => {
      event.preventDefault();

      const data = new FormData(event.currentTarget);
      // Recupère le body dans formData
      const body = { body: data.get('body'), postId: post.post.id };

      console.log(body);
      try {
         const response = await axios.post('http://localhost:3001/api/commentCreate', body, { withCredentials: true });
         console.log(response);
         navigate('/main');
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
         <Grid container spacing={2}>
            <Grid item xs={12}>
               <Typography variant="h6">Commenter</Typography>
            </Grid>

            <Grid item xs={12}>
               <TextField id="body" label="Contenu" name="body" multiline rows={3} fullWidth={true} />
            </Grid>
         </Grid>

         <Button type="submit" variant="contained" sx={{ mt: 3 }}>
            Enregistrer
         </Button>
      </Box>
   );
}
