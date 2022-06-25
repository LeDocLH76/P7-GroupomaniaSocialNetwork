const expressSession = require('express-session');
const { PrismaSessionStore } = require('@quixo3/prisma-session-store');
const { PrismaClient } = require('@prisma/client');

module.exports = expressSession({
   cookie: {
      maxAge: 1 * 2 * 60 * 60 * 1000, // jour-1 * heure-24 * minute-60 * seconde-60 * miliseconde-1000
      secure: false, // Only for dev !!!!!!!!!!
      httpOnly: true,
      sameSite: 'lax',
   },
   name: 'sessionId', // Rename cookie for more security
   secret: process.env.SECRET,
   resave: true,
   saveUninitialized: true,
   store: new PrismaSessionStore(new PrismaClient(), {
      checkPeriod: 2 * 60 * 1000, //ms
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
   }),
});
