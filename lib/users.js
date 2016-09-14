const config = require('../knexfile')[process.env.NODE_ENV || 'development']
const knex = require('knex')(config)

function create (email, hash) {
  return knex('users')
    .insert( {
      email: email,
      hash: hash
    })
}

function exists (email) {
  return knex('users')
    .count('id as n')
    .where('email', email)
    .then( function (count) {
      return count[0].n > 0
    })
}

module.exports = {
  create: create,
  exists: exists
}
