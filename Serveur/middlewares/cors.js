const cors = require('cors');

const whitelist = ['http://localhost:3000', 'http://localhost:3001'];

const corsOptions = {
   optionsSuccessStatus: 200,
   origin: function (origin, callback) {
      if (whitelist.indexOf(origin) !== -1) {
         console.log('origin = ', origin);
         callback(null, true);
      } else {
         console.log('origin = ', origin);
         callback(new Error('Erreur CORS -- DQ'));
      }
   },
   credentials: true,
};
module.exports = cors(corsOptions);
