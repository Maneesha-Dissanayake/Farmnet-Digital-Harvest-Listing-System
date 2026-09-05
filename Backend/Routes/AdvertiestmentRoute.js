const express = require('express');
const router  = express.Router();
const {upload} = require('../utils/cloudinary');
const { protect } = require("../Middleware/authMiddleware");
const {
    createAdvertisement,
    getAllAdvertisements,
    getMyAdvertisements,
    getAdvertisementById
} = require('../Controllers/AdvertiestmentCont');

router.post('/', protect, upload.array('images', 5), createAdvertisement);

router.get('/', getAllAdvertisements);

router.get('/my-ads', protect, getMyAdvertisements);

router.get('/:id', getAdvertisementById);

module.exports = router;

