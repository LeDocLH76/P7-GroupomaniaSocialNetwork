const yup = require('yup');

const userLogin = yup.object({
   email: yup.string().email().required(),
   password: yup.string().required(),
});

module.exports = userLogin;
