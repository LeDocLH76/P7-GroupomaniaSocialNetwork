const prisma = require('../utils/db.js');

exports.getAllposts = async (req, res) => {
   try {
      const posts = await prisma.posts.findMany({});
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

exports.createpostUser = async (req, res) => {
   // for (let index = 0; index < req.files.length; index++) {
   //    const element = req.files[index];
   //    const pathName = `${req.protocol}://${req.get('host')}/${element.path}`;
   //    console.log(pathName);
   // }
   // console.log('Body = ', req.body.body);

   // return res.status(200).send(`${req.files.length} images enregistrées`);

   const { id } = req.params;
   try {
      const post = await prisma.posts.create({
         data: {
            text: req.body.text,
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
   const { id } = req.params;
   try {
      const post = await prisma.posts.update({
         where: {
            id: Number(id),
         },
         data: req.body,
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
