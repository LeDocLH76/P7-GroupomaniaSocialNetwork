const yup = require('yup');

const post = yup.object({
   body: yup.string().trim(),
   files: yup.array().of(yup.string().url()),
});

module.exports = post;
