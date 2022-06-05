const prisma = require('../utils/db.js');

exports.getAllcommentsUser = async (req, res) => {
   const { id } = req.params;
   try {
      const comments = await prisma.comments.findMany({
         where: {
            userId: Number(id),
         },
      });
      res.json(comments);
   } catch (error) {
      res.status(500).send({
         message:
            error.message ||
            'Une erreur est survenue dans la recherche de comments.',
      });
   }
};

exports.getOnecommentUser = async (req, res) => {
   const { id } = req.params;
   try {
      const comment = await prisma.comments.findUnique({
         where: {
            id: Number(id),
         },
      });
      res.json(comment);
   } catch (error) {
      res.status(500).send({
         message:
            error.message ||
            'Une erreur est survenue dans la recherche de comment.',
      });
   }
};

exports.createcommentUser = async (req, res) => {
   try {
      const comment = await prisma.comments.create({
         data: req.body,
      });
      res.json(comment);
   } catch (error) {
      res.status(500).send({
         message:
            error.message ||
            'Une erreur est survenue dans la création de comment.',
      });
   }
};

exports.updatecommentUser = async (req, res) => {
   const { id } = req.params;
   try {
      const comment = await prisma.comments.update({
         where: {
            id: Number(id),
         },
         data: req.body,
      });
      res.json(comment);
   } catch (error) {
      res.status(500).send({
         message:
            error.message ||
            'Une erreur est survenue dans la modification de comment.',
      });
   }
};

exports.deletecommentUser = async (req, res) => {
   try {
      const { id } = req.params;
      const comment = await prisma.comments.delete({
         where: {
            id: Number(id),
         },
      });
      res.json(comment);
   } catch (error) {
      res.status(500).send({
         message:
            error.message ||
            'Une erreur est survenue dans la suppression de comment.',
      });
   }
};
