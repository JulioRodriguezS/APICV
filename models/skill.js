const mongoose = require('mongoose')

const skillSchema = new mongoose.Schema({
    userId:{
        type: String
    },
    title:{
        type: String
    },
    description:{
        type: String
    },
    skillLevel:{
        type: Number
    },    
    savedDate:{
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Skill',skillSchema)