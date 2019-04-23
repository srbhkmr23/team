'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var db = JSON.parse(_fs2.default.readFileSync(process.cwd() + './config/dbCredential.json'));
db.port = process.env.DB_PORT || db.port;
db.host = process.env.DB_HOST || db.host;
db.user = process.env.DB_USER || db.user;
db.pass = process.env.DB_PASS || db.pass;
db.schema = process.env.DB_SCHEMA || db.schema;
exports.default = db;