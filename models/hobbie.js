const mongoose = require('mongoose')

const hobbiesSchema = new mongoose.Schema({
    userId:{
        type: String
    },
    title:{
        type: String
    },
    description:{
        type: String
    },
    icon:{
        type: String
    },
    setView:{
        type:Boolean
    },
    savedDate:{
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Hobbie', hobbiesSchema)