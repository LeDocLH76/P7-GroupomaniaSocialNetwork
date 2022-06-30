import * as yup from 'yup';

export const userCreateSchema = yup.object({
   pseudo: yup.string().required(),
   email: yup.string('Entrer votre email').email('Entrer une email valide').required("L'email est obligatoire"),
   password: yup
      .string('entrer votre password')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@$!%*?&])[a-zA-Z0-9@$!%*?&]{8,30}$/, {
         message: 'De 8 à 30 caractères, mini 1 minuscule 1 majuscule et 1 caractère @$!%*?&',
      })
      .required('Le mot de passe est obligatoire'),
});
