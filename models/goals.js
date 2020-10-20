const mongoose = require('mongoose')

const goalsSchema = new mongoose.Schema({
    userId: {
        type: String,
        require: true
    },
    description: {
        type: String
    },
    savedDate:{
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Goal',goalsSchema)