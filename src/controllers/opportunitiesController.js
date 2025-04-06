const path = require('path');

exports.renderOpportunities = (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/html/opportunities.html'));
};
