import * as yup from 'yup';

export const userLoginSchema = yup.object({
   email: yup.string().email().required(),
   password: yup.string().required(),
});
