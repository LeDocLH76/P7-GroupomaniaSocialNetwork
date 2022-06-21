import { Box, Button, ButtonGroup, Grid, Input, TextField, Typography } from '@mui/material';
import axios from 'axios';
import React from 'react';
import { Link } from 'react-router-dom';

export default function FormPostCreate() {
   const handleSubmit = async (event) => {
      event.preventDefault();
      // Recupère les entrées du formulaire
      const data = new FormData(event.currentTarget);
      // Recupère le tableau des images et le supprime du formData
      const images = data.getAll('images');
      data.delete('images');
      // // Selectionne les x premiers éléments du tableau 3 max
      images.length = 3;
      // // et les rajoutes dans le formData
      for (let index = 0; index < images.length; index++) {
         data.append('images', images[index]);
      }
      console.log(data.getAll('images'));
      try {
         const response = await axios({
            method: 'post',
            url: 'http://localhost:3001/api/postCreate',
            data: data,
            headers: { 'Content-Type': 'multipart/form-data' },
            withCredentials: true,
         });
         console.log(response);
      } catch (error) {
         if (error.code === 'ERR_BAD_RESPONSE') {
            console.log(error.response.data.message);
         } else {
            if (error.response.status === 401) {
               console.log(error.response.statusText);
               // navigate('/login');
            }

            console.log(error.response.data.error.message);
         }

         console.log(error);
      }
   };

   return (
      <Box component="form" novalidate onSubmit={handleSubmit}>
         <Grid container spacing={2}>
            <Grid item xs={12}>
               <TextField required id="body" label="Contenu" name="body" multiline rows={5} fullWidth={true} />
            </Grid>

            <Grid item xs={12}>
               <Typography variant="h5" mt={2}>
                  Choisissez vos photos (3 maximum)
               </Typography>
            </Grid>

            <Grid item xs={12}>
               <Input
                  type="file"
                  inputProps={{ multiple: true }}
                  accept="image/*"
                  name="images"
                  label="Photo"
                  id="images"
               />
            </Grid>
         </Grid>
         <ButtonGroup sx={{ mt: 3, mb: 3 }}>
            <Button variant="contained">
               <Link to="/">Acceuil</Link>
            </Button>
            <Button type="submit" variant="contained">
               Enregistrer
            </Button>
            <Button variant="contained">
               <Link to="/main">Annuler</Link>
            </Button>
         </ButtonGroup>
      </Box>
   );
}
