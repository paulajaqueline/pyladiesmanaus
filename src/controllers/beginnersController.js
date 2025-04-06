const path = require('path');

exports.renderBeginners = (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/html/beginners.html'));
};
