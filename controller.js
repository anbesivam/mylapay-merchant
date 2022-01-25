const {isEmpty} = require("lodash");
const mysql = require('mysql');
const request = require('request')
const axios = require('axios')
const mysqlCon = require('../db.js')
let logger = require("../logger.js").Logger;

const moment= require( 'moment' );

var exports = {}

const getMerchantDetails = (imid)=>{
	return new Promise((resolve,reject)=>{
		mysqlCon.query("SELECT users.contact_no,users.contact_email,shop.shop_name,address.iShop_Address,CONCAT(address.Building_No,',',address.Street_Name) as address,address.Pincode,address.City,address.State "+
		"from tblusers users "+
		"left join tblshops shop on shop.iMerchant = users.iUser "+
		"left join tblshop_address address on address.iShop = shop.id "+
		"where users.imid = ? and shop.Page_Type = 1",[imid],(err,shop_details) => {
			err ? reject(err) : resolve(shop_details);
		})
	})
}

const getCustomerAddress = (iOrder)=>{
	return new Promise((resolve,reject)=>{
		mysqlCon.query("SELECT cust_address.iCustomer_Address,cust_address.customerName,cust_address.phone,CONCAT(cust_address.Building_No,',',cust_address.Street_Name) as address,cust_address.Pincode,cust_address.City,cust_address.State from tblorders orders left join tblcustomer_address cust_address on orders.iCustomer_Address = cust_address.iCustomer_Address where orders.iOrder = ?",[iOrder],(err,customerAddress) => {
			err ? reject(err) : resolve(customerAddress);
		})
	})
}
const shipmentRequest = (shipmentRequestData,order_id) => {
	if(order_id){
		return new Promise((resolve,reject) => {
			mysqlCon.query('UPDATE tbl_shippment_request set ? where Reference_ID = ?',[shipmentRequestData,order_id],async (error,tblShipmentRequestResponse) => {
				error ? reject(error) : resolve(tblShipmentRequestResponse)
			})
    })    
	}
	else{
		return new Promise((resolve,reject) => {
			mysqlCon.query('INSERT INTO tbl_shippment_request set ?',[shipmentRequestData],async (error,tblShipmentRequestResponse) => {
				error ? reject(error) : resolve(tblShipmentRequestResponse)
			})
    })    
	}
}
const updateShipmetOrderId = (iOrder,timestamp) => {
	mysqlCon.query('UPDATE tblorders set shipment_order_id = ? where iOrder = ?',[timestamp,iOrder], (error,result) => {
		if(error){
			console.log(error);
		}
		else{
			console.log("timestamp updated successfully!");
		}
	})
}
const checkRequestExist = (order_id) => {
	return new Promise((resolve,reject) => {
		mysqlCon.query('SELECT Reference_ID from tbl_shippment_request where Reference_ID = ?',[order_id],async (error,result) => {
			error ? reject(error) : resolve(result)
		})
	})    
}

const getish_Req = (iOrder) => {
	return new Promise((resolve,reject) => {
			mysqlCon.query(`select ish_Req,Request_ID from tbl_shippment_request where Reference_ID = ?`,[iOrder],async (error,shippment_request_data) => {
				error ? reject(error) : resolve(shippment_request_data)
			})
	})    
}

exports.fetchWaybill = async (req,res) => {

  try{
    console.log("calling fetchWaybill");
  
   
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Token ${process.env.TOKEN_TEST}`
    }

    let jsonData = {
			"cl":	process.env.CLIENT_TEST
		}
    
    console.log(jsonData);
    request({
      method: "GET",
      uri: `${process.env.DELHIVERY_URL_TEST}/waybill/api/fetch/json/`,
      headers: headers,
      json: jsonData
    }, function(error, httpResponse, body) {
      //handle response
      if(error){
				console.log(error)
        res.status(500).json({
              "success": false,
              "error": error
        })
        return
      }
      console.log("fetchWaybill response");
      console.log(body);
      
			// shipmentQuoteResponse
			res.status(200).send({
				success: true,
				data: body
			});
			return
		})
	}
  catch(e) {
    res.status(500).json({
          "success": false,
          "error": e
    })
    return
  }

}

exports.fetchWaybillBulk = async (req,res) => {

  try{
    console.log("calling fetchWaybillBulk");
		let waybill_count = req.query.waybill_count;
   
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Token ${process.env.TOKEN_TEST}`
    }

    let jsonData = {
			"count":	waybill_count,
			"cl":	process.env.CLIENT_TEST
		}
    
    console.log(jsonData);
    request({
      method: "GET",
      uri: `${process.env.DELHIVERY_URL_TEST}waybill/api/bulk/json/`,
      headers: headers,
      qs: jsonData
    }, function(error, httpResponse, body) {
      //handle response
      if(error){
				console.log(error)
        res.status(500).json({
              "success": false,
              "error": error
        })
        return
      }
      console.log("fetchWaybillBulk response");
      console.log(body);
      let bulkwaybill = body;
			// shipmentQuoteResponse
			res.status(200).send({
				success: true,
				data: bulkwaybill
			});
			return
		})
	}
  catch(e) {
    res.status(500).json({
          "success": false,
          "error": e
    })
    return
  }

}

exports.pincodeServiceability = async (req,res) => {

  try{
    console.log("Check Serviceability");
		let Pincode = req.query.Pincode;
   
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Token ${process.env.TOKEN_TEST}`
    }
		
    let jsonData = {
			"filter_codes":	Pincode
		}
    
    request({
      method: "GET",
      uri: `${process.env.DELHIVERY_URL_TEST}c/api/pin-codes/json/?filter_codes=${Pincode}`,
      headers: headers,
			json:jsonData,
    }, function(error, httpResponse, body) {
      //handle response
			
      if(error){
				console.log(error);
        res.status(500).json({
              "success": false,
              "error": error
        })
        return
      }
      console.log("check serviceability response");
      //console.log(body);
      
			// shipmentQuoteResponse
			res.status(200).send({
				success: true,
				data: body
			});
			return
		})
	}
  catch(e) {
    res.status(500).json({
          "success": false,
          "error": e
    })
    return
  }

}

exports.createOrder = async (req,res) => {
	
  try{
    console.log("create order test");
		let imid = req.body.imid;
		let iOrder = req.body.iOrder;
		//let request_id = req.body.request_id;
		
		let request_id = Date.now()+iOrder;//delhivery order id
    
    let schedule_timeFormated = moment().format("YYYY-MM-DD HH:mm:ss");
    
		let payment_method = "Prepaid";
		let current_timestamp = Date.now();
		let merchantDetails = await getMerchantDetails(imid);
		let customerAddress = await getCustomerAddress(iOrder);
		let iCustomer_Address = customerAddress[0].iCustomer_Address;
		let iShop_Address = merchantDetails[0].iShop_Address;
		
   
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Token ${process.env.TOKEN_TEST}`,
    }
		let pickup_location = {
			"phone": merchantDetails[0].contact_no,
			"city": merchantDetails[0].City,
			"name": merchantDetails[0].shop_name,
			"pin": merchantDetails[0].Pincode.toString(),
			"address": merchantDetails[0].address,
			"country": "India",
		}
		let shipments = [{
			"add": customerAddress[0].address,
			"address_type": "home",
			"phone": customerAddress[0].phone,
			"payment_mode": payment_method,
			"name": customerAddress[0].customerName,
			"pin": customerAddress[0].Pincode,
			"order": request_id,
		}]
		console.log("---shipments---",shipments)
    let jsonDataTemp = {
			pickup_location : pickup_location,
			shipments : [{
				"add": customerAddress[0].address,
				"address_type": "home",
				"phone": customerAddress[0].phone,
				"payment_mode": payment_method,
				"name": customerAddress[0].customerName,
				"pin": customerAddress[0].Pincode,
				"order": request_id,
			}]
		}
		let jsonData = {
			format: "json",
			data: {
				shipments : shipments,
				pickup_location : pickup_location
			}
		}
    console.log("---",jsonData)
    request({
      method: "POST",
      uri: `${process.env.DELHIVERY_URL_TEST}api/cmu/create.json`,
      headers: headers,
			form: `format="json",data:${jsonDataTemp}`
			
      // json: 
    }, async function(error, httpResponse, body) {
      
      if(error){
				console.log(error);
        res.status(500).json({
              "success": false,
              "error": error
        })
        return
      }
      console.log("create Order test response");
      console.log(body);
			if(body.error_code || body.error){
				res.status(500).json({
					"success": false,
					"error": body.error
        })
        return
			}
			let delhiveryresponse = body;
			
			// let data = {
				// iMerch_Address: iShop_Address,
				// iCustomer_Adress: iCustomer_Address,
				// Request_ID: request_id,
				// Reference_ID: iOrder,
				// payment_method: "Delhivery_"+payment_method,
				// schedule_time: schedule_timeFormated
			// }
			
			// let checkShipmentRequest = await checkRequestExist(iOrder);
			// let insertOrUpdateRequest;
			// if(checkShipmentRequest.length > 0){
				// insertOrUpdateRequest = await shipmentRequest(data,iOrder);
			// }
			// else{
				// insertOrUpdateRequest = await shipmentRequest(data);
			// }
			
			// await updateShipmetOrderId(iOrder,current_timestamp)

			// let shippmentReqData = await getish_Req(iOrder);
			// let ish_Req = shippmentReqData[0].ish_Req;
			// let trackData = {
				// ish_Req: ish_Req,
				// Task_id: delhiveryresponse.waybill,
				// State: delhiveryresponse.packages[0].status
			// }
			
			// let checkIshReq = await checkIshReqPromise(ish_Req);
			
			// if(checkIshReq.length > 0){
				// mysqlCon.query('UPDATE tbl_shippment_track set ? where ish_Req = ?',[trackData,ish_Req], (error,shipmentTrack) => {
					// if(error){
						// console.log(error)
						// res.status(500).json({
							// "success": false,
							// "error": error.sqlMessage
						// })
						// return
					// }
					// else{
						// console.log("shipment track updated.")
					// }
				// })
			// }
			// else{
				// mysqlCon.query('INSERT INTO tbl_shippment_track set ?',[trackData], (error,shipmentTrack) => {
					// if(error){
						// console.log(error)
						// res.status(500).json({
							// "success": false,
							// "error": error.sqlMessage  
						// })
						// return
					// }
					// else{
						// console.log("shipment track inserted.")
					// }
				// })
			// } 
				
      logger.info("crder creation :: ",JSON.stringify(body))
			res.status(200).send({
				success: true,
				data: body
			});
			return
		})
		
	}
  catch(e) {
		console.log(e)
    res.status(500).json({
          "success": false,
          "error": e
    })
    return
  }

}
exports.createOrder1 = async (req,res) => {
	
  try{
    console.log("create order test");
		let imid = req.body.imid;
		let iOrder = req.body.iOrder;
		//let request_id = req.body.request_id;
		
		let request_id = Date.now()+iOrder;//delhivery order id
    
    let schedule_timeFormated = moment().format("YYYY-MM-DD HH:mm:ss");
    
		let payment_method = "Prepaid";
		let current_timestamp = Date.now();
		let merchantDetails = await getMerchantDetails(imid);
		let customerAddress = await getCustomerAddress(iOrder);
		let iCustomer_Address = customerAddress[0].iCustomer_Address;
		let iShop_Address = merchantDetails[0].iShop_Address;
		
   
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Token ${process.env.TOKEN_TEST}`,
    }
		let pickup_location = {
			"phone": merchantDetails[0].contact_no,
			"city": merchantDetails[0].City,
			"name": merchantDetails[0].shop_name,
			"pin": merchantDetails[0].Pincode,
			"address": merchantDetails[0].address,
			"country": "India",
		}
		let shipments = [{
			"add": customerAddress[0].address,
			"address_type": "home",
			"phone": customerAddress[0].phone,
			"payment_mode": payment_method,
			"name": customerAddress[0].customerName,
			"pin": customerAddress[0].Pincode,
			"order": request_id,
		}]
		
    let jsonDataTemp = {
			pickup_location : pickup_location,
			shipments : [{
				"add": customerAddress[0].address,
				"address_type": "home",
				"phone": customerAddress[0].phone,
				"payment_mode": payment_method,
				"name": customerAddress[0].customerName,
				"pin": customerAddress[0].Pincode,
				"order": request_id,
			}]
		}
		let jsonData = {
			format: "json",
			data: {
				shipments : [{
					"add": customerAddress[0].address,
					"address_type": "home",
					"phone": customerAddress[0].phone,
					"payment_mode": payment_method,
					"name": customerAddress[0].customerName,
					"pin": customerAddress[0].Pincode,
					"order": request_id,
				}],
				pickup_location : pickup_location
			}
		}
    console.log("---",jsonData)
    await axios({
      // method: "POST",
      // uri: `${process.env.DELHIVERY_URL_TEST}api/cmu/create.json`,
      // headers: headers,
			// form: `format=json&data=${jsonData}`
      // json: 
			method: 'post',
			url: `${process.env.DELHIVERY_URL_TEST}api/cmu/create.json`,
			form: jsonData,
			headers: headers
    })
		.then(function (response) {
				console.log(response);
				//logger.info("crder creation :: ",JSON.stringify(response))
					res.status(200).send({
						success: true,
						data: response
					});
					return
			})
				
      
		
		
	}
  catch(e) {
		console.log(e)
    res.status(500).json({
          "success": false,
          "error": e
    })
    return
  }

}

exports.editOrder = async (req,res) => {
	// Keys that can be updated
		// Consignee Name (name)
		// Consignee Address (add)
		// Consignee Phone (phone)
		// Shipment weight (gm)
		// Shipment Length (shipment_length)
		// Shipment Width (shipment_width)
		// Shipment Height (shipment_height)
		// Tax value (tax_value)
		// Sales tax acknowledgment number (stax_ack_number)
		// Commodity value (commodity_value)
		// Product details (product_details)
		// Product category (product_category)
		// Consignee tin (consignee_tin)
		// payment_mode (pt)
		
		// Package Status for which update is allowed
			// Manifested
			// In Transit
			// Pending
			// Scheduled
		// Package Status for which update is not allowed
			// Delivered
			// Dispatched
			// LOST
			// RTO
			// DTO
			// Picked Up
			// Collected
	
  try{
    console.log("create order test");
		
		let iOrder = req.body.iOrder;
		let waybill = req.body.waybill;
		let phone = req.body.phone;
		let customerName = req.body.customerName;
		let address = req.body.address;
		//let request_id = req.body.request_id;
		
		let request_id = Date.now()+iOrder;//delhivery order id
    

		let payment_method = "Prepaid";
		let current_timestamp = Date.now();
		
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Token ${process.env.TOKEN_TEST}`
    }
		
    let jsonDataTemp = {
			"waybill": waybill,
			"phone": phone,
			"name": customerName,
			"add": address
		}
		
    request({
      method: "POST",
      uri: `${process.env.DELHIVERY_URL_TEST}api/p/edit`,
      headers: headers,
      json: jsonDataTemp
    }, async function(error, httpResponse, body) {
      
      if(error){
				console.log(error);
        res.status(500).json({
              "success": false,
              "error": error
        })
        return
      }
      console.log("create Warehouse test response");
      console.log(body);
			if(body.status == "failure"){
				res.status(500).json({
					"success": false,
					"error": body.error
        })
        return
			}
      logger.info("crder edit :: ",JSON.stringify(body))
			res.status(200).send({
				success: true,
				data: body
			});
			return
		})
		
	}
  catch(e) {
		console.log(e)
    res.status(500).json({
          "success": false,
          "error": e
    })
    return
  }

}

exports.trackOrder = async (req,res) => {

  try{
    console.log("track order");
		let waybill = req.query.waybill;
   
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Token ${process.env.TOKEN_TEST}`
    }
		
    let jsonData = {
			"waybill":	waybill
		}
		
    request({
      method: "GET",
      uri: `${process.env.DELHIVERY_URL_TEST}api/v1/packages/json/?waybill=${waybill}`,
      headers: headers,
      json: jsonData
    }, function(error, httpResponse, body) {
      //handle response
			
      if(error){
				console.log(error);
        res.status(500).json({
              "success": false,
              "error": error
        })
        return
      }
      console.log("track order response");
      console.log(body);
      
			res.status(200).send({
				success: true,
				data: body
			});
			return
		})
	}
  catch(e) {
		console.log(e)
    res.status(500).json({
          "success": false,
          "error": e
    })
    return
  }

}

exports.getInvoiceCharge = async (req,res) => {

  try{
    console.log("get invoice charge");
		let weight = req.query.weight;
		let originPincode = req.query.originPincode;
		let destinationPincode = req.query.destinationPincode;
		let shipmentStatus = req.query.shipmentStatus;
   
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Token ${process.env.TOKEN_TEST}`,
			'Accept': "application/json",
    }
		
    let jsonData = {
			md:"E",//by default (modeBilling mode of shipment(E: Express/ S: Surface)(mandatory))
		  cgm:weight,
			o_pin:originPincode,
			ss:shipmentStatus,
			d_pin:destinationPincode
		}
		console.log(jsonData)
    request({
      method: "GET",
      uri: `${process.env.DELHIVERY_URL_TEST}api/kinko/v1/invoice/charges/.json`,
      headers: headers,
      json: jsonData
    }, function(error, httpResponse, body) {
      //handle response
			
      if(error){
				console.log(error);
        res.status(500).json({
					"success": false,
					"error": error
        })
        return
      }
			console.log("get invoice charge response");
      console.log(body);
			if(body.error){
				console.log(error);
        res.status(500).json({
					"success": false,
					"error": body.error
        })
        return
      }
      
      
			res.status(200).send({
				success: true,
				data: body
			});
			return
		})
	}
  catch(e) {
		console.log(e)
    res.status(500).json({
          "success": false,
          "error": e
    })
    return
  }

}

exports.cancelOrder = async (req,res) => {
	const updateProductStatus = (productStatus,orderId) => {
    return new Promise((resolve,reject) =>{
      mysqlCon.query("UPDATE tblorder_items set Product_Status = ? where iOrder = ? and Product_Status = 3",[productStatus,orderId],function(err,result){
        err ? reject(err) : resolve(result);
      })
    })
	}

	const updateShippmentTrack = (orderId) => {
		return new Promise((resolve,reject) =>{
			mysqlCon.query("SELECT ish_Req from tbl_shippment_request where Reference_ID = ?",[orderId],(error,result)=>{
				if(error){
					reject(error);
				}
				else{
					mysqlCon.query("UPDATE tbl_shippment_track set State = 'Cancelled',isCancel = 1 where ish_Req = ?",[result[0].ish_Req],function(err,result){
						err ? reject(err) : resolve(result);
					})
				}
			})
		})
	}
	const updateSubOrderPromise = (data,iOrder) =>{
		return new Promise((resolve, reject) => {
			mysqlCon.query("UPDATE tbl_SubOrder_payment_breakup set ? where iOrder = ? and iProduct_Status = 3",[data,iOrder],(error,result) => {
				error ? reject(error) : resolve(result);
			})
		})
	}

  try{
    console.log("track order");
		let waybill = req.body.waybill;
		let iOrder = req.body.iOrder;
		let cancelType = req.body.cancelType;
   
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Token ${process.env.TOKEN_TEST}`
    }
		
    let jsonData = {
			"waybill":	waybill,
			"cancellation" : true
		}
		
    request({
      method: "POST",
      uri: `${process.env.DELHIVERY_URL_TEST}api/p/edit?waybill=${waybill}`,
      headers: headers,
      json: jsonData
    },async function(error, httpResponse, body) {
      //handle response
			
      if(error){
				console.log(error);
        res.status(500).json({
              "success": false,
              "error": error
        })
        return
      }
      console.log("track order response");
      console.log(body);
			
			let data;
			//cancelType = 1-cancel shipment only, 2-cancel shipment and order
			if(cancelType == 1){
				let Product_Status = 2;
				await updateShippmentTrack(iOrder)
				await updateProductStatus(Product_Status,iOrder)
				data = {
					iProduct_Status : Product_Status,
					CancelledTime : current_time,
					iMerchant : iMerchant,
					iCancelledby : 1
				}
			}
			else{
				let Product_Status = 5;
				await updateShippmentTrack(iOrder)
				await updateProductStatus(Product_Status,iOrder)
				await orderCancelReasonUpdate(cancellation_reason,iOrder,current_time);
				data = {
					iProduct_Status : Product_Status,
					CancelledTime : current_time,
					iMerchant : iMerchant,
					iCancelledby : 1
				}
			}
			await updateSubOrderPromise(data,iOrder)
      
			res.status(200).send({
				success: true,
				data: body
			});
			return
		})
	}
  catch(e) {
		console.log(e)
    res.status(500).json({
          "success": false,
          "error": e
    })
    return
  }

}

exports.pickupRequest = async (req,res) => {

  try{
    console.log("pickup request creation");
		
		let pickupTime = req.body.pickupTime;
		let pickupDate = req.body.pickupDate;
		let pickupLocation = req.body.pickupLocation;
		let packageCount = req.body.packageCount;
   
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Token ${process.env.TOKEN_TEST}`
    }
		
    let jsonData = {
			"pickup_time": pickupTime,
			"pickup_date": pickupDate,
			"pickup_location": pickupLocation,
			"expected_package_count": packageCount
		}
		
    request({
      method: "POST",
      uri: `${process.env.DELHIVERY_URL_TEST}fm/request/new/`,
      headers: headers,
      json: jsonData
    }, function(error, httpResponse, body) {
      //handle response
			
      if(error){
				console.log(error);
        res.status(500).json({
              "success": false,
              "error": error
        })
        return
      }
      console.log("pickup request creation response");
      console.log(body);
      if(body.pr_exist){
				res.status(200).send({
					success: true,
					data: "Pickup request already exist!"
				});
				return
			}
			if(body.pickup_location){
				res.status(200).send({
					success: false,
					data: "Invalid pickup location. Client Warehouse does not exist."
				});
				return
			}
			res.status(200).send({
				success: true,
				data: body
			});
			return
		})
	}
  catch(e) {
		console.log(e)
    res.status(500).json({
          "success": false,
          "error": e
    })
    return
  }

}

exports.createWarehouse = async (req,res) => {
	
  try{
    console.log("create Warehouse test");
		let imid = req.body.imid;
		
		let merchantDetails = await getMerchantDetails(imid);
		console.log(merchantDetails)
   
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Token ${process.env.TOKEN_TEST}`
    }
		
    let jsonData = {
			"phone": merchantDetails[0].contact_no,
			"city": merchantDetails[0].City,
			"name": merchantDetails[0].shop_name,
			"pin": merchantDetails[0].Pincode.toString(),
			"address": merchantDetails[0].address,
			"country": "India",
			"email": merchantDetails[0].contact_email,
			"registered_name": merchantDetails[0].shop_name,
			"return_address": merchantDetails[0].address,
			"return_pin": merchantDetails[0].Pincode.toString(),
			"return_city": merchantDetails[0].City,
			"return_state": merchantDetails[0].State,
			"return_country": "India"
		}
    
    request({
      method: "POST",
      uri: `${process.env.DELHIVERY_URL_TEST}/api/backend/clientwarehouse/create/`,
      headers: headers,
      json: jsonData
    }, function(error, httpResponse, body) {
      
      if(error){
				console.log(error);
        res.status(500).json({
              "success": false,
              "error": error
        })
        return
      }
      console.log("create Warehouse test response");
      console.log(body);
			if(body.error_code.length>0 || body.error.length > 0){
				res.status(500).json({
					"success": false,
					"error": body.error
        })
        return
			}
      logger.info("Ware house creation :: ",JSON.stringify(body))
			res.status(200).send({
				success: true,
				data: body
			});
			return
		})
		
	}
  catch(e) {
    res.status(500).json({
          "success": false,
          "error": e
    })
    return
  }

}

exports.editWarehouse = async (req,res) => {
	
  try{
    console.log("edit Warehouse test");
		let name = req.body.name;
		let registered_name = req.body.registered_name;
		let address = req.body.address;
		let pincode = req.body.pincode;
		let phone = req.body.phone;
	
   
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Token ${process.env.TOKEN_TEST}`
    }
		
    let jsonData = {
			"phone": phone,
			"name": name,
			"pin": pincode,
			"address":address,
			"registered_name": registered_name,
		}
    
    request({
      method: "POST",
      uri: `${process.env.DELHIVERY_URL_TEST}/api/backend/clientwarehouse/edit/`,
      headers: headers,
      json: jsonData
    }, function(error, httpResponse, body) {
      
      if(error){
				console.log(error);
        res.status(500).json({
              "success": false,
              "error": error
        })
        return
      }
      console.log("edit Warehouse test response");
      console.log(body);
			if(!body.success){
				res.status(500).json({
					success: false,
					data: body
        })
        return
			}
      logger.info("Ware house edit :: ",JSON.stringify(body))
			res.status(200).send({
				success: true,
				data: body
			});
			return
		})
		
	}
  catch(e) {
		console.log(e)
    res.status(500).json({
          "success": false,
          "error": e
    })
    return
  }

}

module.exports = exports

// Test credentials:

// Client:                            MINDEEDSURFACE-B2C                                       
// API Token:                       b935e1381f2feb3ebcbb78898adec338640369f6
// Pickup/Warehouse:                 MINDEED SURFACE
