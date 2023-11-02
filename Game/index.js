const express = require("express");
const handlebars = require("express-handlebars");
const router = require("./config/router");
const logger = require("morgan");
const sassMiddleware = require('node-sass-middleware');
const path = require('path');

const app = express();

app.engine('handlebars', handlebars({
  helpers: require(`${__dirname}/app/views/helpers`)
}));

app.set("view engine", "handlebars");
app.set("views", `${__dirname}/app/views`);

app.use(sassMiddleware({
  src: `${__dirname}/public/scss`,
  dest: `${__dirname}/public/css`,
  outputStyle: 'compressed',
  prefix: '/css'
}));

app.get('/gamecontent', (req, res) => {
    res.sendFile(path.join(__dirname, './app/views/main/game.html'));
});

app.use('/css', express.static(`${__dirname}/public/css`));
app.use('/webfonts', express.static(`${__dirname}/node_modules/@fortawesome/fontawesome-free/webfonts`));
app.use('/img', express.static(`${__dirname}/public/img`));
app.use('/js', [
  express.static(`${__dirname}/node_modules/jquery/dist/`),
  express.static(`${__dirname}/node_modules/popper.js/dist/umd/`),
  express.static(`${__dirname}/node_modules/bootstrap/dist/js/`),
  express.static(`${__dirname}/public/js`)
]);

app.use(logger("combined"));
app.use(express.urlencoded({ extended: false }));
app.use(router);

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000/");
});
