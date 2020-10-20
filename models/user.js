const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = mongoose.Schema({
    name: {
        type: String
    },
    lastName: {
        type: String
    },
    email: {
        type: String
    },
    phoneNumber: {
        type: String
    },
    country: {
        type: String
    },
    city: {
        type: String
    },
    cp: {
        type: String
    },
    address: {
        type: String
    },
    password:{
        type: String
    },
    savedDate:{
        type: Date,
        default: Date.now
    }
}) 

userSchema.methods.setPassword = async (password) =>{
    const salt = await bcrypt.genSalt(10)
    const hash = bcrypt.hash(password, salt)
    return hash
}

userSchema.methods.matchPassword = async function (password){
    return await bcrypt.compare(password, this.password)
}

module.exports = mongoose.model('User', userSchema)