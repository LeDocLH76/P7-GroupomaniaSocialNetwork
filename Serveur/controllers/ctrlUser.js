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
   const { email, password, pseudo } = req.body;
   // Crypter pw
   const passwordHash = await bcrypt.hash(password, 10);
   let innerImage = '';
   // Si une image est reçue elle est enregistrée par multer dans req.file
   // Recomposition de son nom complet et stockage dans innerImage
   if (req.file) {
      innerImage = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
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
      // Si il n'y a pas d'immage, en ajouter une par défaut
      if (innerImage == '') {
         innerImage = `${req.protocol}://${req.get('host')}/fakeImages/person.png`;
      }
      // Créer le nouveau user
      const user = await prisma.users.create({
         data: {
            email: email,
            pseudo: pseudo,
            avatar: innerImage,
            password: passwordHash,
         },
         select: {
            pseudo: true,
            email: true,
            avatar: true,
            id: true,
            role: true,
         },
      });
      // User valide
      // Création session
      req.session.user = { id: user.id, role: user.role };

      res.status(201).json({ id: user.id, avatar: user.avatar, role: user.role });
   } catch (error) {
      res.status(500).send({
         message: error.message || 'Une erreur est survenue dans la création de user.',
      });
   }
};

// Endpoint non protègé
exports.logUser = async (req, res) => {
   const { email, password } = req.body;

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

      res.status(200).json({ id: user.id, avatar: user.avatar, role: user.role });
   } catch (error) {
      res.status(500).send({
         message: error.message || 'Une erreur est survenue dans la création de user.',
      });
   }
};

exports.logoutUser = (req, res) => {
   const userId = req.session.user.id;
   req.session.destroy((err) => {
      if (err) {
         res.status(400).send(`Logout impossible de user: ${userId}`);
      } else {
         res.status(200).send(`Logout OK user: ${userId}`);
      }
   });
};

exports.updateUser = async (req, res) => {
   const userId = req.session.user.id;
   let innerImage = '';
   // Si une image est reçue elle est enregistrée par multer dans req.file
   // Recomposition de son nom complet et stockage dans innerImage
   if (req.file) {
      innerImage = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
   }
   const { pseudo, email, password, oldPassword } = req.body;
   // Valider les données !!!!!!!!!!!!!!!!!!!!!!!
   // Si il manque une donnée requise
   if (!pseudo || !email || !password || !oldPassword) {
      // Si il y a une image
      if (innerImage != '') {
         deleteImage(innerImage);
      }
      return res.status(400).json('Pseudo, email, mots de passe obligatoire');
   }

   try {
      // Récupère l'ancien avatar et password
      const userBd = await findOneUser(userId);
      const oldPasswordBd = userBd.password;

      // Si oldPassword pas celui enregistré sur la BD
      if (!(await bcrypt.compare(oldPassword, oldPasswordBd))) {
         throw new Error('Erreur de mot de passe');
      }

      // Si il n'y a pas d'image
      if (innerImage == '') {
         // Extrait le nom de l'url de l'image
         const imageName = userBd.avatar.split(':3001/')[1];
         // Si l'image enregistrée est différente de l'image par défaut
         if (imageName != 'fakeImages/person.png') {
            // Efface l'ancienne image
            fs.unlink(`./images/${imageName}`, () => {
               console.log(`Images ${imageName} éffacée`);
            });
         }
         // Il n'y a pas d'immage, en ajoute une par défaut
         innerImage = `${req.protocol}://${req.get('host')}/fakeImages/person.png`;
      }

      // Crytpe le nouveau mot de passe
      const passwordHash = await bcrypt.hash(password, 10);

      // Met à jour le user
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
         select: {
            pseudo: true,
            email: true,
            avatar: true,
         },
      });
      // Renvoi les infos partielles de user
      res.status(201).json(user);
   } catch (error) {
      res.status(500).send({
         message: error.message || 'Une erreur est survenue dans la modification de user.',
      });
   }
};

exports.deleteUser = async (req, res) => {
   const userId = req.session.user.id;
   const { password } = req.body;
   // Valider les données !!!!!!!!!!!!!!!!!!!!!!!
   // Si il manque une donnée requise
   if (!password) {
      return res.status(400).json('mot de passe obligatoire');
   }
   console.log('userId = ', userId);
   console.log('password = ', password);
   try {
      // Récupère l'ancien password et tableau de post
      const userBd = await findOneUser(userId);
      if (!userBd) {
         throw new Error('User non trouvé');
      }
      const passwordBd = userBd.password;
      const posts = userBd.posts; // []

      // Si oldPassword pas celui enregistré sur la BD
      if (!(await bcrypt.compare(password, passwordBd))) {
         throw new Error('Erreur de mot de passe');
      }

      // Le user à le droit de supprimer son compte,
      // alors supprimer toutes les images de ses posts sur le serveur.
      posts.forEach((post) => {
         for (let index = 0; index < post.picture.length; index++) {
            const image = post.picture[index];
            deleteImage(image);
         }
      });

      // Supprime son avatar sur le serveur
      // Extrait le nom de l'url de l'image
      const imageName = userBd.avatar.split('/images/')[1];
      // Si l'image enregistrée est différente de l'image par défaut
      if (imageName != 'fakeImages/person.png') {
         // Efface l'ancienne image
         fs.unlink(`./images/${imageName}`, () => {
            console.log(`Images ${imageName} éffacée`);
         });
      }

      // Puis supprimer son compte-- user posts et comments en cascade
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
         pseudo: true,
         avatar: true,
         password: true,
         posts: true,
      },
   });
}

function deleteImage(innerImage) {
   // Extrait le nom de l'url de l'image
   imageName = innerImage.split('/images/')[1];
   fs.unlink(`./images/${imageName}`, () => {
      console.log(`Fichier ${imageName} éffacé`);
   });
}
