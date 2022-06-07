const prisma = require('../utils/db.js');
const bcrypt = require('bcrypt');
const fs = require('fs');

// ADMIN required
exports.getAllUsers = async (req, res) => {
   try {
      const users = await prisma.users.findMany({
         orderBy: {
            pseudo: 'asc',
         },
         select: {
            pseudo: true,
            email: true,
            avatar: true,
            role: true,
            posts: true,
         },
      });

      if (!users) {
         res.status(404).send("Aucun utilisateur n'à été trouvé! C'est pas possible!");
      }

      res.status(200).json(users);
   } catch (error) {
      res.status(500).send({
         message: error.message || 'Une erreur est survenue dans la recherche de users.',
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
         select: {
            pseudo: true,
            avatar: true,
            role: true,
            posts: true,
         },
      });
      if (!user) {
         res.status(404).send("L'utilisateur n'à pas été trouvé");
      }

      res.status(200).json(user);
   } catch (error) {
      res.status(500).send({
         message: error.message || 'Une erreur est survenue dans la recherche de user.',
      });
   }
};

// Endpoint non protègé
exports.createUser = async (req, res) => {
   let innerImage = '';
   // Si une image est reçue elle est enregistrée par multer dans req.file
   // Recomposition de son nom complet et stockage dans pathName
   if (req.file) {
      innerImage = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
   }

   const { email, password, pseudo } = req.body;
   // Valider les données !!!!!!!!!!!!!!!!!!!!!!!
   // Si il manque une donnée requise
   if (!email || !password || !pseudo) {
      // Si il y a une image
      if (innerImage != '') {
         deleteImage(innerImage);
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
         if (innerImage != '') {
            deleteImage(innerImage);
         }
         throw new Error("L'email existe déja");
      }

      // Crypter pw
      const passwordHash = await bcrypt.hash(password, 10);
      // Si il n'y a pas d'immage, en ajouter une par défaut
      if (innerImage == '') {
         innerImage = `${req.protocol}://${req.get('host')}/images/fakeImages/person.png`;
      }

      const user = await prisma.users.create({
         data: {
            email: email,
            pseudo: pseudo,
            avatar: innerImage,
            password: passwordHash,
         },
      });
      res.status(201).json(`L'utilisateur ${user.pseudo} est créé`);
   } catch (error) {
      res.status(500).send({
         message: error.message || 'Une erreur est survenue dans la création de user.',
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
      // console.log(req.session);
      res.json(`L'utilisateur ${user.pseudo} est connecté`);
   } catch (error) {
      res.status(500).send({
         message: error.message || 'Une erreur est survenue dans la création de user.',
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
   const userId = req.session.user.id;
   let innerImage = '';
   // Si une image est reçue elle est enregistrée par multer dans req.file
   // Recomposition de son nom complet et stockage dans innerImage
   if (req.file) {
      innerImage = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
   }
   const { email, password, pseudo } = req.body;
   // Valider les données !!!!!!!!!!!!!!!!!!!!!!!
   // Si il manque une donnée requise
   if (!email || !password || !pseudo) {
      // Si il y a une image
      if (innerImage != '') {
         deleteImage(innerImage);
      }
      return res.status(400).json('Pseudo, email, mot de passe obligatoire');
   }

   try {
      // Si il n'y a pas d'image
      if (innerImage == '') {
         // Recupere le nom de l'ancienne image
         const userBd = await findOneUser(userId);
         console.log('ancienne image = ', userBd.avatar);
         // Extrait le nom de l'url de l'image
         const imageName = userBd.avatar.split('/images/')[1];
         console.log('image = ', imageName);
         // Efface l'ancienne image
         fs.unlink(`./images/${imageName}`, () => {
            console.log(`Fichier ${imageName} éffacé`);
         });
         // Si il n'y a pas d'immage, en ajouter une par défaut
         innerImage = `${req.protocol}://${req.get('host')}/images/fakeImages/person.png`;
      }

      const passwordHash = await bcrypt.hash(password, 10);

      const user = await prisma.users.update({
         where: {
            id: Number(userId),
         },
         data: {
            email: email,
            pseudo: pseudo,
            password: passwordHash,
            avatar: innerImage,
         },
      });
      res.status(201).json(`L'utilisateur ${user.pseudo} est modifié`);
   } catch (error) {
      res.status(500).send({
         message: error.message || 'Une erreur est survenue dans la modification de user.',
      });
   }
};

exports.deleteUser = async (req, res) => {
   const userId = req.session.user.id;

   try {
      const user = await prisma.users.delete({
         where: {
            id: Number(userId),
         },
      });
      res.status(201).json(`L'utilisateur ${user.pseudo} est supprimé`);
   } catch (error) {
      res.status(500).send({
         message: error.message || 'Une erreur est survenue dans la suppression de user.',
      });
   }
};

async function findOneUser(userId) {
   return await prisma.users.findUnique({
      where: {
         id: userId,
      },
      select: {
         avatar: true,
      },
   });
}

function deleteImage(innerImage) {
   // Efface l'image entrante du serveur
   // Extrait le nom de l'url de l'image
   imageName = innerImage.split('/images/')[1];
   console.log('image = ', imageName);
   fs.unlink(`./images/${imageName}`, () => {
      console.log(`Fichier ${imageName} éffacé`);
   });
}
