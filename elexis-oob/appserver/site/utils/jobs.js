let jobs={}

const addJob=(name,totalWork)=>{
    if(jobs[name]){
        return false
    }
    jobs[name]=totalWork
    return true;
}

const updateJob=(name,workDone)=>{
    if(jobs[name]){
        jobs[name]-=workDone;
        if(jobs[name]<=0){
            delete jobs[name]
            return 0
        }else{
            return jobs[name]
        }
    }else{
        return -1
    }
}

const removeJob=(name)=>{
    delete jobs[name]
}

const listJobs=()=>{
    return jobs
}

module.exports={addJob, updateJob, removeJob, listJobs}