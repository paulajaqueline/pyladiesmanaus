const path = require('path');

exports.renderVolunteer = (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/html/volunteer.html'));
};
