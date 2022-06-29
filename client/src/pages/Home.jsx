import { Typography, Button, Stack, Grid, Container } from '@mui/material';
import '../styles/site.css';
import '../styles/home.css';
import { Link } from 'react-router-dom';

export default function Home() {
   return (
      <main className="page">
         <Stack paddingTop={20}>
            <div>
               <img src="./icon.svg" alt="Logo groupomania" width="80" height="80" />
            </div>
            <Typography variant="h3" component="h1" mb={5} sx={{ color: 'primary.main' }}>
               Groupomania Social Network
            </Typography>
         </Stack>
         <Container maxWidth="sm">
            <Grid container spacing={3}>
               <Grid item xs={12} sm={6}>
                  <Button variant="contained">
                     <Link to="/signup">S'inscrire</Link>
                  </Button>
               </Grid>
               <Grid item xs={12} sm={6}>
                  <Button variant="contained">
                     <Link to="/login">Se connecter</Link>
                  </Button>
               </Grid>
            </Grid>
         </Container>
      </main>
   );
}
