const yup = require('yup');

const userSchema = yup.object({
   pseudo: yup.string().trim().required(),
   email: yup.string().email().required(),
   password: yup
      .string()
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@$!%*?&])[a-zA-Z0-9@$!%*?&]{8,30}$/, {
         message: 'De 8 à 30 caractères, mini 1 minuscule 1 majuscule et 1 caractère @$!%*?&',
      })
      .required(),
});

module.exports = userSchema;
