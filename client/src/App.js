import './styles/App.css';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Main from './pages/Main';
import Compte from './pages/Compte';
import PostCreate from './pages/PostCreate';
import { useEffect, useState } from 'react';
import { createTheme, ThemeProvider } from '@mui/material';

const theme = createTheme({
   palette: {
      primary: {
         light: '#ff6a38',
         main: '#fd2d01',
         dark: '#c10000',
         contrastText: '#000',
      },
      secondary: {
         light: '#ffffff',
         main: '#fdd7d7',
         dark: '#cba6a6',
         contrastText: '#000',
      },
      text: {
         primary: '#4e5166',
      },
   },
   typography: {
      fontFamily: 'Lato',
   },
});

function App() {
   const [isAuth, setIsAuth] = useState(false);
   const [isAdmin, setIsAdmin] = useState(false);
   const [userId, setUserId] = useState(0);
   const [userAvatar, setUserAvatar] = useState('');
   const [userPseudo, setUserPseudo] = useState('');

   useEffect(() => {
      if (localStorage.getItem('user')) {
         const userStored = JSON.parse(localStorage.getItem('user'));
         console.log('user in storage = ', userStored);
         setIsAuth(userStored.isAuth);
         setIsAdmin(userStored.isAdmin);
         setUserId(userStored.userId);
         setUserAvatar(userStored.userAvatar);
         setUserPseudo(userStored.userPseudo);
      } else {
         console.log('Pas user in storage');
      }
   }, []);

   useEffect(() => {
      const user = { isAuth: isAuth, isAdmin: isAdmin, userId: userId, userAvatar: userAvatar, userPseudo: userPseudo };
      console.log('user = ', user);
      localStorage.setItem('user', JSON.stringify(user));
   }, [isAuth, isAdmin, userId, userAvatar, userPseudo]);

   return (
      <div className="App">
         <ThemeProvider theme={theme}>
            <BrowserRouter>
               {/* <nav>
               <h1>Groupotruc</h1>
               <Link to="/">Home</Link>
               <Link to="/signup">Signup</Link>
               <Link to="/login">Login</Link>
            </nav> */}
               <Routes>
                  <Route path="/" element={<Home />} />
                  <Route
                     path="/signup"
                     element={
                        isAuth ? (
                           <Main
                              isAuth={isAuth}
                              setIsAuth={setIsAuth}
                              isAdmin={isAdmin}
                              setIsAdmin={setIsAdmin}
                              userId={userId}
                              setUserId={setUserId}
                              userPseudo={userPseudo}
                              setUserPseudo={setUserPseudo}
                              userAvatar={userAvatar}
                              setUserAvatar={setUserAvatar}
                           />
                        ) : (
                           <Signup
                              isAuth={isAuth}
                              setIsAuth={setIsAuth}
                              isAdmin={isAdmin}
                              setIsAdmin={setIsAdmin}
                              userId={userId}
                              setUserId={setUserId}
                              userPseudo={userPseudo}
                              setUserPseudo={setUserPseudo}
                              userAvatar={userAvatar}
                              setUserAvatar={setUserAvatar}
                           />
                        )
                     }
                  />
                  <Route
                     path="/login"
                     element={
                        isAuth ? (
                           <Main
                              isAuth={isAuth}
                              setIsAuth={setIsAuth}
                              isAdmin={isAdmin}
                              setIsAdmin={setIsAdmin}
                              userId={userId}
                              setUserId={setUserId}
                              userAvatar={userAvatar}
                              setUserAvatar={setUserAvatar}
                              userPseudo={userPseudo}
                              setUserPseudo={setUserPseudo}
                           />
                        ) : (
                           <Login
                              isAuth={isAuth}
                              setIsAuth={setIsAuth}
                              isAdmin={isAdmin}
                              setIsAdmin={setIsAdmin}
                              userId={userId}
                              setUserId={setUserId}
                              userAvatar={userAvatar}
                              setUserAvatar={setUserAvatar}
                              userPseudo={userPseudo}
                              setUserPseudo={setUserPseudo}
                           />
                        )
                     }
                  />
                  <Route
                     path="/main"
                     element={
                        isAuth ? (
                           <Main
                              isAuth={isAuth}
                              setIsAuth={setIsAuth}
                              isAdmin={isAdmin}
                              setIsAdmin={setIsAdmin}
                              userId={userId}
                              setUserId={setUserId}
                              userAvatar={userAvatar}
                              setUserAvatar={setUserAvatar}
                              userPseudo={userPseudo}
                              setUserPseudo={setUserPseudo}
                           />
                        ) : (
                           <Navigate to="/login" />
                        )
                     }
                  />
                  <Route
                     path="/compte"
                     element={
                        isAuth ? (
                           <Compte
                              isAuth={isAuth}
                              setIsAuth={setIsAuth}
                              isAdmin={isAdmin}
                              setIsAdmin={setIsAdmin}
                              userId={userId}
                              setUserId={setUserId}
                              userAvatar={userAvatar}
                              setUserAvatar={setUserAvatar}
                              userPseudo={userPseudo}
                              setUserPseudo={setUserPseudo}
                           />
                        ) : (
                           <Navigate to="/login" />
                        )
                     }
                  />
                  <Route
                     path="/postCreate"
                     element={
                        isAuth ? (
                           <PostCreate
                              isAuth={isAuth}
                              setIsAuth={setIsAuth}
                              isAdmin={isAdmin}
                              setIsAdmin={setIsAdmin}
                              userId={userId}
                              setUserId={setUserId}
                              userAvatar={userAvatar}
                              setUserAvatar={setUserAvatar}
                              userPseudo={userPseudo}
                              setUserPseudo={setUserPseudo}
                           />
                        ) : (
                           <Navigate to="/login" />
                        )
                     }
                  />
                  <Route path="/*" element={<Navigate to="/" />} />
               </Routes>
            </BrowserRouter>
         </ThemeProvider>
      </div>
   );
}

export default App;
