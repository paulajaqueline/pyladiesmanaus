const path = require('path');

exports.renderEvents = (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/html/events.html'));
};
