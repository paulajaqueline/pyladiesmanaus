const path = require('path');

exports.renderLogin = (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/html/admin-login.html'));
};

exports.renderDashboard = (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/html/admin.html'));
};

exports.renderBlog = (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/html/admin-blog.html'));
};

exports.renderOpportunities = (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/html/admin-opportunities.html'));
};

exports.renderCoursesAdmin = (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/html/admin-courses.html'));
};
