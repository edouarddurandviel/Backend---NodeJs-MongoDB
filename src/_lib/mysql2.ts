import mysql, { ConnectionOptions } from "mysql2/promise";
// import config from "../_config/mongoDb";
// const uri = config.uri || "http//localhost:27017";
// const dbName = config.db || "test";

let mysqlClient: any;
let pool: any;

export const connectToDatabase = async () => {
  if (mysqlClient) return;

  const access: ConnectionOptions = {
    host: "localhost",
    user: "root",
    database: "test"
  };

  mysqlClient = await mysql.createConnection(access);

  return mysqlClient;
};

export const poolConnection = async () => {
  if (pool) return;

  pool = await mysql.createPool({
    host: "localhost",
    user: "root",
    database: "test",
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 10,
    idleTimeout: 60000,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
  });

  return pool;
};

export const getConnection = async (query: string, bindParams: any[]) => {
  // For pool initialization, see above
  const conn = await pool.getConnection();

  return async () => {
    // Do something with the connection
    await conn.query(query, bindParams);
    // Don't forget to release the connection when finished!
    pool.releaseConnection(conn);
  };
};

export const connectionEnd = async () => {
  if (mysqlClient) {
    await mysqlClient.end();
  }
};

export const dbase = async () => {
  return mysqlClient;
};
