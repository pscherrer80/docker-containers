const chai = require('chai')
chai.should()
const jobs=require('../utils/jobs')

describe("jobs interface",()=>{
  it("creates a job",()=>{
    jobs.addJob("eins",100)
    const list=jobs.listJobs()
    list.eins.should.equal(100)
  }) 
  it("creates and deletes a job",()=>{
    jobs.addJob("zwei",50)
    jobs.listJobs().zwei.should.equal(50)
    jobs.removeJob("zwei")
    jobs.listJobs().should.not.have.property("zwei")
  })
  it("creates and modifies a job",()=>{
    jobs.addJob("drei",10)
    jobs.listJobs().drei.should.equal(10)
    jobs.updateJob("drei",8)
    jobs.listJobs().drei.should.equal(2)
    jobs.updateJob("drei",5)
    jobs.listJobs().should.not.have.property("drei")
  })
})