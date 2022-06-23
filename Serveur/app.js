const express = require('express');
require('dotenv').config();
const expressSession = require('./middlewares/session');
const corsMiddleware = require('./middlewares/cors');
const app = express();
const Routes = require('./routes/routes.js');
const path = require('path');

app.use(expressSession);
app.use(express.json());
app.options('*', corsMiddleware);
app.use('/fakeimages', express.static(path.join(__dirname, 'fakeimages')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(corsMiddleware);

app.get('/', (req, res) => res.status(200).send('Hello Denis'));
app.use('/api', Routes);
app.get('/*', (req, res) => res.status(404).send('Erreur 404'));

module.exports = app;
