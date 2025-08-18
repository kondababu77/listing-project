const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./user.js')

const reviewSchema = new Schema({
    comments : String,
    rating :{
        type : Number,
        min : 1,
        max : 5,
    },
    createdAt : {
        type : Date,
        default : Date.now(),
    },
    author : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    }
});

module.exports = mongoose.model("review",reviewSchema);