const path = require('path');

exports.renderHome = (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/html/index.html'));
};
