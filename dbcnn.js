const mongoose = require('mongoose')
require('dotenv/config')


const cnn = mongoose.connect(process.env.DB_CONNECTION,{
    useCreateIndex:true,
    useFindAndModify:true,
    useNewUrlParser:true,
    useUnifiedTopology:true
})
.then((db)=>{
    console.log('dbcnn ready!')
})
.catch((err)=>{
    console.log('err-msg: ', err)
})

module.exports = cnn