const express = require('express');
require('dotenv').config();
const expressSession = require('./middlewares/session');
const corsMiddleware = require('./middlewares/cors');
const app = express();

const Routes = require('./routes/routes.js');
// const path = require('path');

app.use(expressSession);
app.use(express.json());
// Configure CORS
app.options('*', corsMiddleware);
app.use(corsMiddleware);
// Cors headers
// app.use((req, res, next) => {
//    res.setHeader('Access-Control-Allow-Origin', '*');
//    res.setHeader(
//       'Access-Control-Allow-Headers',
//       'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
//    );
//    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//    next();
// });

app.get('/', (req, res) => res.send('Hello Denis'));
// app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api', Routes);

module.exports = app;
