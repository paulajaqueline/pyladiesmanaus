const path = require('path');

exports.renderContact = (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/html/contact.html'));
};
