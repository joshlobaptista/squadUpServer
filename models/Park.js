var mongoose = require("mongoose")
const User = require('./users');

var ParkSchema = new mongoose.Schema({
    name: { type: String },
    location: {
        coordinates:{
            index: "2dsphere",
            type: [Number]
        }
    },
    user_id: {
        type: String, 
        required: true
    }
});

module.exports = mongoose.model("Park", ParkSchema);