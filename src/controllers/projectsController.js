const path = require('path');

exports.renderProjects = (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/html/projects.html'));
};
