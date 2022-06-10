const multer = require('multer');

const MIME_TYPES = {
   'image/jpg': 'jpg',
   'image/jpeg': 'jpg',
   'image/png': 'png',
};

const fileStorageEngine = multer.diskStorage({
   destination: (req, file, cb) => {
      cb(null, 'images');
   },
   filename: (req, file, callback) => {
      const name = file.originalname.split(' ').join('_').split('.')[0];
      const extension = file.mimetype.split('/')[1];
      callback(null, name + '--' + Date.now() + '.' + extension);
   },
});

const fileFilter = (req, file, callback) => {
   const extension = MIME_TYPES[file.mimetype];
   // if (extension != undefined) {
   if (file.mimetype.includes('image')) {
      callback(null, true);
   } else {
      callback('Seulement des images svp', false);
   }
};

module.exports = multer({ storage: fileStorageEngine, fileFilter });
