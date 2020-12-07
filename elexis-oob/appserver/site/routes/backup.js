/****************************************
 * This file is part of elexis-oob      *
 * Copyright (c) 2019 by G. Weirich     *
 ****************************************/
const express = require("express")
const router = express.Router()
const archiver = require('../utils/archiver')
const log = require('winston')
const { DateTime } = require('luxon')


const backupdir = process.env.NODE_ENV==='production' ? "/backup" : "./tests/output"
const dirs = process.env.NODE_ENV==='production' ? ["/mnt/elexisdb", "/mnt/lucindadata", "/mnt/lucindabase", "/mnt/webelexisdata", "/mnt/pacsdata"] : ['./tests/doc','./tests/doc','./tests/doc','./tests/doc','./tests/doc']
log.info("Backup module running in mode "+process.env.NODE_ENV)

/**
 * backup management routes (/backup/..)
 */
router.get("/settings", (req, res) => {
  res.render("backup")
})

/**
 * Depending which button the user pressed, a backup schedule is created or an immediate
 * Backup is performed
 */
router.post("/exec", async (req, res) => {
  const archie = new archiver(backupdir, parseInt(req.body.numbackups))
  if (req.body.button == "setup") {
    const rule = req.body.minute + " " + req.body.hour + " " + req.body.day + " " + req.body.month + " " + req.body.weekday
    try {
      const ni = archie.schedule(rule, dirs)
      res.render('success', { header: "Backup konfiguriert", body: "Nächste Ausführung: " + ni.toString() })
    } catch (err) {
      res.render("error", { message: "Fehler beim Einrichten", error: err })
    }
  } else {
    try {
      const now = DateTime.local()
      const suffix = now.toFormat("yyyy-LL-dd-HHmm")
      for (const dir of dirs) {
        log.info("backing up " + dir)
        await archie.pack(dir, suffix)
      }
      res.render('success', { header: "Backup ausgeführt", body: "Keine Fehler" })

    } catch (err) {
      res.render("error", { message: "Fehler beim Backup", error: err })

    }
  }
})

router.get("/restore", async (req, res) => {
  const archie = new archiver(backupdir)
  const dates = await archie.list_dates()
  res.render("restore_form", { dates })
})

router.get("/restore/:idx", async (req, res) => {
  const archie = new archiver(backupdir)
  const dates = await archie.list_dates()
  const index = req.params.idx
  res.render("restore_verify", { date: dates[index], index })
})

router.get("/restore/confirm/:idx", async (req, res) => {
  const archie = new archiver(backupdir)
  const dates = await archie.list_dates()
  const index = req.params.idx
  const date = dates[index]
  const suffix = DateTime.fromFormat(date, "dd.LL.yyyy, HH:mm").toFormat("yyyy-LL-dd-HHmm")
  try {
    for (const dir of dirs) {
      await archie.restore(dir, suffix)
    }
    res.render('success', { header: "restore ausgeführt", body: "Sie sollten elexis.oob jetzt neu starten" })
  } catch (err) {
    res.render('error', { message: "Fehler beim Restore", error: err })
  }
})

module.exports = router