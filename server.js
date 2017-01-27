/* eslint no-console: 0 */

const path = require('path');
const express = require('express');
const webpack = require('webpack');
const webpackMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const bodyParser = require("body-parser");
const config = require('./webpack.config.js');

const entries = [];
const isDeveloping = process.env.NODE_ENV !== 'production';
const port = isDeveloping ? 3000 : process.env.PORT;
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

if (isDeveloping) {
  const compiler = webpack(config);
  const middleware = webpackMiddleware(compiler, {
    publicPath: config.output.publicPath,
    contentBase: 'src',
    stats: {
      colors: true,
      hash: false,
      timings: true,
      chunks: false,
      chunkModules: false,
      modules: false
    }
  });

  app.use(middleware);
  app.use(webpackHotMiddleware(compiler));
  app.get('/', function response(req, res) {
    //res.write(middleware.fileSystem.readFileSync(path.join(__dirname, 'dist/index.html')));
    //res.end();
    response.render("index");
  });

  app.get("/new-entry", function(request, response) {
    response.render("new-entry");
  });

  app.post("/new-entry", function(request, response) {
    if (!request.body.title || !request.body.body) {
      response.status(400).send("Entries must have a title and a body.");
      return;
    }
    entries.push({
      title: request.body.title,
      content: request.body.body,
      published: new Date()
    });
    response.redirect("/");
  });
} else {
  app.use(express.static(__dirname + '/dist'));
  app.get('*', function response(req, res) {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
  });
}

app.set("views", path.resolve(__dirname, "views"));
app.set("view engine", "ejs");

app.listen(port, '127.0.0.1', function onStart(err) {
  if (err) {
    console.log(err);
  }
  console.info('==> 🌎 Listening on port %s. Open up http://0.0.0.0:%s/ in your browser.', port, port);
});
