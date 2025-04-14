const express = require('express');
const homeController = require('../controllers/homeController');

const router = express.Router();
let ctrl = new homeController();
router.get('/', ctrl.screenHome);

module.exports = router;