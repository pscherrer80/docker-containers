/****************************************
 * This file is part of elexis-oob      *
 * Copyright (c) 2019 by G. Weirich     *
 ****************************************/

const cfg = new (require("conf"))()
const fs = require("fs")

/**
 * Create initial config for Webelexis
 */
const initWebelexis = () => {
  const defaults = require('../utils/wlxdefaults')
  defaults.testing = false,
    defaults.sitename = (cfg.get("sitename") || "Praxis Webelexis"),
    defaults.mandators = {
      default: {
        name: cfg.get("title") + " " + cfg.get("firstname") + " " + cfg.get("lastname"),
        subtitle: "Facharzt für Webelexik",
        street: cfg.get("street"),
        place: cfg.get("place"),
        phone: cfg.get("phone"),
        email: cfg.get("email"),
        zsr: cfg.get("zsr"),
        gln: cfg.get("gln")
      }
    },
    defaults.docbase = "../data/sample-docbase",
    defaults.elexisdb = {
      host: "elexisdb",
      database: cfg.get("dbname"),
      user: cfg.get("dbuser"),
      password: cfg.get("dbpwd"),
      port: cfg.get("dbport"),
    },
    defaults.lucinda = {
      url: "http://localhost:9997/lucinda/3.0"
    },
    defaults.agenda = {
      resources: ["Arzt", "MPA"],
      daydefaults: `FS1~#<ASa=A0000-0900
  1200-2359~#<ADo=A0000-0800
  1200-1300
  1700-2359~#<AFr=A0000-0800
  1200-1300
  1700-2359~#<AMi=A0000-0800
  1300-2359~#<ADi=A0000-0900
  1300-1400
  1800-2359~#<AMo=A0000-0800
  1200-1300
  1700-2359~#<ASo=A0000-2359`,
      termintypdefaults: ["Frei", "Reserviert", "Normal"],
      terminstatedefaults: ["-", "geplant", "eingetroffen", "fertig", "abgesagt"],
      typcolordefaults: {
        Reserviert: "000000",
        Frei: "80ff80",
        Normal: "ff8040"
      },
      statecolordefaults: {
        geplant: "ff8000",
        eingetroffen: "ff0000",
        fertig: "008000",
        abgesagt: "e5e5e5"
      },
      timedefaults: {
        Reserviert: 30,
        Frei: 30,
        Normal: 30
      }
    },
    /**
     * Settings for the self-service scheduling
     */
    defaults.schedule = {
      minDuration: 30,
      terminTyp: "Internet",
      resource: "Arzt",
      maxPerDay: 4,
      sitename: (cfg.get("sitename") || "Praxis Webelexis"),
      siteaddr: cfg.get("street") + ", " + cfg.get("place"),
      sitephone: cfg.get("phone"),
      sitemail: cfg.get("email")
    },
    /**
     * Preset for Fall settings
     */

    defaults.fall = {
      "fallgesetz": "KVG",
      "fallgrund": "Krankheit",
      "fallbezeichnung": "Allg.",
    }

  const str = "module.exports=" + JSON.stringify(defaults)
  try {
    fs.writeFileSync("/mnt/webelexisdata/settings.js", str)
    fs.mkdirSync("/mnt/webelexisdata/sample-docbase")
  } catch (err) {
    console.log(str)
  }
}

module.exports = initWebelexis
