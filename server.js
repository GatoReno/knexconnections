require('dotenv').config()
'use strict';

// Require process, so we can mock environment variables
const process = require('process');

// [START app]
const express = require('express');
const path = require('path');
const Knex = require('knex');
const hbs = require('express-handlebars');

const app = express();
app.enable('trust proxy');

app.engine('.hbs', hbs({
  defaultLayout: 'main',
  layoutsDir: path.join(app.get('views'), 'layouts'),
  partialsDir: path.join(app.get('views'), 'partials'),
  extname: '.hbs'
}));

app.set('view engine', '.hbs');


const knex = () => {
  // [START connect]
  const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE
  };

  if (process.env.INSTANCE_CONNECTION_NAME && process.env.NODE_ENV === 'production') {
    config.socketPath = `/cloudsql/${process.env.INSTANCE_CONNECTION_NAME}`;
  }

  // Connect to the database
  const knex = Knex({
    client: 'mysql',
    connection: config
  });
  // [END connect]

  return knex;

};
app.get('/insert',(req,res)=>{
  knex("users")
  .returning('id')
  .insert( [{name:"jhon",lastname:"sue"}] )
  .then(
    ()=>{
      
      res.send('ok?');
    });
  knex().select().from('users').then(function(data){
    //do something here
    console.log(data);
    return data;
    
  });
});
app.get('/', (req, res) => {

  const queyk = knex().select('*').from('users');
  const users = [];
  queyk.then((data)=>{
      data.forEach((user) => {
        users.push (user); 
      });
      //console.log(users);
  }).then(
    res.render('main', {users:users})
  );
  
  

});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
// [END app]


/*
function getusersgcloud(){
  return knex().select().from('users').then(function(data){
    //do something here
    console.log(data);
    return data;
  }).catch((err) => {
    console.log(err);
  })
}

const users = getusersgcloud();




console.log(users) */

module.exports = app;