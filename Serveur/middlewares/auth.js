function auth(req, res, next) {
   if (!req.session || !req.session.user) {
      return res.status(401).json({ error: 'Tu ne passeras pas!' });
   }
   next();
}
module.exports = auth;
