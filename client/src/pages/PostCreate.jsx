import { Box, Button, ButtonGroup, Container, CssBaseline, Grid, Input, TextField, Typography } from '@mui/material';
import axios from 'axios';
import React from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

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
      const reponse = await axios({
         method: 'post',
         url: 'http://localhost:3001/api/postCreate',
         data: data,
         headers: { 'Content-Type': 'multipart/form-data' },
         withCredentials: true,
      });
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

export default function PostCreate() {
   return (
      <Container maxWidth="lg">
         <CssBaseline />
         <Box>
            <div>
               <img src="./icon.svg" alt="Logo groupomania" width="80" height="80" />
            </div>
            <Typography variant="h3" component="h1" mb={5} sx={{ color: 'primary.main' }}>
               Groupomania Social Network
            </Typography>
            <Typography variant="h4" component="h2" mb={2}>
               Création d'une publication
            </Typography>
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
                  <Button variant="contained"></Button>
                  <Button type="submit" variant="contained">
                     Enregistrer
                  </Button>
                  <Button type="submit" variant="contained">
                     <Link to="/main">Les publications</Link>
                  </Button>
               </ButtonGroup>
            </Box>
         </Box>
      </Container>
   );
}
