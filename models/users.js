var mongoose = require("mongoose")

var UsersSchema = new mongoose.Schema({
    name: { type: String },
    email: {type: String},
    password: { type: String },
});

module.exports = mongoose.model("Users", UsersSchema);