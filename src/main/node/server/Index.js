const include = require('nodejs-require-enhancer').include;
const express = require('express');
const JsonEnv = require('./common/JsonEnv.js');
const app = express();
const serveStatic = require('serve-static')
const path = require('path');
const yaml = require('js-yaml');
const fs   = require('fs');
var CmdbHelper = include('/src/main/node/server/common/CmdbHelper.js');
const staticAssets = new serveStatic(
  path.join(process.env.npm_config_local_prefix, "src","main","node", "web"), { 'index': ['default.html', 'default.htm'] })

// set the port of our application
var port = process.env.PORT || 2708;

// set the view engine to ejs
app.set('view engine', 'ejs');
app.set('views',path.join(process.env.npm_config_local_prefix, "src","main","node", "web"));
// use .html instead .ejs
app.engine('html', require('ejs').renderFile);

var jsonEnv = new JsonEnv();
var pageVariables = jsonEnv.loadJsonFile(path.join(process.env.npm_config_local_prefix, "src","main","node", "server", "settings.json"));

var cmdbHelper = new CmdbHelper();
var cmdb = cmdbHelper.readFromYaml(process.env.CMDB_YAML_FILE_LOCATION || path.join(process.env.npm_config_local_prefix, "src","main","node", "server", "cmdb.yaml"));
console.log(JSON.stringify(cmdb, null, 4));

/*Optional security*/
if(process.env.ENABLE_SECURITY == "true"){

  const basicAuth = require('express-basic-auth');
  var userName = process.env.AUTH_USER;
  var users = {};
  users[userName] = process.env.AUTH_PASSWORD;
  app.use(basicAuth({
      users: users,
      challenge: true
  }))
}


app.get('/graph.json', function(req, res, next) {
  res.json(cmdb);
});

app.get('*', function(req, res, next) {
    if(req.path === "/"){      
      res.render('index.html', pageVariables);
    }else{
      return staticAssets(req, res, next);
    }

});

app.listen(port, function() {
    console.log('Our app is running on port: ' + port);
});
