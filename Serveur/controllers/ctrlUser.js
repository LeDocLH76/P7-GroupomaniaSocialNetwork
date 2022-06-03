const prisma = require('../utils/db.js');
const bcrypt = require('bcrypt');

exports.getAllUsers = async (req, res) => {
   // ADMIN required
   try {
      const users = await prisma.users.findMany({
         orderBy: {
            pseudo: 'asc',
         },
      });
      res.json(users);
   } catch (error) {
      res.status(500).send({
         message:
            error.message ||
            'Une erreur est survenue dans la recherche de users.',
      });
   }
};

exports.getOneUser = async (req, res) => {
   const { id } = req.params;
   try {
      const user = await prisma.users.findUnique({
         where: {
            id: Number(id),
         },
      });
      res.json(user);
   } catch (error) {
      res.status(500).send({
         message:
            error.message ||
            'Une erreur est survenue dans la recherche de user.',
      });
   }
};

exports.createUser = async (req, res) => {
   // const pathName = `${req.protocol}://${req.get('host')}/${req.file.path}`;
   // console.log(pathName);
   // console.log('Body = ', req.body);
   // console.log('imagetype = ', req.file.mimetype);
   // console.log('imageName = ', req.file.originalname);
   // console.log('imageData = ', req.file.buffer); // undefined => Promise!

   // return res.status(200).send(`Images enregistrées`);

   const { email, password, pseudo, firstName, lastName } = req.body;
   // Valider les données !!!!!!!!!!!!!!!!!!!!!!!
   if (!email || !password || !pseudo || !firstName || !lastName) {
      return res
         .status(400)
         .json('Pseudo, email, mot de passe, prénom, nom obligatoire');
   }

   try {
      const exist = await prisma.users.count({
         where: {
            email: req.body.email,
         },
      });
      // Si email existe rejetter la demande
      if (exist) {
         throw new Error("L'email existe déja");
      }
      // Crypter pw
      const passwordHash = await bcrypt.hash(password, 10);

      const user = await prisma.users.create({
         data: {
            email: email,
            pseudo: pseudo,
            password: passwordHash,
         },
      });
      res.json(`L'utilisateur ${user.pseudo} est créé`);
   } catch (error) {
      res.status(500).send({
         message:
            error.message ||
            'Une erreur est survenue dans la création de user.',
      });
   }
};

// Endpoint non protègé
exports.logUser = async (req, res) => {
   const { email, password } = req.body;
   // Valider les données !!!!!!!!!!!!!!!!!!!!!!!
   if (!email || !password) {
      return res.status(400).json('Email et mot de passe obligatoire');
   }

   try {
      // Cherche un user par son email sur la bd
      const user = await prisma.users.findUnique({
         where: {
            email: email,
         },
      });
      // Si pas user ou password incorrect
      if (!user || !(await bcrypt.compare(password, user.password))) {
         throw new Error("Erreur d'email ou de mot de passe");
      }
      // User valide
      // Création session
      req.session.user = { id: user.id, role: user.role };

      res.json(`L'utilisateur ${user.pseudo} est connecté`);
   } catch (error) {
      res.status(500).send({
         message:
            error.message ||
            'Une erreur est survenue dans la création de user.',
      });
   }
};

exports.logoutUser = (req, res) => {
   if (req.session) {
      const userId = req.session.user.id;
      req.session.destroy((err) => {
         if (err) {
            res.status(400).send(`Logout impossible de user: ${userId}`);
         } else {
            res.status(200).send(`Logout OK user: ${userId}`);
         }
      });
   }
};

exports.updateUser = async (req, res) => {
   const { id } = req.params;
   try {
      const user = await prisma.users.update({
         where: {
            id: Number(id),
         },
         data: req.body,
      });
      res.json(user);
   } catch (error) {
      res.status(500).send({
         message:
            error.message ||
            'Une erreur est survenue dans la modification de user.',
      });
   }
};

exports.deleteUser = async (req, res) => {
   const { id } = req.params;
   try {
      const user = await prisma.users.delete({
         where: {
            id: Number(id),
         },
      });
      res.json(user);
   } catch (error) {
      res.status(500).send({
         message:
            error.message ||
            'Une erreur est survenue dans la suppression de user.',
      });
   }
};
