const mongoose = require('mongoose')

const coursesSchema = new mongoose.Schema({
    userId:{
        type: String,
        require: true
    },
    courseInstitution:{
        type: String
    },
    courseInsitutionURL:{
        type: String
    },
    courseTitle:{
        type: String        
    },
    courseDescription:{
        type: String
    },
    courseInitial:{
        type: Date
    },
    courseFinal:{
        type: Date
    },
    setView:{
        type:Boolean
    },
    dateSaved:{
        type: Date,
        default: Date.now
    }
})
module.exports = mongoose.model('Course', coursesSchema)