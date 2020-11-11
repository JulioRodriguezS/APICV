const mongoose = require('mongoose')

const kpiSchema = new mongoose.Schema({
    userId: {
        type: String
    },
    Vendor:{
        type:String
    },
    Cookies:{
        type:String
    },
    Language:{
        type:String
    },
    Platform:{
        type:String
    },
    UserAgent:{
        type:String
    },
    ip:{
        type: String
    },
    version:{
        type: String
    },
    city:{
        type: String
    },
    region:{
        type: String
    },
    region_code:{
        type: String
    },
    country:{
        type: String
    },
    country_name:{
        type: String
    },
    country_code:{
        type: String
    },
    country_code_iso3:{
        type: String
    },
    country_capital:{
        type: String
    },
    country_tld:{
        type: String
    },
    continent_code:{
        type: String
    },
    in_eu:{
        type: String
    },
    postal:{
        type: String
    },
    latitude:{
        type: String
    },
    longitude:{
        type: String
    },
    timezone:{
        type: String
    },
    utc_offset:{
        type: String
    },
    country_calling_code:{
        type: String
    },
    currency:{
        type: String
    },
    currency_name:{
        type: String
    },
    languages:{
        type: String
    },
    country_area:{
        type: String
    },
    country_population:{
        type: String
    },
    asn:{
        type: String
    },
    org:{
        type: String
    },
    savedDate:{
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model('Kpis', kpiSchema)