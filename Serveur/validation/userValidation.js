const yup = require('yup');

const userSchema = yup.object({
   pseudo: yup.string().required(),
   email: yup.string().email().required(),
   password: yup
      .string()
      .matches(/(hi|bye)/)
      .required(),
});

module.exports = userSchema;
