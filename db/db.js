const { config } = require('dotenv');
const knex = require('knex');
const knexfile = require('./knexfile');


const env = process.env.NODE_ENV || 'development';
const configOptions = knexfile[env];

//console.log(configOptions)


module.exports = knex(configOptions);