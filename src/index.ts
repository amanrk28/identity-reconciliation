import express from 'express';
import bodyParser from 'body-parser';
import { AppDataSource } from "./data-source";
import identifyRoutes from './controllers/IdentifyController';

const PORT = process.env.PORT || 3000;

const app = express();
app.use(bodyParser.json());
app.use('/', identifyRoutes);

AppDataSource.initialize().then(() => {
  app.listen(PORT, () => {
    console.log('Server is running on http://localhost:3000');
  })
}).catch((err) => {
  console.log('Error initializing data source', err);
})