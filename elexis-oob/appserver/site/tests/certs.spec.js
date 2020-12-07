const chai = require('chai')
chai.should()

const certs = require('../utils/certs')

describe('create self signed certificate', () => {
    it("creates a cert", () => {
        const key=certs({
            cn: "termin.webelexis.invalid",
            l: "CH",
            st: "Zürich",
            l: "Elexikon",
            o: "Webelexis",
            ou: "OOB"
        })
        key.should.be.ok
    }).timeout(5000)
})
