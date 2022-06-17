import {
   Avatar,
   Box,
   Button,
   ButtonGroup,
   Card,
   CardContent,
   CardHeader,
   CardMedia,
   Container,
   CssBaseline,
   Grid,
   Typography,
} from '@mui/material';
import axios from 'axios';
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Main({ isAuth, setIsAuth }) {
   useEffect(() => {
      console.log('Coucou une seule fois');
      const posts = async () => {
         try {
            const reponse = await axios.get('http://localhost:3001/api/posts');
            console.log('reponse = ', reponse);
         } catch (error) {
            if (error.code === 'ERR_BAD_RESPONSE') {
               console.log(error.response.data.message);
            } else {
               console.log(error.response.data.error.message);
            }
            console.log(error);
         }
      };
      posts();
   }, []);

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
               Les dernières publications
            </Typography>
            {/* ************************** */}
            <Grid container spacing={3}>
               <Grid item xs={12} sm={6} md={4} lg={3}>
                  <Card sx={{ maxWidth: 345 }}>
                     <CardHeader
                        avatar={<Avatar aria-label="recipe">R</Avatar>}
                        title="Shrimp and Chorizo Paella"
                        subheader="September 14, 2016"
                     />
                     <CardMedia component="img" height="194" image=".\icon-above-font.png" alt="Paella dish" />
                     <CardContent>
                        <Typography variant="body2" color="text.secondary">
                           This impressive paella is a perfect party dish and a fun meal to cook together with your
                           guests. Add 1 cup of frozen peas along with the mussels, if you like.
                        </Typography>
                     </CardContent>
                  </Card>
               </Grid>
               <Grid item xs={12} sm={6} md={4} lg={3}>
                  <Card sx={{ maxWidth: 345 }}>
                     <CardHeader
                        avatar={<Avatar aria-label="recipe">R</Avatar>}
                        title="Shrimp and Chorizo Paella"
                        subheader="September 14, 2016"
                     />
                     <CardMedia component="img" height="194" image=".\icon-above-font.png" alt="Paella dish" />
                     <CardContent>
                        <Typography variant="body2" color="text.secondary">
                           This impressive paella is a perfect party dish and a fun meal to cook together with your
                           guests. Add 1 cup of frozen peas along with the mussels, if you like.
                        </Typography>
                     </CardContent>
                  </Card>
               </Grid>
               <Grid item xs={12} sm={6} md={4} lg={3}>
                  <Card sx={{ maxWidth: 345 }}>
                     <CardHeader
                        avatar={<Avatar aria-label="recipe">R</Avatar>}
                        title="Shrimp and Chorizo Paella"
                        subheader="September 14, 2016"
                     />
                     <CardMedia component="img" height="194" image=".\icon-above-font.png" alt="Paella dish" />
                     <CardContent>
                        <Typography variant="body2" color="text.secondary">
                           This impressive paella is a perfect party dish and a fun meal to cook together with your
                           guests. Add 1 cup of frozen peas along with the mussels, if you like.
                        </Typography>
                     </CardContent>
                  </Card>
               </Grid>
               <Grid item xs={12} sm={6} md={4} lg={3}>
                  <Card sx={{ maxWidth: 345 }}>
                     <CardHeader
                        avatar={<Avatar aria-label="recipe">R</Avatar>}
                        title="Shrimp and Chorizo Paella"
                        subheader="September 14, 2016"
                     />
                     <CardMedia component="img" height="194" image=".\icon-above-font.png" alt="Paella dish" />
                     <CardContent>
                        <Typography variant="body2" color="text.secondary">
                           This impressive paella is a perfect party dish and a fun meal to cook together with your
                           guests. Add 1 cup of frozen peas along with the mussels, if you like.
                        </Typography>
                     </CardContent>
                  </Card>
               </Grid>
            </Grid>

            {/* ************************** */}
            <ButtonGroup sx={{ mt: 3, mb: 3 }}>
               <Button variant="contained">
                  <Link to="/">Acceuil</Link>
               </Button>
               <Button variant="contained">Ne fait rien</Button>
            </ButtonGroup>
         </Box>
      </Container>
   );
}
