const mongoose = require('mongoose')

const workExperienceSchema = new mongoose.Schema({
    userId:{
        type: String
    },
    title: {
        type: String
    },
    description: {
        type: String
    },
    company: {
        type: String
    },
    logo: {
        type: String
    },
    companyUrl: {
        type: String
    },
    initialDate: {
        type: Date
    },
    finalDate : {
        type: Date
    },
    savedDate: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('WorkExpertise', workExperienceSchema)