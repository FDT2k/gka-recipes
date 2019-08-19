const path = require('path')
const {validate} = require('parameter-validator')
const uuid = require('uuid/v4');
const fs = require('fs')

exports.v=[]
exports.v[0] =  (cli)=>{
  let {variables} = cli;
  let {safeLog} = cli
  let {package_dir,project_dir} = validate(variables,['package_dir','project_dir']);

  let logfullpath = path.join(package_dir,'package-cache.gka.json')

  safeLog.log('Updating package-cache.gka.json '+logfullpath)

  let tasks = [];

  let cacheContent = {};

  if(!fs.existsSync(logfullpath)){
    tasks.push(
      cli.touch({path:logfullpath,describe:()=>`create initial ${logfullpath}`})
    )
  }else{
    cacheContent = require(logfullpath);
  }

  tasks.push(
    cli.file({path:logfullpath,data:JSON.stringify(cacheContent,null,'\t'),describe:()=>`altering file ${logfullpath} with ${cacheContent}`})
  )
  return tasks;

}
