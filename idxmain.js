var Hapi = require('@hapi/hapi');
var util = require('util');

var procRequest = require('./procrequest.js');

var performRequest = function(request, reply) {
  
  var args = request.payload;
  var response = {
    statusCode: "098",
    statusMessage: "Failed! Request Data is Empty",
    data: {}
  };
  
  console.log("\n\n ============================================================================");
  console.log("------------------------------- ELEVENIA HOST ADAPTER -------------------------");
  console.log("=================================================================================");
  if (args) {
    console.log(`- [ REQUEST ] FR END REQUEST       | ${util.inspect(JSON.stringify(args), false, null)}`);
    
    var code = args.code;
    response = procRequest.callProcess(code, args)
  }
  
  console.log("=================================================================================");
  return response;
  
};

var init = async () => {
  
  var server = Hapi.server({
    port: 1999,
    host: 'localhost'
  });
  
  server.route({
    method: 'POST',
    path: '/api/elevenia',
    handler: function(request, h) {
      return performRequest(request, h);
    }
  })
  
  await server.start();
  console.log(`Server running on ${server.info.uri}`)
  
};

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
})

init();