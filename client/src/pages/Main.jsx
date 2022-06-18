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
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Main({ isAuth, setIsAuth }) {
   const [posts, setPosts] = useState([]);

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
            // if (error.code === 'ERR_BAD_RESPONSE') {
            //    console.log(error.response.data.message);
            // } else {
            //    console.log(error.response.data.error.message);
            // }
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
               {posts.map((post) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={post.id}>
                     <Card sx={{ maxWidth: 345 }}>
                        <CardHeader
                           avatar={<Avatar aria-label="recipe">R</Avatar>}
                           title={`Posté par ${post.userId}`}
                           subheader={post.updatedAt}
                        />
                        {post.picture.map((image, i) => (
                           <CardMedia
                              component="img"
                              height="194"
                              image={image}
                              alt={`image ${i + 1} du post`}
                              key={i}
                           />
                        ))}

                        <CardContent>
                           <Typography variant="body2" color="text.secondary">
                              {post.body}
                           </Typography>
                        </CardContent>
                     </Card>
                  </Grid>
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
