'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _pg = require('pg');

var _pg2 = _interopRequireDefault(_pg);

var _genericPool = require('generic-pool');

var _genericPool2 = _interopRequireDefault(_genericPool);

var _dbCredential = require('../config/dbCredential');

var _dbCredential2 = _interopRequireDefault(_dbCredential);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require('pg-parse-float')(_pg2.default);

var dbconnection = { connectionpool: null };
var MAX_POOL_SIZE = 10;
var MIN_POOL_SIZE = 2;

var pgConString = "postgres://".concat(_dbCredential2.default.user, ":", _dbCredential2.default.pass, "@", _dbCredential2.default.host, ":", _dbCredential2.default.port, "/", _dbCredential2.default.schema);
var factory = {
    create: function create() {
        var c = new _pg2.default.Client(pgConString);
        return new Promise(function (resolve, reject) {
            c.connect(function (err, client) {
                if (err) {
                    console.log("Error in connecting to the database: " + err);
                    reject(err);
                } else {
                    resolve(client);
                }
            });
        });
    },
    destroy: function destroy(client) {
        if (client) client.end();
    }
};

var opts = {
    max: MAX_POOL_SIZE, // maximum size of the pool
    min: MIN_POOL_SIZE // minimum size of the pool
};
var pool = _genericPool2.default.createPool(factory, opts);

dbconnection.createConnection = function (callback) {
    var resourcePromise = pool.acquire();
    resourcePromise.then(function (connection) {
        callback(undefined, connection);
    }).catch(function (err) {
        callback(err, undefined);
        // handle error - this is generally a timeout or maxWaitingClients
        // error
    });
};

dbconnection.closeConnection = function (connection) {
    if (connection !== null) pool.release(connection);
};

dbconnection.end = function () {
    if (pool !== null) pool.drain(function () {
        pool.destroyAllNow();
    });
};

exports.default = dbconnection;