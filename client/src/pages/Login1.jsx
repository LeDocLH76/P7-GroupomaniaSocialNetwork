import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

import {
   Stack,
   FormControl,
   InputLabel,
   OutlinedInput,
   IconButton,
   InputAdornment,
   FormHelperText,
   Typography,
   ButtonGroup,
   Button,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import '../styles/login.css';

export default function Login1({
   isAuth,
   setIsAuth,
   isAdmin,
   setIsAdmin,
   userId,
   setUserId,
   userAvatar,
   setUserAvatar,
}) {
   const navigate = useNavigate();
   // console.log('props = ', props);
   // console.log('isAuth = ', isAuth);
   // console.log('setIsAuth = ', setIsAuth);
   const [values, setValues] = useState({
      password: '',
      showPassword: false,
      email: '',
   });

   const handleChange = (prop) => (event) => {
      setValues({ ...values, [prop]: event.target.value });
   };

   const handleClickShowPassword = () => {
      setValues({
         ...values,
         showPassword: !values.showPassword,
      });
   };

   const handleMouseDownPassword = (event) => {
      event.preventDefault();
   };

   const handleLogin = async (isAuth, setIsAuth, isAdmin, setIsAdmin, userId, setUserId, userAvatar, setUserAvatar) => {
      console.log(values.email, values.password);
      try {
         const reponse = await axios.post(
            'http://localhost:3001/api/logUser',
            {
               email: values.email,
               password: values.password,
            },
            { withCredentials: true }
         );
         console.log(reponse.data);

         setIsAuth(true);
         setUserId(reponse.data.id);
         console.log('reponse.data.role = ', reponse.data.role);
         setUserAvatar(reponse.data.avatar);
         if (reponse.data.role === 'admin') {
            setIsAdmin(true);
         } else {
            setIsAdmin(false);
         }
         navigate('/main');
      } catch (error) {
         // if (error.code === 'ERR_BAD_RESPONSE') {
         //    console.log(error.response.data.message);
         // } else {
         //    console.log(error.response.data.error.message);
         // }
         console.log(error);
      }
   };

   return (
      <div className="page">
         <Stack paddingTop={20}>
            <div>
               <img src="./icon.svg" alt="Logo groupomania" width="80" height="80" />
            </div>
            <Typography variant="h3" component="h1" mb={5} sx={{ color: 'primary.main' }}>
               Groupomania Social Network
            </Typography>
         </Stack>
         <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
            <InputLabel htmlFor="outlined-adornment-email">Email</InputLabel>
            <OutlinedInput
               id="outlined-adornment-email"
               value={values.email}
               onChange={handleChange('email')}
               aria-describedby="outlined-email-helper-text"
               inputProps={{
                  'aria-label': 'email',
               }}
            />
            <FormHelperText id="outlined-weight-helper-text">Email valide</FormHelperText>
         </FormControl>
         <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
            <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
            <OutlinedInput
               id="outlined-adornment-password"
               type={values.showPassword ? 'text' : 'password'}
               value={values.password}
               onChange={handleChange('password')}
               endAdornment={
                  <InputAdornment position="end">
                     <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                     >
                        {values.showPassword ? <VisibilityOff /> : <Visibility />}
                     </IconButton>
                  </InputAdornment>
               }
               label="Password"
            />
         </FormControl>
         <ButtonGroup>
            <Button variant="contained">
               <Link to="/">Acceuil</Link>
            </Button>
            <Button
               variant="contained"
               onClick={() =>
                  handleLogin(isAuth, setIsAuth, isAdmin, setIsAdmin, userId, setUserId, userAvatar, setUserAvatar)
               }
            >
               Valider
            </Button>
         </ButtonGroup>
      </div>
   );
}
