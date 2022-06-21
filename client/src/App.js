import './styles/App.css';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Main from './pages/Main';
import PostCreate from './pages/PostCreate';
import { useState } from 'react';

function App() {
   const [isAuth, setIsAuth] = useState(false);
   const [userId, setUserId] = useState(0);
   const [userAvatar, setUserAvatar] = useState('');

   return (
      <div className="App">
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
                     <Signup
                        isAuth={isAuth}
                        setIsAuth={setIsAuth}
                        userId={userId}
                        setUserId={setUserId}
                        userAvatar={userAvatar}
                        setUserAvatar={setUserAvatar}
                     />
                  }
               />
               <Route
                  path="/login"
                  element={
                     <Login
                        isAuth={isAuth}
                        setIsAuth={setIsAuth}
                        userId={userId}
                        setUserId={setUserId}
                        userAvatar={userAvatar}
                        setUserAvatar={setUserAvatar}
                     />
                  }
               />
               <Route
                  path="/main"
                  element={
                     isAuth ? (
                        <Main
                           isAuth={isAuth}
                           setIsAuth={setIsAuth}
                           userId={userId}
                           setUserId={setUserId}
                           userAvatar={userAvatar}
                           setUserAvatar={setUserAvatar}
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
                           userId={userId}
                           setUserId={setUserId}
                           userAvatar={userAvatar}
                           setUserAvatar={setUserAvatar}
                        />
                     ) : (
                        <Navigate to="/login" />
                     )
                  }
               />
               <Route path="/*" element={<Navigate to="/" />} />
            </Routes>
         </BrowserRouter>
      </div>
   );
}

export default App;
