const prisma = require('../utils/db.js');
const fs = require('fs');

exports.getAllposts = async (req, res) => {
   try {
      const posts = await prisma.posts.findMany({
         orderBy: {
            createdAt: 'desc',
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
      return res.status(400).send('Un post ne peut pas être vide');
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
            like: true,
            dislike: true,
            userLike: true,
            userDislike: true,
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
   // Récupération des données en entrée
   let { innerImage, innerBody } = findInnerData(req);
   // Controle si 1 au moins est present
   if (innerImage.length == 0 && innerBody == '') {
      return res.status(400).send('Un post ne peut pes être vide');
   }

   try {
      // Récupération des data du post {}
      const dataPostBdObj = await findOnePost(postId);
      // Récuperation des url des images []
      const imagePostBd = dataPostBdObj.picture;
      // Récuperation du userId propriétaire du post
      const userIdPostBd = dataPostBdObj.userId;
      // Vérifie la propriété du post
      if (parseInt(req.session.user.id) !== userIdPostBd) {
         // Si pas ok éfface images entrantes du le serveur
         for (let index = 0; index < innerImage.length; index++) {
            // Extrait le nom de l'url de l'image
            const imageName = innerImage[index].split('/images/')[1];
            // Ajoute le nom de dossier et éfface
            fs.unlink(`./images/${imageName}`, () => {});
         }
         return res.status(401).send('Erreur user');
      }
      // Si demnde valide
      // Efface les anciennes images sur le serveur
      deleteOldPic(imagePostBd);
      // Enregistre les nouvelles données
      const post = await updatePost(postId, innerBody, innerImage);
      res.status(201).send(post);
   } catch (error) {
      res.status(500).send({
         message: error.message || 'Une erreur est survenue dans la modification de post.',
      });
   }
};

exports.likePost = async (req, res) => {
   const userId = req.session.user.id;
   const postId = req.params.id;
   const userLike = req.body.like;
   let post = {};

   try {
      // Récupération des data du post "retouné dans un objet"
      const dataPostBdObj = await findOnePost(postId);
      let likeBd = dataPostBdObj.like; // int
      let dislikeBd = dataPostBdObj.dislike; // int
      let userLikedBd = dataPostBdObj.userLike; // [userId]
      let userDislikedBd = dataPostBdObj.userDislike; // [userId]
      post = dataPostBdObj;
      switch (userLike) {
         case 1: // Like
            console.log("J'aime !");
            if (!userLikedBd.includes(userId) && !userDislikedBd.includes(userId)) {
               console.log("J'ajoute le like !");
               likeBd++;
               userLikedBd.push(userId);
               post = await updateLikePost(post, postId, likeBd, dislikeBd, userLikedBd, userDislikedBd);
            }
            break;

         case 0: // Pas d'avis
            console.log("Je n'ai pas d'avis.");
            if (userLikedBd.includes(userId)) {
               console.log('Je retire le like');
               if (likeBd >= 1) {
                  likeBd--;
               }
               userLikedBd = userLikedBd.filter((user) => user != userId);
               // Enregistre les nouvelles données
               post = await updateLikePost(post, postId, likeBd, dislikeBd, userLikedBd, userDislikedBd);
            }
            if (userDislikedBd.includes(userId)) {
               console.log('Je retire le dislike');
               if (dislikeBd >= 1) {
                  dislikeBd--;
               }
               userDislikedBd = userDislikedBd.filter((user) => user != userId);
               // Enregistre les nouvelles données
               post = await updateLikePost(post, postId, likeBd, dislikeBd, userLikedBd, userDislikedBd);
            }
            break;

         case -1: // Dislike
            console.log("Je n'aime pas !");
            if (!userLikedBd.includes(userId) && !userDislikedBd.includes(userId)) {
               console.log("J'ajoute le dislike !");
               dislikeBd++;
               userDislikedBd.push(userId);
               // Enregistre les nouvelles données
               post = await updateLikePost(post, postId, likeBd, dislikeBd, userLikedBd, userDislikedBd);
            }
            break;

         default:
            console.log('Il y à une erreur !');
            return res.status(400).json({ message: 'Il y à une erreur !' });
      }
      res.status(200).json(post);
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

async function updatePost(postId, innerBody, innerImage) {
   return await prisma.posts.update({
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
         createdAt: true,
         like: true,
         dislike: true,
         userLike: true,
         userDislike: true,
      },
   });
}

async function updateLikePost(post, postId, likeBd, dislikeBd, userLikedBd, userDislikedBd) {
   post = await prisma.posts.update({
      where: {
         id: Number(postId),
      },
      data: {
         like: likeBd,
         dislike: dislikeBd,
         userLike: userLikedBd,
         userDislike: userDislikedBd,
      },
      select: {
         body: true,
         picture: true,
         createdAt: true,
         like: true,
         dislike: true,
         userLike: true,
         userDislike: true,
      },
   });
   return post;
}

async function findOnePost(postId) {
   return await prisma.posts.findUnique({
      where: {
         id: Number(postId),
      },
      select: {
         body: true,
         picture: true,
         userId: true,
         like: true,
         dislike: true,
         userLike: true,
         userDislike: true,
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
