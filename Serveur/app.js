const express = require('express');
const app = express();

const { PrismaSessionStore } = require('@quixo3/prisma-session-store');
const { PrismaClient } = require('@prisma/client');
const expressSession = require('express-session');

const Routes = require('./routes/routes.js');
// const path = require('path');
require('dotenv').config();

app.use(
   expressSession({
      cookie: {
         maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours en ms
      },
      secret: process.env.SECRET,
      resave: true,
      saveUninitialized: true,
      store: new PrismaSessionStore(new PrismaClient(), {
         checkPeriod: 2 * 60 * 1000, //ms
         dbRecordIdIsSessionId: true,
         dbRecordIdFunction: undefined,
      }),
   })
);

app.use(express.json());

// Cors headers
app.use((req, res, next) => {
   res.setHeader('Access-Control-Allow-Origin', '*');
   res.setHeader(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
   );
   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
   next();
});

app.get('/', (req, res) => res.send('Hello Denis'));
// app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api', Routes);

module.exports = app;
