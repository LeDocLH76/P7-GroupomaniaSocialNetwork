const fs = require('fs');

const validation = (schema) => async (req, res, next) => {
   try {
      const validatedBody = await schema.validate(req.body);
      req.body = validatedBody;
      next();
   } catch (error) {
      // Si une image est reçue, elle est enregistrée par multer dans req.file
      // Si plusieurs images sont reçues, elles sont enregistrées dans req.files []
      // Recomposition de son nom complet et stockage dans innerImage
      if (req.file) {
         const innerImage = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
         imageName = innerImage.split('/images/')[1];
         fs.unlink(`./images/${imageName}`, () => {
            console.log(`Fichier ${imageName} éffacé`);
         });
      }

      res.status(400).json({ error });
   }
};

module.exports = validation;
