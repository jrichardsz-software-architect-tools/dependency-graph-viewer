const yaml = require('js-yaml');
const fs = require('fs');

function CmdbHelper() {

  this.readFromYaml = (yamlLocation) => {

    const yamlObject = yaml.load(fs.readFileSync(yamlLocation, 'utf8'));    

    var nodes = [];
    var appByName = {};
    var position = 0;
    for (var appName of Object.keys(yamlObject).sort()) {
      
      var dependencies = yamlObject[appName];
      
      nodes.push({
        "name": appName,
        "position": position,
        "group": 1,
        "class": "app",
        "dependencies": dependencies
      });
      appByName[appName] = position;
      position++;
    }

    console.log((JSON.stringify(nodes)));

    var links = [];
    for (var key in nodes) {
      var node = nodes[key];

      var dependencies = node.dependencies;
      console.log("app:" + node.name)
      console.log("dependencies:")
      console.log(JSON.stringify(dependencies))
      if (typeof dependencies === 'undefined' || (dependencies && dependencies.length && dependencies.length == 0)) {
        continue;
      }

      for (var d in dependencies) {
        var dependency = dependencies[d];

        if (dependency && dependency.length && dependency.length == 0) {
          continue;
        }

        console.log("dependency:" + dependency)
        console.log("position:" + appByName[dependency])

        links.push({
          "source": node.position,
          "target": (typeof appByName[dependency] !== 'undefined' ? appByName[dependency] : appByName['unknown']),
          "value": 1,
          "type": "depends"
        });
      }
    }

    return {
      "nodes": nodes,
      "links": links
    };

  }

}

module.exports = CmdbHelper;