// import connectionModel from '../core/connection';
// import responseModel from '../core/response';
// import config from  '../core/config';
import dbconnection from '../db/dbConnection'
let chatModel = {};

chatModel.addMessageInDb = (data) => {
	dbconnection.createConnection((error,connection)=>{
	 let message_from = data.from;
	 let message_to = data.to;
	 let identifier = chatModel.getIdentifier(message_from,message_to);
	 let query = `INSERT INTO t_total_message (identifier, total_message) VALUES ('${identifier}',  1) ON CONFLICT (identifier) DO UPDATE SET total_message = t_total_message.total_message + 1 RETURNING t_total_message.total_message;`;
	 try{
	    connection.query(query, [], (err, res) =>{
	      if(err){
	      	console.log(err)
	      	dbconnection.closeConnection(connection)
	      	return;
	      }
	      else{
	      	try{
	      		let message_number=res.rows[0]['total_message'] ;
				let message=data.msg;
				let seen = data.seen;
		      	let messageQuery=`INSERT INTO t_message (identifier,message_number, message, message_from,message_to, message_send_time, seen, active) VALUES ('${identifier}',${message_number},$1, '${message_from}','${message_to}',NOW(),${seen},TRUE);`;
		   	  	connection.query(messageQuery, [message], (err, res) =>{
			   	  	if(err){
				      	console.log(err)
				    }
				    else{
				    	// console.log("successfully inserted message.")
				    }
				    dbconnection.closeConnection(connection) 
			    })
	      	}
	      	catch(errData){
	      		console.log(errData)
	      	}
		  }  
		});
	 }
	 catch(errData) {
	 	console.log(errData)
	 }
	 
	})
}


chatModel.getAllMessage = (data,cb) =>{
	dbconnection.createConnection((error,connection)=>{
		let message_from = data.from;
	 	let message_to = data.to;
	 	let identifier = chatModel.getIdentifier(message_from,message_to);
		let query = `SELECT * FROM t_message WHERE identifier = '${identifier}' AND active = TRUE ORDER BY message_number ASC;`;
		try{
		    connection.query(query, [], (err, res) =>{
		      if(err){
		      	console.log(err)
		      	dbconnection.closeConnection(connection);
		      }
		      else{
		      	dbconnection.closeConnection(connection);
		      	cb(res.rows)
		      }
		    })
		}
		catch(errData) {
	 		console.log(errData)
	 	}
	})
}

chatModel.getAllMessageNotifications = (data,cb) =>{
	dbconnection.createConnection((error,connection)=>{
		// let message_from = data.from;
	 	let message_to = data.to;
	 	// let identifier = chatModel.getIdentifier(message_from,message_to);
		let query = `SELECT * FROM t_message WHERE message_to = ${message_to} AND (active = TRUE) AND (seen = FALSE);`;
		try{
		    connection.query(query, [], (err, res) =>{
		      if(err){
		      	console.log(err)
		      	dbconnection.closeConnection(connection);
		      }
		      else{
		      	dbconnection.closeConnection(connection);
		      	cb(res.rows)
		      }
		    })
		}
		catch(errData) {
	 		console.log(errData)
	 	}
	})
}

chatModel.setMessageSeenByUser = (data,cb) =>{
	dbconnection.createConnection((error,connection)=>{
		let message_from = data.from;
	 	let message_to = data.to;
		let identifier = chatModel.getIdentifier(message_from,message_to);
		let query = `UPDATE t_message SET seen = TRUE  WHERE identifier = '${identifier}' AND  message_from = ${message_from} AND message_to = ${message_to} AND (seen = FALSE);`;
		try{
		    connection.query(query, [], (err, res) =>{
		      if(err){
		      	console.log(err)
		      	dbconnection.closeConnection(connection);
		      }
		      else{
		      	dbconnection.closeConnection(connection);
		      	cb(res.rows)
		      }
		    })
		}
		catch(errData) {
	 		console.log(errData)
	 	}
	})
}

chatModel.getIdentifier = (user1,user2)=>{
	let identifier="";
	if(user1<user2){
		identifier = `${user1}:${user2}`
	}
	else {
		identifier = `${user2}:${user1}`
	}
	return identifier;
}

export default chatModel;

