import fs from 'fs';
import pg from 'pg';
import generic_pool from 'generic-pool';
import dbCred from '../config/dbCredential';
require('pg-parse-float')(pg);

let dbconnection = { connectionpool: null };
const MAX_POOL_SIZE = 10;
const MIN_POOL_SIZE = 2;

let pgConString = "postgres://".concat(dbCred.user, ":", dbCred.pass, "@", dbCred.host, ":", dbCred.port, "/", dbCred.schema);
const factory = {
  create: () => {
        var c = new pg.Client(pgConString);
        return new Promise((resolve, reject) =>{
            c.connect((err, client) => {
                if (err) {
                    console.log("Error in connecting to the database: " + err);
                    reject(err)
                }
                else {
                    resolve(client)
                }
            });
        });
    },
    destroy: (client) => {
        if (client)
            client.end();
    }
};
 
const opts = {
  max: MAX_POOL_SIZE, // maximum size of the pool
  min: MIN_POOL_SIZE // minimum size of the pool
};
const pool = generic_pool.createPool(factory, opts);



dbconnection.createConnection = (callback) => {
    const resourcePromise = pool.acquire();
    resourcePromise.then((connection)=> {
        callback(undefined, connection);
    })
    .catch((err)=> {
        callback(err, undefined);
        // handle error - this is generally a timeout or maxWaitingClients
        // error
    });
};

dbconnection.closeConnection = (connection) => {
    if (connection !== null)
        pool.release(connection);
};

dbconnection.end = () => {
    if (pool !== null)
        pool.drain(() => {
            pool.destroyAllNow();
        });
};

export default dbconnection;
