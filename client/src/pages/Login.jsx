import '../styles/site.css';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import {
   Box,
   Button,
   ButtonGroup,
   Container,
   CssBaseline,
   Grid,
   IconButton,
   InputAdornment,
   TextField,
   Typography,
} from '@mui/material';
import axios from 'axios';
import React from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { userLoginSchema } from '../Validations/userLoginValidation';

export default function Login({ setIsAuth, setIsAdmin, setUserId, setUserAvatar, setUserPseudo }) {
   const navigate = useNavigate();
   const [showPassword, setShowPassword] = useState(false);
   const [showMessageEmail, setShowMessageEmail] = useState(false);

   const handleClickShowPassword = () => {
      setShowPassword(!showPassword);
   };

   const handleMouseDownPassword = (event) => {
      event.preventDefault();
   };

   const handleSubmit = async (event) => {
      event.preventDefault();

      const data = new FormData(event.currentTarget);
      const email = data.get('email');
      const password = data.get('password');
      console.log(email, password);
      //Valider les inputs *********************
      const user = { email: email, password: password };
      const isValid = await userLoginSchema.isValid(user);
      if (!isValid) {
         // input invalide
         setShowMessageEmail(true);
      } else {
         // input valide
         try {
            const reponse = await axios.post(
               'http://localhost:3001/api/logUser',
               {
                  email: email,
                  password: password,
               },
               { withCredentials: true }
            );
            console.log('reponse.data = ', reponse.data);
            setIsAuth(true);
            setUserId(reponse.data.id);
            setUserAvatar(reponse.data.avatar);
            setUserPseudo(reponse.data.pseudo);
            if (reponse.data.role === 'admin') {
               setIsAdmin(true);
            } else {
               setIsAdmin(false);
            }
            navigate('/main');
         } catch (error) {
            if (error.code === 'ERR_BAD_RESPONSE') {
               console.log(error.response.data.message);
            } else {
               console.log(error.response.data.error.message);
            }
            console.log(error);
            setShowMessageEmail(true);
         }
      }
   };

   return (
      <Container component="main" maxWidth="lg">
         <CssBaseline />
         <Box>
            <div>
               <img src="./icon.svg" alt="Logo groupomania" width="80" height="80" />
            </div>
            <Typography variant="h3" component="h1" mb={5} sx={{ color: 'primary.main' }}>
               Groupomania Social Network
            </Typography>
            <Typography variant="h4" component="h2" mb={2}>
               Connection
            </Typography>
            <Box component="form" novalidate onSubmit={handleSubmit}>
               <Grid container spacing={2}>
                  <Grid item xs={12}>
                     <TextField
                        aria-label="Saisie de l'email"
                        onClick={() => {
                           setShowMessageEmail(false);
                        }}
                        required
                        id="email"
                        label="Adresse email"
                        name="email"
                        autoComplete="email"
                     />
                  </Grid>

                  <Grid item xs={12}>
                     <Typography sx={{ mt: 3, mb: 3, fontSize: 20 }}>
                        {showMessageEmail ? 'Email ou password invalide' : 'Entrer email et password svp'}
                     </Typography>
                  </Grid>

                  <Grid item xs={12}>
                     <TextField
                        aria-label="Saisie du password"
                        onClick={() => {
                           setShowMessageEmail(false);
                        }}
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
                                    aria-label={showPassword ? 'password visible' : 'password cach??'}
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
               </Grid>
               <ButtonGroup sx={{ mt: 3, mb: 3 }}>
                  <Button variant="groupomania">
                     <Link to="/">Acceuil</Link>
                  </Button>
                  <Button type="submit" variant="groupomania">
                     Valider
                  </Button>
               </ButtonGroup>
            </Box>
         </Box>
      </Container>
   );
}
