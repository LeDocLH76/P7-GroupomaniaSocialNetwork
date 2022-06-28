import { Button } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Disconnect({ setIsAuth, setIsAdmin }) {
   const navigate = useNavigate();

   const disconnect = async () => {
      try {
         const response = await axios.delete(`http://localhost:3001/api/logoutUser`, {
            withCredentials: true,
         });
         console.log(response);
         localStorage.removeItem('user');
         setIsAuth(false);
         setIsAdmin(false);
         navigate('/login');
      } catch (error) {
         if (error.response.status === 401) {
            console.log(error.response.statusText);
            localStorage.removeItem('user');
            setIsAuth(false);
            setIsAdmin(false);
            navigate('/login');
         }
         // else {
         //    console.log(error.response.data.error.message);
         // }
         console.log(error);
      }
   };

   return (
      <Button
         variant="contained"
         onClick={() => {
            disconnect();
         }}
      >
         Déconnection
      </Button>
   );
}
