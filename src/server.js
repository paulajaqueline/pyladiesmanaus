const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, '../public')));

const adminRoutes = require('./routes/adminRoutes');
app.use('/admin', adminRoutes);

const mainRoutes = require('./routes/mainRoutes');
app.use('/', mainRoutes);

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
  console.log(`Servidor rodando em http://localhost:${port}/admin/volunteer`);
});
