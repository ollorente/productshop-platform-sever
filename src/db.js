const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB || 'mongodb://localhost:27017/productshop-v1', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
})
  .then(db => console.log('>>> [DATABASE] is connected... <<<'))
  .catch(error => console.error(error))

module.exports = mongoose
