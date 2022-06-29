import '../styles/site.css';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import {
   Alert,
   AlertTitle,
   Box,
   Button,
   ButtonGroup,
   Container,
   CssBaseline,
   Grid,
   IconButton,
   Input,
   InputAdornment,
   Popover,
   TextField,
   Typography,
} from '@mui/material';
import axios from 'axios';
import React from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { userCreateSchema } from '../Validations/userCreateValidation';

export default function Signup({ setIsAuth, setIsAdmin, setUserId, setUserAvatar, setUserPseudo }) {
   const navigate = useNavigate();

   const [emailExist, setEmailExist] = useState(false);
   const [showPassword, setShowPassword] = useState(false);

   const [anchorEl, setAnchorEl] = useState(null);
   const handleClose = () => {
      setAnchorEl(null);
   };
   const open = Boolean(anchorEl);
   const id = open ? 'simple-popover' : undefined;

   const handleClickShowPassword = () => {
      setShowPassword(!showPassword);
   };

   const handleMouseDownPassword = (event) => {
      event.preventDefault();
   };

   const handleSubmit = async (event) => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      const pseudo = data.get('pseudo');
      const email = data.get('email');
      const password = data.get('password');
      const image = data.get('image');
      console.log(pseudo, email, password, image);
      //Valider les inputs *********************
      const user = {
         pseudo: pseudo,
         email: email,
         password: password,
      };
      const isValid = await userCreateSchema.isValid(user);
      console.log('isValid = ', isValid);
      if (!isValid) {
         // input invalide
         // console.log('Invalide');
         setAnchorEl(event.target);
      } else {
         // input valide
         // console.log('Valide');
         try {
            const reponse = await axios({
               method: 'post',
               url: 'http://localhost:3001/api/userCreate',
               data: data,
               headers: { 'Content-Type': 'multipart/form-data' },
               withCredentials: true,
            });
            console.log(reponse);
            if (reponse.data.role === 'admin') {
               setIsAdmin(true);
            } else {
               setIsAdmin(false);
            }
            setUserId(reponse.data.id);
            setUserAvatar(reponse.data.avatar);
            setUserPseudo(reponse.data.pseudo);
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
                     <TextField
                        aria-label="Saisie du pseudo"
                        required
                        id="pseudo"
                        label="Pseudo"
                        name="pseudo"
                        autoComplete="pseudo"
                     />
                  </Grid>

                  <Grid item xs={12}>
                     <TextField
                        aria-label="Saisie de l'email"
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
                        aria-label="Saisie du password"
                        required
                        name="password"
                        label="Password"
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        autoComplete="New-password"
                        InputProps={{
                           endAdornment: (
                              <InputAdornment position="end">
                                 <IconButton
                                    aria-label={showPassword ? 'password visible' : 'password caché'}
                                    onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                    edge="end"
                                 >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                 </IconButton>
                              </InputAdornment>
                           ),
                        }}
                     />
                  </Grid>

                  <Grid item xs={12}>
                     <Typography variant="h5" mt={2}>
                        Choisissez votre avatar
                     </Typography>
                  </Grid>

                  <Grid item xs={12}>
                     <Input
                        aria-label="Choisir une image"
                        accept="image/*"
                        name="image"
                        label="Avatar"
                        type="file"
                        id="image"
                     />
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

               <Popover
                  id={id}
                  open={open}
                  anchorEl={anchorEl}
                  onClose={handleClose}
                  anchorOrigin={{
                     vertical: 'bottom',
                     horizontal: 'left',
                  }}
               >
                  <Typography sx={{ p: 2 }}>
                     Email valide et password de 8 à 30 caractères, mini 1 minuscule 1 majuscule et 1 caractère @$!%*?&
                  </Typography>
               </Popover>
            </Box>
         </Box>
      </Container>
   );
}
