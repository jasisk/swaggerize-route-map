var Table = require('cli-table');
var Chalk = require('chalk');

var exists = '[' + Chalk.green('✓') + ']';
var notExists = '[' + Chalk.red('x') + ']';

module.exports = function buildMap(swagger) {
  var table = new Table({
    head: ['Route', 'Methods']
  });
  var paths = swagger.api.paths;
  var map = Object.keys(paths).reduce(function (accum, path) {
    var methods = paths[path];
    accum[path] = Object.keys(methods).reduce(function (accum, method) {
      accum[method] = false;
      return accum;
    }, {});
    return accum;
  }, {});

  swagger.routes.forEach(function (route) {
    map[route.path][route.method] = true;
  });

  table.push.apply(table, Object.keys(map).map(function (route) {
    var methods = Object.keys(map[route]).map(function (method) {
      return method + ' ' + (map[route][method] ? exists : notExists);
    }).join(', ');
    return [route, methods];
  }));

  console.log(table.toString());
}
