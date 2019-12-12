/*eslint no-console: 0, no-unused-vars: 0*/
"use strict";

var app = require("express")();
var xsenv = require("@sap/xsenv");
var hdbext = require('@sap/hdbext');
var passport = require('passport');
var JWTStrategy = require('@sap/xssec').JWTStrategy;
var basicAuth = require('basic-auth-connect');



var options = {
//	anonymous : true, // remove to authenticate calls
	auditLog : { logToConsole: true } // change to auditlog service for productive scenarios
};

// configure HANA
try {
	console.log("B");
	options = Object.assign(options, xsenv.getServices({ hana: {tag: "hana"} }));
	console.log("C");
} catch (err) {
	console.log("[WARN]", err.message);
}

// configure UAA
try {
	options = Object.assign(options, xsenv.getServices({ uaa: {tag: "xsuaa"} }));
} catch (err) {
	console.log("[WARN]", err.message);
}

app.use(hdbext.middleware(options.hana));

app.use(basicAuth('user', 'pass'));

var port = process.env.PORT || 3000;
app.listen(port, function () {
	console.info("Listening on port: " + port);
	console.info("Listening on host: " + JSON.parse(process.env.VCAP_APPLICATION).application_uris[0]);
});

var request = require('request');
var headers = {
  'Authorization':'Basic UzAwMDM5NjYwNDg6Q2VnYkAwMDM=',
  'accept':'application/json'
}
/*
var options = {
  url: "https://" + JSON.parse(process.env.VCAP_APPLICATION).application_uris[0],
  method: 'GET'
}

console.log("call own A")
request(options, function (error, response, body) {
	console.log("call own B")
	
})
*/

app.get('/', function (req, res) {
	//requestをrequire
	var request = require('request');
	var headers = {
	  'Authorization':'Basic UzAwMDM5NjYwNDg6Q2VnYkAwMDM=',
	  'accept':'application/json'
	}
	var options = {
	  url: 'https://my347097.crm.ondemand.com/sap/c4c/odata/v1/c4codataapi/ServiceRequestCollection?$top=1',
	  method: 'GET',
	  headers: headers,
	}

	doOperation(req);

	function doOperation(req) {
		request(options, function (error, response, body) {
			body = JSON.parse(body)
			console.log("start!!!\n\n\n\n\n\start!!!" + JSON.stringify(body.d.results) + "end!!!\n\n\n\n\n\end!!!")
			
			req.db.exec('SELECT * FROM MY_BOOKSHOP_AUTHORS', function (err, rows) {
				if (err) { console.log(err); }
				res.send(JSON.stringify(rows[0]));
			});
			
			req.db.exec("INSERT INTO MY_BOOKSHOP_AUTHORS VALUES ('4', '" + JSON.stringify(body.d.results[0].Name) + "')", function (err, rows) {
				if (err) { console.log(err); }
			});	
		})
	}
});


/*
app.get('/', function (req, res, next) {
	req.db.exec('SELECT CURRENT_UTCTIMESTAMP FROM DUMMY', function (err, rows) {
	if (err) { return next(err); }
	res.send('Current HANA time (UTC): ' + rows[0].CURRENT_UTCTIMESTAMP);
  });
});


var xsjs  = require("@sap/xsjs");
var xsenv = require("@sap/xsenv");
var port  = process.env.PORT || 3000;

var options = {
	anonymous : true, // remove to authenticate calls
	auditLog : { logToConsole: true }, // change to auditlog service for productive scenarios
	redirectUrl : "/index.xsjs"
};

// configure HANA
try {
	options = Object.assign(options, xsenv.getServices({ hana: {tag: "hana"} }));
} catch (err) {
	console.log("[WARN]", err.message);
}

// configure UAA
try {
	options = Object.assign(options, xsenv.getServices({ uaa: {tag: "xsuaa"} }));
} catch (err) {
	console.log("[WARN]", err.message);
}

// start server
xsjs(options).listen(port);

console.log("Server listening on port %d", port);
*/
