const prisma = require('../utils/db.js');
const bcrypt = require('bcrypt');

exports.getAllUsers = async (req, res) => {
   try {
      const users = await prisma.users.findMany({});
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
      const passwordHash = await bcrypt.hash(req.body.password, 10);

      const user = await prisma.users.create({
         data: {
            email: req.body.email,
            pseudo: req.body.pseudo,
            password: passwordHash,
            profils: {
               create: {
                  firstName: req.body.firstName,
                  lastName: req.body.lastName,
               },
            },
         },
      });
      res.json(user);
   } catch (error) {
      res.status(500).send({
         message:
            error.message ||
            'Une erreur est survenue dans la création de user.',
      });
   }
};

exports.logUser = async (req, res) => {
   try {
      const user = await prisma.users.findUnique({
         where: {
            email: req.body.email,
         },
      });
      if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
         throw new Error("Erreur d'email ou de mot de passe");
      }
      res.json(user);
   } catch (error) {
      res.status(500).send({
         message:
            error.message ||
            'Une erreur est survenue dans la création de user.',
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
