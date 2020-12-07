/****************************************
 * This file is part of elexis-oob      *
 * Copyright (c) 2019 by G. Weirich     *
 ****************************************/

const logger = require("winston")
const cfg = new (require("conf"))()
const mysql = require("mysql")

if (!cfg.get("dbport")) {
  cfg.set("dbport", (process.env.DBPORT || 3312))
}

if (!cfg.get("dbhost")) {
  cfg.set("dbhost", (process.env.DBHOST || "localhost"))
}

if (!cfg.get("dbname")) {
  cfg.set("dbname", (process.env.DBNAME || "elexisoob"))
}

if (!cfg.get("dbuser")) {
  cfg.set("dbuser", (process.env.DBUSER || "root"))
}

if (!cfg.get("dbpwd")) {
  cfg.set("dbpwd", (process.env.DBPWD || "elexisadmin"))
}

if (!cfg.get("dbrootpwd")) {
  cfg.set("dbrootpwd", (process.env.DB_ROOT_PWD || "elexisadmin"))
}

const getConnection = (asRoot, withDB) => {
  const options = {
    host: cfg.get("dbhost"),
    user: (asRoot ? "root" : cfg.get("dbuser")),
    port: cfg.get("dbport"),
    password: (asRoot ? cfg.get("dbrootpwd") : cfg.get("dbpwd"))
  }
  if (withDB) {
    options.database = cfg.get("dbname")
  }
  return mysql.createConnection(options)
}

const exec = (connection, sql) => {
  return new Promise((resolve, reject) => {
    connection.query(sql, (err, resp, fields) => {
      if (err) {
        reject(err)
      }
      resolve(resp)
    })
  })
}
const fetch = () => { }

module.exports = { getConnection, exec }
