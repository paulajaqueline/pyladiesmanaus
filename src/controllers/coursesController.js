const path = require('path');

exports.renderCourses = (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/html/courses.html'));
};

exports.renderCoursePost = (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/html/course-post.html'));
};
