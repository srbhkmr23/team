import fs from 'fs';
let db = JSON.parse(fs.readFileSync(process.cwd() + './config/dbCredential.json'));
db.port = process.env.DB_PORT || db.port;
db.host = process.env.DB_HOST || db.host;
db.user = process.env.DB_USER || db.user;
db.pass = process.env.DB_PASS || db.pass;
db.schema = process.env.DB_SCHEMA || db.schema;
export default db;
