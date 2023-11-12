import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import router from './app/router';

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const mutipartParser = multer();
app.use(mutipartParser.none());

app.use(router);

const port: number = Number(process.env.PORT);
app.listen(port, () => {
  console.log(`API démarrée sur http://localhost:${port}`);
});
