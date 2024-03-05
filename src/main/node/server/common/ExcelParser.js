const yaml = require('js-yaml');
const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx')
const YAML = require('yaml');

async function doit() {
  var workbook = XLSX.readFile(process.env.excel_absolute_file_location);
  var sheet_name_list = workbook.SheetNames;
  console.log(sheet_name_list)
  var apps = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[process.env.sheet_index]]);

  console.log(apps)

  var uniqueApplications = {};
  var dependenciesByAppId = {}

  for(var app of apps){
    if(typeof uniqueApplications[app.id] !== 'undefined'){
      throw new Error(app.id+" is already defined");
    }
    uniqueApplications[app.id] = {};    
  }
  console.log("app unique validation: success");

  for(var app of apps){
    if(typeof app.dependencies === 'undefined' || app.dependencies === "" ) {
      dependenciesByAppId[app.id]= {};
      continue;
    };
    var dependencies = app.dependencies.split(",").map(dependency => dependency.trim());
    for(dependencyId of dependencies){
      if(typeof uniqueApplications[dependencyId] === 'undefined'){
        throw new Error("dependency "+dependencyId+" is not defined. App base: "+app.id);
      }
    }
    dependenciesByAppId[app.id]=dependencies;
  }

  console.log("dependencies validation: success\n\n\n");

  const doc = new YAML.Document();
  doc.contents = dependenciesByAppId;
  console.log(doc.toString());

  fs.promises.writeFile(path.join(process.env.npm_config_local_prefix, "src","main","resources",process.env.export_name+".yaml"), doc.toString());
  console.log("yaml file updated: success");

}


(async function () {
  await doit();
})();