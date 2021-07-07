const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://node-api:ozdqw5qu14putjX9@node-api.kzqij.mongodb.net/node?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('database connection open')
});

module.exports = db;

