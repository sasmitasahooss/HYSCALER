const mongoose = require('mongoose');

mongoose
.connect('mongodb+srv://sahoosasmita5420:asdfghjkl@cluster0.yskbc.mongodb.net/elms')
.then(() => {
  console.log('Connected to MongoDB');
})
.catch((err) => {
  console.log(err);
})
module.exports = mongoose;