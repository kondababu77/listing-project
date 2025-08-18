const express = require('express');
const listing = require('../model_listing/model.js');
const wrapAsync = require('../utils/warpAsync.js');
const ExpressError = require('../utils/ExpressError.js');
const {listingSchema,reviewSchema} = require('../scheama.js');
const review = require('../model_listing/review.js');
const router = express.Router({mergeParams : true});
const {isLoggedIn} = require('../middleware.js');

const validateReview  = (req,res,next) =>{
    let {error } = reviewSchema.validate(req.body);
    if(error){
        throw new ExpressError(404,'schema validation failed');
    }else{
        next();
    }
}
router.delete('/:reviewId',isLoggedIn,wrapAsync(async (req,res)=>{
    let {id , reviewId} = req.params;
    await listing.findByIdAndUpdate(id,{$pull :{reviews : reviewId}});
    await review.findByIdAndDelete(reviewId);
    req.flash('success','review deleted successfully');
    res.redirect(`/listings/${id}/show`);
}))

router.post("/reviews",isLoggedIn, validateReview,wrapAsync(async(req,res)=>{
    let list = await listing.findById(req.params.id);
    let newReview = new review(req.body.review);
    newReview.author = req.user._id;
    list.reviews.push(newReview);

    await newReview.save();
    await list.save();

    req.flash('success','review added successfully');
    res.redirect(`/listings/${req.params.id}/show`);
}));

module.exports = router;