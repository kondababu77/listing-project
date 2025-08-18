const express = require('express');
const router = express.Router({ mergeParams: true });
const listing = require('../model_listing/model.js');
const wrapAsync = require('../utils/warpAsync.js');
const { listingSchema, reviewSchema } = require('../scheama.js');
const ExpressError = require('../utils/ExpressError.js');
const { isLoggedIn } = require('../middleware.js');

const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        throw new ExpressError(404, 'schema validation failed');
    } else {
        next();
    }
}

router.get('/', wrapAsync(async (req, res, next) => {
    let AllListings = await listing.find();

    res.render('./listings/index.ejs', { AllListings });
}));
router.get('/:id/show', wrapAsync(async (req, res) => {
    let { id } = req.params;
    let list = await listing.findById(id)
        .populate({
            path: 'reviews',
            populate: {
                path: 'author'
            }
        })
        .populate('owner');

    console.log(list);
    res.render('./listings/show.ejs', { list });
}));


router.get('/new', isLoggedIn, (req, res) => {
    res.render('./listings/new.ejs');
});
router.post('/create', validateListing, wrapAsync(async (req, res) => {
    if (!req.body.listing) {
        throw new ExpressError(400, 'Please send valid data');
    }
    const newData = req.body.listing;
    newData.owner = req.user._id;
    await listing.insertOne(newData);
    req.flash('success', 'New Listing created');
    res.redirect('/listings');
}));

router.get('/:id/edit', isLoggedIn, wrapAsync(async (req, res) => {
    let { id } = req.params;
    let list = await listing.findById(id);
    res.render('./listings/edit.ejs', { list });
}));
router.put('/:id/update', validateListing, wrapAsync(async (req, res) => {
    let { id } = req.params;
    if (!req.body.listing) {
        throw new ExpressError(400, 'Please send valid data');
    }

    await listing.findByIdAndUpdate(id, req.body.listing);
    req.flash('success', 'Listing updated successfully');
    res.redirect(`/listings/${id}/show`);
}));
router.delete('/:id/delete', isLoggedIn, wrapAsync(async (req, res) => {
    let { id } = req.params;
    await listing.findByIdAndDelete(id);
    req.flash('success', 'Listing deleted successfully');
    res.redirect('/listings');
}));

module.exports = router;