import '../styles/site.css';
import { Box, Button, ButtonGroup, Container, CssBaseline, Grid, Typography, Avatar, Chip } from '@mui/material';
import Masonry from '@mui/lab/Masonry';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createTheme, ThemeProvider, experimental_sx as sx } from '@mui/material';
import Post from '../components/Post';
import Disconnect from '../components/Disconnect';

const themeChip = createTheme({
   components: {
      MuiChip: {
         styleOverrides: {
            root: sx({
               borderWidth: 3,
               borderRadius: 25,
               borderColor: '#FFD7D7',
               height: 50,
               fontSize: '2rem',
            }),
            avatar: sx({
               width: 45,
               height: 45,
            }),
         },
      },
   },
});

export default function Main({ isAuth, setIsAuth, isAdmin, setIsAdmin, userPseudo, userId, userAvatar }) {
   const [posts, setPosts] = useState([]);
   const navigate = useNavigate();

   useEffect(() => {
      const posts = async () => {
         try {
            const reponse = await axios({
               method: 'get',
               url: 'http://localhost:3001/api/posts',
               withCredentials: true,
            });
            console.log('Liste des posts au chargement = ', reponse.data);
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
            <header>
               <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <img src="./icon.svg" alt="Logo groupomania" width="50" height="50" />
                  <Typography variant="h5" component="h1" sx={{ color: 'primary.main' }}>
                     Groupomania Social Network
                  </Typography>
               </Box>
               <Typography variant="h6" component="h2">
                  Les dernières publications
               </Typography>

               <Grid component="nav" container spacing={2}>
                  <Grid item xs={12} sm={4}>
                     <ButtonGroup sx={{ mt: 1, mb: 1 }}>
                        <Button variant="contained">
                           <Link to="/">Acceuil</Link>
                        </Button>
                        <Button variant="contained">
                           <Link to="/postCreate">Publier</Link>
                        </Button>
                     </ButtonGroup>
                  </Grid>

                  <Grid item xs={12} sm={4}>
                     <ThemeProvider theme={themeChip}>
                        <Chip
                           avatar={<Avatar alt="votre avatar" src={userAvatar} sx={{ width: 40, height: 40 }}></Avatar>}
                           label={userPseudo}
                           variant="outlined"
                        />{' '}
                     </ThemeProvider>
                  </Grid>

                  <Grid item xs={12} sm={4}>
                     <ButtonGroup sx={{ mt: 1, mb: 1 }}>
                        <Disconnect setIsAuth={setIsAuth} setIsAdmin={setIsAdmin} />
                        <Button variant="contained">
                           {/* Mon compte */}
                           <Link to="/compte">Mon compte</Link>
                        </Button>
                     </ButtonGroup>
                  </Grid>
               </Grid>
            </header>

            {/* <Grid component="main" container spacing={3}> */}
            <Masonry component="main" columns={{ xs: 1, sm: 2, md: 3, lg: 4 }} spacing={3}>
               {posts.map((post) => (
                  <Post
                     post={post}
                     userId={userId}
                     key={post.id}
                     posts={posts}
                     setPosts={setPosts}
                     isAdmin={isAdmin}
                     setIsAdmin={setIsAdmin}
                     setIsAuth={setIsAuth}
                  />
               ))}
            </Masonry>
            {/* </Grid> */}
         </Box>
      </Container>
   );
}
