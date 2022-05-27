const express = require('express');
const routes = require('./routes');
const exphbs = require('express-handlebars');

const app = express();
const PORT = 8087;

app.use('/', routes);

app.engine(
  'hbs',
  exphbs.engine({
    defaultLayout: '../home',
    extname: '.hbs',
  })
);

app.set('view engine', 'hbs');

const db = require('../src/models');

db.sequelize.sync().then(() => {
  console.info('Database synchronized');
});

app.listen(PORT, () => {
  console.info(`app is runnig on port ${PORT}`);
});
