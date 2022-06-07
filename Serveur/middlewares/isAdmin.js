function isAdmin(req, res, next) {
   // console.log('IsAdmin middleware ', req.session.user.role);
   if (req.session.user.role != 'admin') {
      return res.status(401).json({ error: "Vous n'êtes pas autoriser pour cette action" });
   }
   next();
}
module.exports = isAdmin;
