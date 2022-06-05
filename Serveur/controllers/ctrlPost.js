const prisma = require('../utils/db.js');
const fs = require('fs');

exports.getAllposts = async (req, res) => {
   try {
      const posts = await prisma.posts.findMany({
         orderBy: {
            updatedAt: 'desc',
         },
      });
      res.json(posts);
   } catch (error) {
      res.status(500).send({
         message:
            error.message ||
            'Une erreur est survenue dans la recherche de posts.',
      });
   }
};

exports.getOnepost = async (req, res) => {
   const { id } = req.params;
   try {
      const post = await prisma.posts.findUnique({
         where: {
            id: Number(id),
         },
      });
      res.json(post);
   } catch (error) {
      res.status(500).send({
         message:
            error.message ||
            'Une erreur est survenue dans la recherche de post.',
      });
   }
};

exports.createpost = async (req, res) => {
   // Récupération des données en entrée
   let { innerImage, innerBody } = recuperationInnerData(req);

   if (innerImage.length == 0 && innerBody == '') {
      return res.status(400).send('Un post ne peut pes être vide');
   }

   const { id } = req.session.user;
   console.log('userId = ', id);

   //*****A supprimer */
   // if (innerImage.length != 0) {
   //    for (let index = 0; index < innerImage.length; index++) {
   //       fs.unlink(innerImage[index], () => {
   //          console.log(`Fichier ${innerImage} éffacé`);
   //       });
   //    }
   // }
   // return res.status(200).send('Données reçues');
   //*****A supprimer */

   try {
      const post = await prisma.posts.create({
         data: {
            body: innerBody,
            picture: innerImage,
            like: 0,
            dislike: 0,
            userLike: [],
            userDislike: [],
            userId: Number(id),
         },
      });
      res.json(post);
   } catch (error) {
      res.status(500).send({
         message:
            error.message ||
            'Une erreur est survenue dans la création de post.',
      });
   }
};

exports.updatepost = async (req, res) => {
   const id = req.params.id;
   // Récupération des données en entrée
   let { innerImage, innerBody } = recuperationInnerData(req);

   if (innerImage.length == 0 && innerBody == '') {
      return res.status(400).send('Un post ne peut pes être vide');
   }

   console.log('userId = ', id);

   try {
      const post = await prisma.posts.update({
         where: {
            id: Number(id),
         },
         data: {
            body: innerBody,
            picture: innerImage,
         },
      });

      res.json(post);
   } catch (error) {
      res.status(500).send({
         message:
            error.message ||
            'Une erreur est survenue dans la modification de post.',
      });
   }
};

exports.deletepost = async (req, res) => {
   try {
      const { id } = req.params;
      const post = await prisma.posts.delete({
         where: {
            id: Number(id),
         },
      });
      res.json(post);
   } catch (error) {
      res.status(500).send({
         message:
            error.message ||
            'Une erreur est survenue dans la suppression de post.',
      });
   }
};

function recuperationInnerData(req) {
   let innerImage = [];
   if (req.files) {
      for (let index = 0; index < req.files.length; index++) {
         const element = req.files[index];
         const pathName = `${req.protocol}://${req.get('host')}/${
            element.path
         }`;
         console.log(pathName);
         innerImage.push(pathName);
      }
   }
   console.log('innerImage = ', innerImage);

   let innerBody = '';
   if (req.body.body) {
      innerBody = req.body.body;
      console.log('Body = ', req.body.body);
   }
   return { innerImage, innerBody };
}
