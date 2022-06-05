const prisma = require('../utils/db.js');
const bcrypt = require('bcrypt');
const fs = require('fs');

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

// Endpoint non protègé
exports.createUser = async (req, res) => {
   let pathName = '';
   // Si une image est reçue elle est enregistrée par multer dans req.file
   // Recomposition de son nom complet et stockage dans pathName
   if (req.file) {
      pathName = `${req.protocol}://${req.get('host')}/images/${req.file.path}`;
   }

   const { email, password, pseudo } = req.body;
   // Valider les données !!!!!!!!!!!!!!!!!!!!!!!
   // Si il manque une donnée requise
   if (!email || !password || !pseudo) {
      // Si il y a une image
      if (pathName != '') {
         effaceImage();
      }
      return res.status(400).json('Pseudo, email, mot de passe obligatoire');
   }

   try {
      // L'email est-elle déja enregistrée sur la BD
      const exist = await prisma.users.count({
         where: {
            email: email,
         },
      }); // 0/1 - false/true
      // Si email existe rejetter la demande
      if (exist) {
         // Si il y a une image
         if (pathName != '') {
            effaceImage();
         }
         throw new Error("L'email existe déja");
      }

      // Crypter pw
      const passwordHash = await bcrypt.hash(password, 10);

      const user = await prisma.users.create({
         data: {
            email: email,
            pseudo: pseudo,
            avatar: pathName,
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

   function effaceImage() {
      fs.unlink(req.file.path, () => {
         console.log(`Fichier ${req.file.path} éffacé`);
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
      console.log(req.session);
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
