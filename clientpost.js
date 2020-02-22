var superagent = require('superagent');
var xml2js = require('xml2js');
var util = require('util');

var futil = require('./utility.js');
var config = futil.readFile('./config.properties');
var jsConfig = JSON.parse(config.toString())

var postToClient = function(args, callback) {
  
  // Initiate variables
  var response;
  var agent = superagent.agent();
  var endpoint = `${jsConfig.end_point}${args.url_request}`;
  
  agent.get(endpoint)
    .set('openapikey', jsConfig.api_key)
    .then(response => {
      var parser = new xml2js.Parser();
     
      return parser.parseString(response.body, function(err, result) {
        console.log(`- [ RQ CLIENT ] RESPONSE HOST        | ${util.inspect(JSON.stringify(result), false, null)}`)
        
        // Build Json Data
        switch (args.code_request) {
          case 'list':
            var jsResult = result['Products'];
            break;
          case 'detail':
            var jsResult = result['Product'];
            break;
        }
        
        callback(jsResult);
       
      });
  });

  return response;
  
}
module.exports.postToClient = postToClient;