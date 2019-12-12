module.exports = (srv) => {
	const {Books} = cds.entities ('my.bookshop')

	// Reduce stock of ordered books
	srv.before ('CREATE', 'Orders', async (req) => {
    	const order = req.data
		if (!order.amount || order.amount <= 0) {
			return req.error (400, 'Order at least 1 book')
		}
		const tx = cds.transaction(req)
		const affectedRows = await tx.run (
			UPDATE (Books)
				.set   ({ stock: {'-=': order.amount}})
				.where ({ stock: {'>=': order.amount},/*and*/ ID: order.book_ID})
		)
		if (affectedRows === 0)  req.error (409, "Sold out, sorry")
	})
	
	srv.after ('READ', 'Books', async (req) => {
		//console.log("what is srv???start"+JSON.stringify(srv)+"what is srv???end")
		
		var conn = $.hdb.getConnection();
		
		console.log("what is conn???start"+JSON.stringify(conn)+"what is con???end")
		
		//requestをrequire
		var request = require('request');
		
		//ヘッダーを定義
		var headers = {
		  'Authorization':'Basic UzAwMDM5NjYwNDg6Q2VnYkAwMDM=',
		  'accept':'application/json'
		}
		
		//オプションを定義
		var options = {
		  url: 'https://my347097.crm.ondemand.com/sap/c4c/odata/v1/c4codataapi/ServiceRequestCollection?$top=10',
		  method: 'GET',
		  headers: headers,
		}

		console.log("B!!")

		//リクエスト送信
		request(options, function (error, response, body) {
			body = JSON.parse(body)
			//コールバックで色々な処理
//			if (typeof body.d.results !== undefined) {
//				console.log("start!!!\n\n\n\n\n\start!!!" + body + "end!!!\n\n\n\n\n\end!!!")
				console.log("start!!!\n\n\n\n\n\start!!!" + JSON.stringify(body.d.results) + "end!!!\n\n\n\n\n\end!!!")
//			}
		})
	})

	// Add some discount for overstocked books
	srv.after ('READ', 'Books', each => {
		if (each.stock > 111)  each.title += ' -- 11% discount!'
		
// 		const CONNECTION = {
// 		  "url": "https://my347097.crm.ondemand.com/sap/c4c/odata/v1/c4codata",
// 		  "user": "S0003966048",
// 		  "password": "Cegb@003"
// 		}
		
// 		require('node-ui5/factory')({
// 		  bootstrapLocation: 'https://openui5.hana.ondemand.com/resources/sap-ui-core.js',
// 		  verbose: true
// 		}).then(({sap}) => {
// 			sap.ui.require([
// 				'sap/ui/model/odata/v2/ODataModel',
// 				'node-ui5/authenticate/basic-with-csrf',
// 				'node-ui5/promisify',
// 			], async function (ODataModel, authenticate) {
// 				//console.log(await authenticate(CONNECTION))
// //				const model = new sap.ui.model.odata.ODataModel(await authenticate(CONNECTION))
// 				 const model = new sap.ui.model.odata.v2.ODataModel("https://my347097.crm.ondemand.com/sap/c4c/odata/v1/c4codataapi")
//       //         	json     : true,
//       //         	user     : "S0003966048",
//       //         	password : "Cegb@003",
//     			// 	useBatch : true
//     			// })
// 				await model.metadataLoaded()
// 				console.log('A')
// 				model.request({
// 					requestUri: "/ServiceRequestCollection",
// 					method: "GET",
// 					headers: {
// 						"X-Requested-With": "XMLHttpRequest",
// 						"Content-Type": "application/atom+xml",
// 						"DataServiceVersion": "2.0",
// 						"X-CSRF-Token": "Fetch",
// 						"Authorization":"Basic UzAwMDM5NjYwNDg6Q2VnYkAwMDM="
// 					}
// 				}, function (data, response) {
// 				console.log('B')
// 					header_xcsrf_token = response.headers['x-csrf-token']; //get header values
// 					OData.request({
// 						requestUri: "/ServiceRequestCollection",
// 						method: "GET",
// 						headers: {
// 							"X-Requested-With": "XMLHttpRequest",
// 							"Content-Type": "application/atom+xml",
// 							//"DataServiceVersion": "2.0",
// 							"X-CSRF-Token": header_xcsrf_token
// 						}
// 					}, function (data, request) {}, function (err) {});
// 				}, function (err) {
// 				console.log('C')
// 					var request = err.request;
// 					var response = err.response;
// 					//alert("Error in Get -- Request "+request+" Response "+response);
// 					console.log("error message!! : " + JSON.parse(oError.response.body))
// 				});
// 				console.log('D')
        		
// 				// console.log('B2')
// 				// //await model.metadataLoaded()
// 				// console.log('Listing entities...')
// 				// console.log('C1')
// 				// var data = await model.read('/ServiceRequestCollection', {
// 				// 	success : function(oData, response) {
// 				// 		console.log("Read successfull");
// 				// 	},
// 				// 	error : function(oError) {
// 				// 		console.log("error message!! : " + JSON.parse(oError.response.body));
// 				// 	}})
					
					
// 				// console.log('D1')
// 				/*
// 				data.results.forEach(entity => {
// 					let name = entity.Name
// 					if (name.length > 40) {
// 						name = `${name.substring(0, 37)}...`
// 		        	}
// 					console.log(name.padEnd(40, ' '), entity.Guid)
// 				})
// 				console.log(`Found ${data.results.length} entities`)
// 				*/
// 		    })
// 		})

	})
}