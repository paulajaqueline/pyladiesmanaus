const path = require('path');

exports.renderAbout = (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/html/about.html'));
};
