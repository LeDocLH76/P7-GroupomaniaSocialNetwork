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
         message: error.message || 'Une erreur est survenue dans la recherche de comments.',
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
         message: error.message || 'Une erreur est survenue dans la recherche de comment.',
      });
   }
};

exports.createcommentUser = async (req, res) => {
   const { body, postId } = req.body;
   const userId = req.session.user.id;

   if (!body || body == '' || !postId) {
      return res.status(400).send('Le commentaire ne peut être vide');
   }

   try {
      const comment = await prisma.comments.create({
         data: {
            body: body,
            postId: Number(postId),
            userId: Number(userId),
         },
      });
      res.status(201).json(comment);
   } catch (error) {
      res.status(500).send({
         message: error.message || 'Une erreur est survenue dans la création de comment.',
      });
   }
};

exports.updatecommentUser = async (req, res) => {
   const commentId = req.params.id;
   const { body, postId } = req.body;

   if (!body || body == '' || !commentId) {
      return res.status(400).send('Le commentaire ne peut être vide');
   }

   try {
      // Récupération du propriétaire du commentaire sur la Bd
      const dataCommentBd = await findOneComment(commentId);

      if (!dataCommentBd) {
         return res.status(404).send('Commentaire non trouvé');
      }

      if (parseInt(req.session.user.id) !== dataCommentBd.userId) {
         return res.status(401).send('Erreur de user');
      }

      if (postId !== dataCommentBd.postId) {
         return res.status(401).send('Erreur de post');
      }

      const comment = await prisma.comments.update({
         where: {
            id: Number(commentId),
         },
         data: {
            body: body,
         },
      });
      res.status(201).json(comment);
   } catch (error) {
      res.status(500).send({
         message: error.message || 'Une erreur est survenue dans la modification de comment.',
      });
   }
};

exports.deletecommentUser = async (req, res) => {
   const commentId = req.params.id;
   try {
      // Récupération du propriétaire du commentaire sur la Bd
      const dataCommentBd = await findOneComment(commentId);

      if (!dataCommentBd) {
         return res.status(404).send('Commentaire non trouvé');
      }

      // Vérification du propriétaire du commentaire
      if (parseInt(req.session.user.id) !== dataCommentBd.userId) {
         return res.status(401).send('Erreur de user');
      }

      const comment = await prisma.comments.delete({
         where: {
            id: Number(commentId),
         },
      });
      res.status(200).send('Commentaire supprimé');
   } catch (error) {
      res.status(500).send({
         message: error.message || 'Une erreur est survenue dans la suppression de comment.',
      });
   }
};

async function findOneComment(commentId) {
   return await prisma.comments.findUnique({
      where: {
         id: Number(commentId),
      },
      select: {
         userId: true,
         postId: true,
      },
   });
}
