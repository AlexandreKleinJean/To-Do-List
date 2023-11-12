require('dotenv').config();

const express = require('express');
const cors = require('cors');
const multer = require('multer');
const router = require('./app/router');

const app = express();

app.use(cors());

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

const mutipartParser = multer();
app.use(mutipartParser.none()); 

app.use(router);

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`API demarrée sur http://localhost:${port}`);
});
