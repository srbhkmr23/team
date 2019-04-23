'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _dbConnection = require('../db/dbConnection');

var _dbConnection2 = _interopRequireDefault(_dbConnection);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var chatModel = {}; // import connectionModel from '../core/connection';
// import responseModel from '../core/response';
// import config from  '../core/config';


chatModel.addMessageInDb = function (data) {
	_dbConnection2.default.createConnection(function (error, connection) {
		var message_from = data.from;
		var message_to = data.to;
		var identifier = chatModel.getIdentifier(message_from, message_to);
		var query = 'INSERT INTO t_total_message (identifier, total_message) VALUES (\'' + identifier + '\',  1) ON CONFLICT (identifier) DO UPDATE SET total_message = t_total_message.total_message + 1 RETURNING t_total_message.total_message;';
		try {
			connection.query(query, [], function (err, res) {
				if (err) {
					console.log(err);
					_dbConnection2.default.closeConnection(connection);
					return;
				} else {
					try {
						var message_number = res.rows[0]['total_message'];
						var message = data.msg;
						var seen = data.seen;
						var messageQuery = 'INSERT INTO t_message (identifier,message_number, message, message_from,message_to, message_send_time, seen, active) VALUES (\'' + identifier + '\',' + message_number + ',$1, \'' + message_from + '\',\'' + message_to + '\',NOW(),' + seen + ',TRUE);';
						connection.query(messageQuery, [message], function (err, res) {
							if (err) {
								console.log(err);
							} else {
								// console.log("successfully inserted message.")
							}
							_dbConnection2.default.closeConnection(connection);
						});
					} catch (errData) {
						console.log(errData);
					}
				}
			});
		} catch (errData) {
			console.log(errData);
		}
	});
};

chatModel.getAllMessage = function (data, cb) {
	_dbConnection2.default.createConnection(function (error, connection) {
		var message_from = data.from;
		var message_to = data.to;
		var identifier = chatModel.getIdentifier(message_from, message_to);
		var query = 'SELECT * FROM t_message WHERE identifier = \'' + identifier + '\' AND active = TRUE ORDER BY message_number ASC;';
		try {
			connection.query(query, [], function (err, res) {
				if (err) {
					console.log(err);
					_dbConnection2.default.closeConnection(connection);
				} else {
					_dbConnection2.default.closeConnection(connection);
					cb(res.rows);
				}
			});
		} catch (errData) {
			console.log(errData);
		}
	});
};

chatModel.getAllMessageNotifications = function (data, cb) {
	_dbConnection2.default.createConnection(function (error, connection) {
		// let message_from = data.from;
		var message_to = data.to;
		// let identifier = chatModel.getIdentifier(message_from,message_to);
		var query = 'SELECT * FROM t_message WHERE message_to = ' + message_to + ' AND (active = TRUE) AND (seen = FALSE);';
		try {
			connection.query(query, [], function (err, res) {
				if (err) {
					console.log(err);
					_dbConnection2.default.closeConnection(connection);
				} else {
					_dbConnection2.default.closeConnection(connection);
					cb(res.rows);
				}
			});
		} catch (errData) {
			console.log(errData);
		}
	});
};

chatModel.setMessageSeenByUser = function (data, cb) {
	_dbConnection2.default.createConnection(function (error, connection) {
		var message_from = data.from;
		var message_to = data.to;
		var identifier = chatModel.getIdentifier(message_from, message_to);
		var query = 'UPDATE t_message SET seen = TRUE  WHERE identifier = \'' + identifier + '\' AND  message_from = ' + message_from + ' AND message_to = ' + message_to + ' AND (seen = FALSE);';
		try {
			connection.query(query, [], function (err, res) {
				if (err) {
					console.log(err);
					_dbConnection2.default.closeConnection(connection);
				} else {
					_dbConnection2.default.closeConnection(connection);
					cb(res.rows);
				}
			});
		} catch (errData) {
			console.log(errData);
		}
	});
};

chatModel.getIdentifier = function (user1, user2) {
	var identifier = "";
	if (user1 < user2) {
		identifier = user1 + ':' + user2;
	} else {
		identifier = user2 + ':' + user1;
	}
	return identifier;
};

exports.default = chatModel;