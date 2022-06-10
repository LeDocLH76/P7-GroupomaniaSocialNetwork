const yup = require('yup');

const like = yup.object({
   like: yup.number().integer().min(-1).max(1).required(),
});

module.exports = like;
