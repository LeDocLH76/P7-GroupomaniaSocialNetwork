import {
   Alert,
   AlertTitle,
   Box,
   Button,
   ButtonGroup,
   Container,
   CssBaseline,
   Grid,
   Input,
   TextField,
   Typography,
} from '@mui/material';
import axios from 'axios';
import React from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Signup({ setIsAuth }) {
   const navigate = useNavigate();

   const [emailExist, setEmailExist] = useState(false);
   const handleSubmit = async (event) => {
      event.preventDefault();

      const pseudo = event.target[0].value;
      const email = event.target[2].value;
      const password = event.target[4].value;
      const image = event.target[6].value;
      console.log(pseudo, email, password, image);
      const data = new FormData(event.currentTarget);
      console.log({
         pseudo: data.get('pseudo'),
         email: data.get('email'),
         password: data.get('password'),
         image: data.get('image'),
      });
      try {
         const reponse = await axios({
            method: 'post',
            url: 'http://localhost:3001/api/userCreate',
            data: data,
            headers: { 'Content-Type': 'multipart/form-data' },
            withCredentials: true,
         });
         setIsAuth(true);
         navigate('/main');
      } catch (error) {
         if (error.code === 'ERR_BAD_RESPONSE') {
            console.log(error.response.data.message);
            setEmailExist(true);
         } else {
            console.log(error.response.data.error.message);
         }

         console.log(error);
      }
   };

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
               Création du compte
            </Typography>
            <Box component="form" novalidate onSubmit={handleSubmit}>
               <Grid container spacing={2}>
                  <Grid item xs={12}>
                     <TextField required id="pseudo" label="Pseudo" name="pseudo" autoComplete="pseudo" />
                  </Grid>

                  <Grid item xs={12}>
                     <TextField
                        onClick={() => setEmailExist(false)}
                        required
                        id="email"
                        label="Adresse email"
                        name="email"
                        autoComplete="email"
                     />
                  </Grid>

                  <Grid item xs={12}>
                     <TextField
                        required
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="New-password"
                     />
                  </Grid>

                  <Grid item xs={12}>
                     <Typography variant="h5" mt={2}>
                        Choisissez votre avatar
                     </Typography>
                  </Grid>

                  <Grid item xs={12}>
                     <Input accept="image/*" name="image" label="Avatar" type="file" id="image" />
                  </Grid>
               </Grid>
               {emailExist ? (
                  <Alert severity="error" sx={{ display: 'flex', justifyContent: 'center' }}>
                     <AlertTitle>Erreur</AlertTitle>
                     Cette adresse email existe déja
                  </Alert>
               ) : null}
               <ButtonGroup sx={{ mt: 3, mb: 3 }}>
                  <Button variant="contained">
                     <Link to="/">Acceuil</Link>
                  </Button>
                  <Button type="submit" variant="contained">
                     Enregistrer
                  </Button>
               </ButtonGroup>
            </Box>
         </Box>
      </Container>
   );
}
