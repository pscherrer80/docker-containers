/*****************************************
 * This file is part of elexis-oob       *
 * Copyright (c) 2019-2020 by G. Weirich *
 *****************************************/

const express = require("express")
const router = express.Router()
const cfg = new (require("conf"))()
const elxcrypt = require('../utils/elxcrypt')
const { getConnection, exec } = require('../utils/dbutils')
const jobs = require('../utils/jobs')
const log=require('winston')

/**
 * Validate user if
 * - no user is logged in
 * - the path is other than /elexis-* (which is the path to the p2 repositories)
 */
router.get("/*", async (req, res, next) => {
  if (req.session.user || req.path.startsWith("/elexis-") || process.env.NODE_ENV !== 'production') {
    log.info(`Bypassing Login für ${req.session.user} on ${req.path} in mode ${process.env.NODE_ENV}`)
    next()
  } else {
    try {
      const conn = getConnection(true, true)
      const admin = await exec(conn, "select * from user_ where is_administrator='1'")
      if (!req.session.user) {
        req.session.adm = admin
        res.render('login')
      }
    } catch (noadmin) {
      next()
    }
  }
})

/* GET home page. */
router.get("/", async (req, res, next) => {

  const port = cfg.get("dbport") || 3312
  const hostname = req.hostname
  const dbname = cfg.get("dbname") || "elexisoob"
  const username = cfg.get("dbuser") || "(den Namen für die Datenbankverbindung)"
  const password = cfg.get("dbpwd") || "(das Passwort für die Datenbankverbindung)"
  res.render("index", {
    title: "Elexis Out-Of-The-Box",
    hostname,
    port: (process.env.PUBLIC_DBPORT || port),
    dbname,
    username,
    password,
    runningJobs: jobs.listJobs()
  })
})

router.post("/dologin", (req, res, next) => {
  const uname = req.body.username
  const pwd = req.body.password
  const admins = req.session.adm
  for (const adm of admins) {
    if (uname.toLowerCase() === adm.id.toLowerCase()) {
      const crypted = elxcrypt(pwd, adm.salt)
      if (crypted.hashed == adm.hashed_password) {
        req.session.user = adm
        res.redirect("/")
        return
      }
    }
  }
  res.render("login", { error: true })
})

let proc
router.get("/wait/:rum?", (req, res) => {
  if (req.params.rum) {
    proc += 10
    res.json({ status: proc >= 100 ? "finished" : "running", process: proc })
  } else {
    proc = 0
    res.render("wait", { checkurl: "/wait/123", process: 0 })
  }
})
/**
 * Serve the Core repository dir listing and files
 */
router.get("/elexis-core/:dir?/:file", (req, res) => {
  let dname = req.params.dir
  let fname = req.params.file
  const fp = dname ? dname + "/" + fname : fname
  res.sendFile("/home/node/site/public/core-repository/" + fp)
})

/**
 * Serve the Base repository dir listing and files
 */
router.get("/elexis-base/:dir?/:file", (req, res) => {
  let dname = req.params.dir
  let fname = req.params.file
  const fp = dname ? dname + "/" + fname : fname
  res.sendFile("/home/node/site/public/base-repository/" + fp)
})

/**
 * Serve the Ungrad repository dir listing and files
 */
router.get("/elexis-ungrad/:dir?/:file", (req, res) => {
  let dname = req.params.dir
  let fname = req.params.file
  const fp = dname ? dname + "/" + fname : fname
  res.sendFile("/home/node/site/public/ungrad-repository/" + fp)
})

module.exports = router
