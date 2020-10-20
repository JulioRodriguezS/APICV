const { mongo } = require('mongoose')
const mongoose = require('mongoose')
/**
 * the skills lees going over the 1 to 10 numbers
 * the means is 
 * 1-3.9 beginner
 * 4-6.9 intermediate
 * 7-8.9 advance
 * 9-9.99 senior
*/
const skillLevelSchema = new mongoose.Schema({
    skillLevel:{
        type: Number
    },
    title:{
        type: String
    },
    description:{
        type: String
    },
    levelColor:{
        type: String
    },
    savedDate:{
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('SkillLevel', skillLevelSchema)