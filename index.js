var express = require('express');
var JsonEnv = require('./common/JsonEnv.js');
var graph = require('./graph.json');
var app = express();
var serveStatic = require('serve-static')
var staticAssets = new serveStatic(__dirname + "/public", { 'index': ['default.html', 'default.htm'] })

var variablesFolder = __dirname + "/variables";

// set the port of our application
var port = process.env.PORT || 2708;

// set the view engine to ejs
app.set('view engine', 'ejs');
app.set('views', __dirname + "/public");
// use .html instead .ejs
app.engine('html', require('ejs').renderFile);


var jsonEnv = new JsonEnv();
var pageVariables = jsonEnv.loadJsonFile(__dirname + "/variables/index.json");

/*Optional security*/
if (process.env.ENABLE_SECURITY == "true") {

  const basicAuth = require('express-basic-auth');
  var userName = process.env.AUTH_USER;
  var users = {};
  users[userName] = process.env.AUTH_PASSWORD;
  app.use(basicAuth({
    users: users,
    challenge: true
  }))
}


app.get('/graph.json', function (req, res, next) {
  res.json(graph);
});

/**
 * If your html is About.html, just create a file About.json in
 * variables folder in a path equal of your html real location. Sample
 * web/About.html
 * web/About.json
 *
 * framework will find your html and its variables in order to render it using ejs
 */
// set routes and assets
app.get('*', function (req, res, next) {
  if (req.url === "/") {
    // render home page
    res.render('index.html', pageVariables);
  } else if (req.url.endsWith(".html")) {
    res.redirect("/");
  } else {
    return staticAssets(req, res, next);
  }
});

app.use('/', require('./routes'))

app.listen(port, function () {
  console.log('Our app is running on: http://localhost:' + port);
});
