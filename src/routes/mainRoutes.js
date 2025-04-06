const express = require('express');
const path = require('path');
const router = express.Router();

const homeController = require('../controllers/homeController');
const aboutController = require('../controllers/aboutController');
const eventsController = require('../controllers/eventsController');
const opportunitiesController = require('../controllers/opportunitiesController');
const blogController = require('../controllers/blogController');
const projectsController = require('../controllers/projectsController');
const volunteerController = require('../controllers/volunteerController');
const contactController = require('../controllers/contactController');
const beginnersController = require('../controllers/beginnersController');
const courseController = require('../controllers/coursesController');

router.get('/', homeController.renderHome);
router.get('/about', aboutController.renderAbout);
router.get('/events', eventsController.renderEvents);
router.get('/opportunities', opportunitiesController.renderOpportunities);
router.get('/blog', blogController.renderBlog);
router.get('/blog/post', blogController.renderBlogPost);
router.get('/projects', projectsController.renderProjects);
router.get('/courses', courseController.renderCourses);
router.get('/course-post', courseController.renderCoursePost);
router.get('/volunteer', volunteerController.renderVolunteer);
router.get('/contact', contactController.renderContact);
router.get('/beginners', beginnersController.renderBeginners);

router.get('/admin/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/html/admin-login.html'));
});

module.exports = router;
