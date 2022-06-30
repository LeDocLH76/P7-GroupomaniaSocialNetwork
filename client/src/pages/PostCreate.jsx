import '../styles/site.css';
import { Box, Container, CssBaseline, Typography } from '@mui/material';
import React from 'react';
import FormPostCreate from '../components/FormPostCreate';

export default function PostCreate({ setIsAuth, setIsAdmin, setUserAvatar, setUserPseudo }) {
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
            <FormPostCreate
               setIsAuth={setIsAuth}
               setIsAdmin={setIsAdmin}
               setUserAvatar={setUserAvatar}
               setUserPseudo={setUserPseudo}
            />
         </Box>
      </Container>
   );
}
