import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import {
   FormControl,
   InputLabel,
   OutlinedInput,
   IconButton,
   InputAdornment,
   Button,
   Box,
   TextField,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

export default function Login() {
   const navigate = useNavigate();
   // const [values, setValues] = useState({
   //    password: '',
   //    showPassword: false,
   // });

   // const handleChange = (prop) => (event) => {
   //    setValues({ ...values, [prop]: event.target.value });
   // };

   // const handleClickShowPassword = () => {
   //    setValues({
   //       ...values,
   //       showPassword: !values.showPassword,
   //    });
   // };

   // const handleMouseDownPassword = (event) => {
   //    event.preventDefault();
   // };

   const handleSubmit = async (event) => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      const password = data.get('password');
      console.log(password);

      try {
         const reponse = await axios.delete('http://localhost:3001/api/userDelete', password, {
            withCredentials: true,
         });
         console.log(reponse);
         // navigate('/');
      } catch (error) {
         // if (error.response.status === 401) {
         //    console.log(error.response.statusText);
         //    navigate('/login');
         // }

         console.log(error);
      }
   };

   return (
      <Box component="form" novalidate onSubmit={handleSubmit}>
         <TextField
            required
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="New-password"
         />
         {/* {emailExist ? (
                  <Alert severity="error" sx={{ display: 'flex', justifyContent: 'center' }}>
                     <AlertTitle>Erreur</AlertTitle>
                     Cette adresse email existe déja
                  </Alert>
               ) : null} */}
         <Button type="submit" variant="contained">
            Supprimer
         </Button>
      </Box>
   );
}
