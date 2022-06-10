const yup = require('yup');

const comment = yup.object({
   body: yup.string().trim().required(),
   postId: yup.number().integer().min(1).required(),
});

module.exports = comment;
