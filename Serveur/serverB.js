// import express, { json } from 'express';
// import { PrismaClient } from '@prisma/client';

import routes from './routes/routes.js';
// import 'dotenv/config';
// export const prisma = new PrismaClient();

// const app = express();
// app.use(json());

// app.use(routes);

app.listen(process.env.PORT, () =>
   console.log(`Server listening on port ${process.env.PORT}!`)
);
