require('dotenv').config()
'use strict';


const express = require('express');
const path = require('path');
const Knex = require('knex');
const crypto = require('crypto');
const hbs = require('express-handlebars');
const db = require('./db');

const app = express();
app.enable('trust proxy');



app.engine('.hbs', hbs({
  defaultLayout : 'main',
  layoutsDir : path.join(app.get('views'),'layouts'),
  partialsDir : path.join(app.get('views'),'partials'),
  extname : '.hbs'
}));

app.set('view engine','.hbs');

app.get('/',(req,res) => {

   const x =  db.select('*').from('users');
   console.log(x);

});



const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});