import express, { json } from 'express';
import routes from './routes/routes.js';
import 'dotenv/config';

const app = express();
app.use(json());
app.use(routes);

app.listen(process.env.PORT, () =>
   console.log(`Server listening on port ${process.env.PORT}!`)
);
