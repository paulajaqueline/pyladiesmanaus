const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const path = require('path');

router.get('/', adminController.renderDashboard);

router.get('/login', adminController.renderLogin);

router.get('/volunteer', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/html/admin-volunteers.html'));
});

router.get('/blog', adminController.renderBlog);

router.get('/opportunities', adminController.renderOpportunities);

router.get('/courses', adminController.renderCoursesAdmin);

module.exports = router;
