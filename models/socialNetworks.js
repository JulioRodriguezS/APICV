const { mongo } = require('mongoose')
const mongoose = require('mongoose')

const socialNetworksSchema = mongoose.Schema({
    userId: {
        type: String,
        require: true
    },
    networkName: {
        type: String
    },
    networkLink: {
        type: String
    },
    savedDate: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('SocialNetwork', socialNetworksSchema)