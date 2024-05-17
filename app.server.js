require('dotenv').config();
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const AppController = require('./controllers/app.controller');
const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.get('/', AppController.get);
app.post('/save', AppController.save);
app.post('/update', AppController.update);
app.post('/remove', AppController.remove);


app.listen(process.env.REST_PORT, () => {
  console.log('🚀 ~ app.listen ~ process.env.REST_PORT:', process.env.REST_PORT);
});