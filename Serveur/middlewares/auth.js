function auth(req, res, next) {
   console.log('Auth middleware ');
   console.log('req.session = ', req.session);
   // console.log('req.sessionID ', req.sessionID);

   if (!req.session || !req.session.user) {
      return res.status(401).json({ error: "Vous n'êtes pas identifié, veuillez vous connecter" });
   }
   next();
}
module.exports = auth;
