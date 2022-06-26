import { Box, Button, ButtonGroup, Container, CssBaseline, Typography } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DeleteAccount from '../components/DeleteAccount';

export default function Compte({ setIsAuth, setIsAdmin }) {
   const navigate = useNavigate();
   const [showDelete, setShowDelete] = useState(false);

   function back() {
      navigate('/main');
   }

   function deleteAccount() {
      setShowDelete(!showDelete);
   }

   return (
      <Container maxWidth="lg">
         <CssBaseline />
         <Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
               <img src="./icon.svg" alt="Logo groupomania" width="50" height="50" />
               <Typography variant="h5" component="h1" sx={{ color: 'primary.main' }}>
                  Groupomania Social Network
               </Typography>
            </Box>
            <Typography variant="h6" component="h2">
               Gestion du compte = En travaux
            </Typography>
            <ButtonGroup sx={{ mt: 3, mb: 3 }}>
               <Button variant="contained" onClick={back}>
                  Retour
               </Button>
               <Button variant="contained" onClick={deleteAccount}>
                  Supprimer le compte
               </Button>
            </ButtonGroup>
            {showDelete ? <DeleteAccount setIsAuth={setIsAuth} setIsAdmin={setIsAdmin} /> : null}
         </Box>
      </Container>
   );
}
