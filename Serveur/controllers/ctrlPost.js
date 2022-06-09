const prisma = require('../utils/db.js');
const fs = require('fs');

exports.getAllposts = async (req, res) => {
   try {
      const posts = await prisma.posts.findMany({
         orderBy: {
            updatedAt: 'desc',
         },
         select: {
            id: true,
            body: true,
            picture: true,
            updatedAt: true,
            like: true,
            dislike: true,
            userId: true,
            userLike: true,
            userDislike: true,
            comments: true,
         },
      });

      if (!posts) {
         return res.status(404).send('Aucun post à été trouvé');
      }

      res.status(200).json(posts);
   } catch (error) {
      res.status(500).send({
         message: error.message || 'Une erreur est survenue dans la recherche de posts.',
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
         select: {
            id: true,
            body: true,
            picture: true,
            updatedAt: true,
            like: true,
            dislike: true,
            userId: true,
            userLike: true,
            userDislike: true,
            comments: true,
         },
      });

      if (!post) {
         return res.status(404).send("Le post n'à pas  été trouvé");
      }

      res.status(200).json(post);
   } catch (error) {
      res.status(500).send({
         message: error.message || 'Une erreur est survenue dans la recherche de post.',
      });
   }
};

exports.createpost = async (req, res) => {
   // Récupération des données en entrée
   const { innerImage, innerBody } = findInnerData(req);

   if (innerImage.length == 0 && innerBody == '') {
      return res.status(400).send('Un post ne peut pes être vide');
   }

   const userId = req.session.user.id;

   try {
      const post = await prisma.posts.create({
         data: {
            body: innerBody,
            picture: innerImage,
            like: 0,
            dislike: 0,
            userLike: [],
            userDislike: [],
            userId: Number(userId),
         },
         select: {
            body: true,
            picture: true,
            createdAt: true,
         },
      });
      res.status(201).json(post);
   } catch (error) {
      res.status(500).send({
         message: error.message || 'Une erreur est survenue dans la création de post.',
      });
   }
};

exports.updatepost = async (req, res) => {
   const postId = req.params.id;
   // console.log('postId = ', postId);

   // Récupération des données en entrée
   let { innerImage, innerBody } = findInnerData(req);

   if (innerImage.length == 0 && innerBody == '') {
      return res.status(400).send('Un post ne peut pes être vide');
   }

   try {
      // Récuperation du tableau des images et du userId du post "retouné dans un objet"
      const dataPostBdObj = await findOnePost(postId);
      // console.log('objet picture sur la Bd = ', imagePostBdObj);
      // Récuperation du tableau des url des images
      const imagePostBd = dataPostBdObj.picture;
      // Récuperation du userId propriétaire du post
      const userIdPostBd = dataPostBdObj.userId;
      // console.log('UserId sur la Bd = ', userIdPostBd, 'UserId de session = ', req.session.user.id);
      // Vérifie la propriété du post
      if (parseInt(req.session.user.id) !== userIdPostBd) {
         // Efface images entrantes du le serveur
         for (let index = 0; index < innerImage.length; index++) {
            // Extrait le nom de l'url de l'image
            const imageName = innerImage[index].split('/images/')[1];
            // console.log('image = ', imageName);
            fs.unlink(`./images/${imageName}`, () => {
               // console.log(`Fichier ${imageName} éffacé`);
            });
         }
         return res.status(401).send('Erreur user');
      }

      // Efface les anciennes images sur le serveur
      deleteOldPic(imagePostBd);

      // Enregistre les nouvelles données
      const post = await prisma.posts.update({
         where: {
            id: Number(postId),
         },
         data: {
            body: innerBody,
            picture: innerImage,
         },
         select: {
            body: true,
            picture: true,
            updatedAt: true,
         },
      });
      res.status(201).send(post);
   } catch (error) {
      res.status(500).send({
         message: error.message || 'Une erreur est survenue dans la modification de post.',
      });
   }
};

exports.deletepost = async (req, res) => {
   const postId = req.params.id;
   try {
      // Récuperation du tableau des images et du userId du post "retouné dans un objet"
      const dataPostBdObj = await findOnePost(postId);
      // Récuperation du tableau des url des images
      const imagePostBd = dataPostBdObj.picture;
      // Récuperation du userId propriétaire du post
      const userIdPostBd = dataPostBdObj.userId;
      // Vérifie la propriété du post
      if (parseInt(req.session.user.id) !== userIdPostBd) {
         return res.status(401).send('Erreur user');
      }

      // Efface les anciennes images sur le serveur
      deleteOldPic(imagePostBd);

      // Supprime le post et les comments en cascade
      await prisma.posts.delete({
         where: {
            id: Number(postId),
         },
      });

      res.status(200).send('Post supprimé');
   } catch (error) {
      res.status(500).send({
         message: error.message || 'Une erreur est survenue dans la suppression de post.',
      });
   }
};

async function findOnePost(postId) {
   return await prisma.posts.findUnique({
      where: {
         id: Number(postId),
      },
      select: {
         picture: true,
         userId: true,
      },
   });
}

function deleteOldPic(imagePostBd) {
   for (let index = 0; index < imagePostBd.length; index++) {
      // Extrait le nom de l'url de l'image
      const imageName = imagePostBd[index].split('/images/')[1];
      // console.log('image = ', imageName);
      fs.unlink(`./images/${imageName}`, () => {
         console.log(`Fichier ${imageName} éffacé`);
      });
   }
}

function findInnerData(req) {
   let innerImage = [];
   if (req.files) {
      for (let index = 0; index < req.files.length; index++) {
         const element = req.files[index];
         const pathName = `${req.protocol}://${req.get('host')}/images/${element.filename}`;
         innerImage.push(pathName);
      }
   }

   let innerBody = '';
   if (req.body.body) {
      innerBody = req.body.body;
   }
   return { innerImage, innerBody };
}
