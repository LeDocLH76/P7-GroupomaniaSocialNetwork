const express = require('express');
require('dotenv').config();
const expressSession = require('./middlewares/session');
const corsMiddleware = require('./middlewares/cors');
const multer = require('./middlewares/multer.js');
const app = express();

const Routes = require('./routes/routes.js');
const path = require('path');

app.use(expressSession);
app.use(express.json());
// Configure CORS
app.options('*', corsMiddleware);
app.use(corsMiddleware);
/* Cors headers Old
app.use((req, res, next) => {
   res.setHeader('Access-Control-Allow-Origin', '*');
   res.setHeader(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
   );
   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
   next();
});
*/

app.use('/images', express.static(path.join(__dirname, 'images')));
// *******************************

app.post('/single', multer.single('image'), (req, res) => {
   console.log(req.file);
   res.status(200).send('Image enregistrée');
});

app.post('/multiple', multer.array('images', 6), (req, res) => {
   console.log(req.files.length);
   for (let index = 0; index < req.files.length; index++) {
      const element = req.files[index];
      const pathName = `${req.protocol}://${req.get('host')}/${element.path}`;
      console.log(pathName);
   }
   console.log(req.body.body);

   res.status(200).send('Images enregistrées');
});

// *******************************

app.get('/', (req, res) => res.status(200).send('Hello Denis'));
app.use('/api', Routes);

module.exports = app;
