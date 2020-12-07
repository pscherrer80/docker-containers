const chai = require('chai')
chai.should()
const encrypt=require('../utils/elxcrypt')

describe("elxcrypt", () => {
    it ("creates a hash from a text and a salt",()=>{
        const {hashed,salt}=encrypt('administrator','1254bb9a05856b9e')
        hashed.should.equal('b94a0b6fc7be97e0a1585ac85e814d3852668968')
        salt.should.equal('1254bb9a05856b9e')
    })
})