const mongoose = require('mongoose');
const review = require('./review.js');
const User = require('./user.js');

const schema = new mongoose.Schema({
    title: {
        type: String,
        require: true
    },
    description: {
        type: String
    },
    image: {
        type: String,
        default: "https://th.bing.com/th/id/OIP.xqe_f1_7Zrsr-nMCrH9bhAHaEo?o=7rm=3&rs=1&pid=ImgDetMain",
        set: (v) => v === "" ? "https://th.bing.com/th/id/OIP.xqe_f1_7Zrsr-nMCrH9bhAHaEo?o=7rm=3&rs=1&pid=ImgDetMain" : v
    }
    ,
    price: {
        type: Number,
        require: true
    },
    location: {
        type: String,
        require: true
    },
    country: {
        type: String
    },
    reviews :[
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "review"
        }
    ],
    owner : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    }
});

schema.post("findOneAndDelete",async(listing)=>{
    if(listing){
       await review.deleteMany({ _id: { $in: listing.reviews } });
    }
});

const listing = mongoose.model('listing', schema);

module.exports = listing;
