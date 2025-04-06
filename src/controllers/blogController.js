const path = require('path');

exports.renderBlog = (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/html/blog.html'));
};

exports.renderBlogPost = (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/html/blog-post.html'));
};
