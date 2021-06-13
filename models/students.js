const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let StudentSchema = new Schema({
    firstName: String,
    lastName: String,
    gpa: Number,
    credits: Number,
    major: String
});

module.exports = mongoose.model('Student', StudentSchema);