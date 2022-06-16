const cors = require('cors');

const whitelist = ['http://localhost:3000', 'http://localhost:3001'];

const corsOptions = {
   optionsSuccessStatus: 200,
   origin: function (origin, callback) {
      if (whitelist.indexOf(origin) !== -1) {
         callback(null, true);
      } else {
         callback(new Error('Erreur CORS -- DQ'));
      }
   },
   credentials: true,
};
module.exports = cors(corsOptions);
