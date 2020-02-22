var util = require('util');
var { Client } = require('pg');

var clientPost = require('./clientpost.js');
var futil = require('./utility.js');
var config = futil.readFile('./config.properties');
var jsConfig = JSON.parse(config.toString());

var username = jsConfig.user_postgres;
var pass = jsConfig.pass_postgres;
var host = jsConfig.host_postgres;
var db = jsConfig.db_postgres;
var connString = `postgres://${username}:${pass}@${host}:5432/${db}`;


var callProcess = async function(code, args) {
  
  // Preparing response message
  var tResponse = {};
      tResponse.statusCode = "010";
      tResponse.statusMessage = "Success";
      tResponse.data = {};
      
  // Database connection
  var client = new Client({
    connectionString: connString
  });
  client.connect();
  
  if (parseInt(code) == 00) { // First initiate apps (get data & store to DB)
    console.log('- [ REQUEST ] FR END INITIATE APPS  | ');
    
    args.url_request = 'rest/prodservices/product/listing';
    args.code_request = 'list';
    clientPost.postToClient(args, function(res) {
      // loop product data, get details, save to database
      // - loop product
      res['product'].forEach(function (item, index) {
        args.url_request = `rest/prodservices/product/details/${item['prdNo']}`;
        args.code_request = 'detail';
        
        clientPost.postToClient(args, async function(resDetail) {
          // Preparing query and values to store
          const qry = 'INSERT INTO product("name", "prdNo", "selPrc", "prdImage", "prdDetail") VALUES($1, $2, $3, $4, $5)';
          const val = [item['prdNm'][0], parseInt(item['prdNo']), parseInt(item['selPrc']), resDetail['prdImage01'][0], resDetail['htmlDetail'][0]]
          // Store data to database
          var save = await client.query(qry, val)
            .then(result => {
              return { fail: '00', data: result.rows }
            }).catch(err => {
              return { fail: '01', msg: 'Failed to insert product to database!' }
            });
          
          if (save['fail'] == '01') {
            tResponse.statueCode = "097";
            tResponse.statusMessage = save['msg'];
          }
        });
      });
    });
  }else if (parseInt(code) == 01) { // Retrieve data from DB
    console.log('- [ REQUEST ] FR END RQ DATA PRD    | ');
    // Request get data to database
    var products = await client.query('SELECT * FROM product')
      .then(res => {
        return { fail: '00', data: res.rows }
      }).catch(err => {
        return { fail: '01', msg: 'Failed to get product from database' }
      })
    
    // build response data
    if (products['fail'] == '01') {
      tResponse.statueCode = "096";
      tResponse.statusMessage = products['msg'];
    }else {
      tResponse.data = products['data'];
    }
    
  }else if (parseInt(code) == 02) { // Edit product
    console.log('- [ REQUEST ] FR END EDIT PRODUCT   | ')
    
    // Preparing query
    const qry = 'UPDATE product SET "name" = $1, "selPrc" = $2, "prdImage" = $3, "prdDetail" = $4 WHERE "prdNo" = $5';
    const val = [args.prdName, args.prdPrc, args.prdImage, args.prdDetail, args.prdNo];
    
    var update = await client.query(qry, val)
      .then(res => {
        return { fail: '00', data: res.rows };
      }).catch(err => {
        return { fail: '01', msg: 'Failed to update product details' };
      });
    
    if (update['fail'] == '01') {
      tResponse.statusCode = '095';
      tResponse.statusMessage = update['msg'];
    }else {
      tResponse.data = args;
    }
    
  }else if (parseInt(code) == 03) { // Delete product
    console.log('- [ REQUEST ] FR END DELETE PRODUCT | ')
    
    // Preparing query
    const qry = 'DELETE FROM product WHERE "prdNo" = $1';
    const val = [args.prdNo];
    
    var del = await client.query(qry, val)
      .then(res => {
        return { fail: '00', data: res.rows };
      }).catch(err => {
        return { fail: '01', msg: 'Failed to delete product' };
      });
    
    if (del['fail'] == '01') {
      tResponse.statusCode = '095';
      tResponse.statusMessage = del['msg'];
    }
    
  }else {
    tResponse.statusCode = "099";
    tResponse.statusMessage = "Unknown Request Code";
  }
  
  console.log(`- [ RESPONSE ] RESPONSE TO FR END    | ${util.inspect(JSON.stringify(tResponse), false, null)}`)
  return tResponse;
  
}
module.exports.callProcess = callProcess;