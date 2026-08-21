const express = require('express');
const router  = express.Router();
const {upload} = require('../utils/cloudinary');
const {createAdvertisement} = require('../Controllers/AdvertiestmentCont');

router.post('/', upload.array('images',5), createAdvertisement);

module.exports = router;

