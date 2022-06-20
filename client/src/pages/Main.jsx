import { Box, Button, ButtonGroup, Container, CssBaseline, Grid, Typography } from '@mui/material';

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Post from '../components/Post';

export default function Main({ isAuth, setIsAuth, userId, userAvatar }) {
   const [posts, setPosts] = useState([]);
   const navigate = useNavigate();
   // console.log('isAuth = ', isAuth);
   // console.log('userId = ', userId);
   // console.log('userAvatar = ', userAvatar);

   useEffect(() => {
      const posts = async () => {
         try {
            const reponse = await axios({
               method: 'get',
               url: 'http://localhost:3001/api/posts',
               withCredentials: true,
            });

            console.log('reponse.data = ', reponse.data);
            setPosts(reponse.data);
         } catch (error) {
            if (error.response.status === 401) {
               console.log(error.response.statusText);
               navigate('/login');
            }
            // else {
            //    console.log(error.response.data.error.message);
            // }
            console.log(error);
         }
      };
      posts();
   }, [navigate]);

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
               {posts.map((post) => (
                  <Post post={post} userId={userId} key={post.id} />
               ))}
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
