import './styles/App.css';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Main from './pages/Main';
import { useState } from 'react';

function App() {
   const [isAuth] = useState(false);
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
               <Route path="/signup" element={<Signup />} />
               <Route path="/login" element={<Login />} />
               <Route path="/main" element={isAuth ? <Main /> : <Navigate to="/login" />} />
               <Route path="/*" element={<Navigate to="/" />} />
            </Routes>
         </BrowserRouter>
      </div>
   );
}

export default App;
