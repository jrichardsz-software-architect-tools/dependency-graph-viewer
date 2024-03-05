const include = require('nodejs-require-enhancer').include;
const express = require('express');
const JsonEnv = require('./common/JsonEnv.js');
const StringHelper = require('./common/StringHelper.js');
const app = express();
const serveStatic = require('serve-static')
const path = require('path');
const yaml = require('js-yaml');
const rateLimit = require('express-rate-limit');
var CmdbHelper = include('/src/main/node/server/common/CmdbHelper.js');
const MicrosoftLoginProvider = require('nodeboot-web-security-starter').MicrosoftLoginProvider;

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
var pageVariables = jsonEnv.loadJsonFile(path.join(process.env.npm_config_local_prefix, "src","main", "resources", "settings.json"));

var cmdbHelper = new CmdbHelper();
var cmdbs = {};

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

app.get('/status', function(req, res, next) {
  res.json({message:"success"});
});

/*Optional security*/
if(process.env.SECURITY_TYPE == "basic"){

  const basicAuth = require('express-basic-auth');
  var userName = process.env.AUTH_USER;
  var users = {};
  users[userName] = process.env.AUTH_PASSWORD;
  app.use(basicAuth({
      users: users,
      challenge: true
  }))
}else if(process.env.SECURITY_TYPE == "microsoft"){

  var loginProvider = new MicrosoftLoginProvider({
    express: app,
    baseUrl: process.env.BASE_URL,
    usersDataSource: {
      envKey : "ALLOWED_USERS"
    },
    microsoft: {
      clientId: process.env.LOGIN_OAUTH2_CLIENT_ID,
      clientSecret: process.env.LOGIN_OAUTH2_CLIENT_SECRET
    }
  });
  
  loginProvider.configure();  
  console.log("microsoft security was configured")

}else{
  console.log("process.env.SECURITY_TYPE was not confured. Your web is public!")
}

app.get('/graph.json', limiter, function(req, res, next) {
  var id = req.query.id;
  if(typeof id === 'undefined' || id ==null ) res.json(StringHelper.simulateSuccessJson("id_not_found"));

  if(id.length>25) return res.json(StringHelper.simulateSuccessJson("id_exceeded_max_value"));

  if(StringHelper.hasIvalidChars(id)) return res.json(StringHelper.simulateSuccessJson("id_has_invalid_chars"));

  if(typeof cmdbs[id] !== 'undefined'){
    return res.json(cmdbs[id]);
  }

  var fileName = `${id}.yaml`
  var cmdb = cmdbHelper.readFromYaml(process.env.CMDB_YAML_FILE_LOCATION || 
      path.join(process.env.npm_config_local_prefix, "src","main", "resources", fileName));
  cmdbs[id] = cmdb;
  
  res.json(cmdb);
});

app.get('*', limiter, function(req, res, next) {
    if(req.path === "/"){      
      res.render('index.html', pageVariables);
    }else{
      return staticAssets(req, res, next);
    }
});

app.listen(port, function() {
    console.log('Our app is running on port: ' + port);
});
