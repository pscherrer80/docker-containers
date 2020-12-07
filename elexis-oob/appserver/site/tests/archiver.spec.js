const chai = require('chai')
chai.should()
const fs = require('fs')
const path = require('path')
const rimraf = require('rimraf')
const archiver = require('../utils/archiver')
const winston = require('winston')
winston.level = "debug"
winston.add(new winston.transports.Console({
    format: new winston.format.simple()
}))

const testdir = path.join(__dirname, "output")
const delay = ms => {
    return new Promise((resolve) => {
        setTimeout(resolve, ms)
    })
}

before(done => {
    rimraf(testdir, err => {
        if (err) {
            console.log(err)
        }
        fs.mkdir(testdir, err => {
            done()
        })

    })
    rimraf(path.join(__dirname, "doc"), err => {
        if (err) {
            console.log(err)
        }
    })
})

describe("single pack", () => {
    it("creates a backup of this directory", async () => {
        const tosave = path.join(__dirname, "../public/doc")
        const arc = new archiver(testdir, 3)
        const result = await arc.pack(tosave, "2019-01-01-1200")
        result.should.be.true
    })

    it("cleans up backups", async () => {
        fs.writeFileSync(testdir + "/doc_2010-01-01-2000.tar.gz", "Blabla")
        fs.writeFileSync(testdir + "/doc_2011-01-01-2000.tar.gz", "blabla")
        fs.writeFileSync(testdir + "/doc_2010-01-01-1955.tar.gz", "blurb")
        const bef = fs.existsSync(testdir + "/doc_2010-01-01-1955.tar.gz")
        bef.should.be.true
        const tosave = path.join(__dirname, "../public/doc")
        const arc = new archiver(testdir, 3)
        const result = await arc.pack(tosave, "2019-01-01-1200")
        await delay(10)
        fs.existsSync(testdir + "/doc_2010-01-01-1955.tar.gz").should.be.false
        fs.readdirSync(testdir).length.should.equal(3)
    })

    it("lists remaining files", async () => {
        fs.writeFileSync(testdir + "/bla_2010-01-01-2000.tar.gz", "Blabla")
        fs.writeFileSync(testdir + "/bli_2011-01-01-2000.tar.gz", "blabla")
        fs.writeFileSync(testdir + "/bli_2010-01-01-1955.tar.gz", "blurb")
        const arc = new archiver(testdir, 3)
        const files = await arc.list_files()
        files.length.should.equal(6)
    })

    it("returns all backup dates", async () => {
        const arc = new archiver(testdir, 3)
        const dates = await arc.list_dates()
        dates.length.should.equal(4)
    })

    it("restores from the latest backup", async () => {
        fs.mkdirSync(path.join(__dirname, "doc"))
        const arc = new archiver(testdir)
        await arc.restore(path.join(__dirname, "doc"), "2019-01-01-1200")
        await arc.restore(path.join(__dirname,"doc"), "does-not-exist")
    })
})

