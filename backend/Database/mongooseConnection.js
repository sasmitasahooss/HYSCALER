const mongoose = require('mongoose');

mongoose
.connect(process.env.MONGO_URI + '/elms')
.then(() => {
  console.log('Connected to MongoDB');
})
.catch((err) => {
  console.log(err);
})
module.exports = mongoose;