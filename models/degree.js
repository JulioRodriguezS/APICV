const mongoose = require('mongoose')


const degreeSchema = new mongoose.Schema({
    userId:{
        type: String,
        require: true
    },
    institutionName:{
        type: String
    },
    carreerDescription:{
        type: String
    },
    carrerTitle:{
        type: String
    },
    gotCertified:{
        type: Boolean
    },
    institute:{
        type: String
    },
    initialDate:{
        type: Date
    },
    finalDate:{
        type: Date
    },
    savedDate:{
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Degree', degreeSchema)