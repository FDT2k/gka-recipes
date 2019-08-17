const path = require('path')
const {validate} = require('parameter-validator')


exports.v1 = {}
exports.v1.run = (cli)=>(vars)=>{

  let {safeLog} = cli

  safeLog.log('Generating SRR Dockerfiles for React frontend')

  let {package_dir} = validate(vars,['package_dir']);
  
  let tasks = [
    cli.folder(path.resolve('./files/docker'))(path.join(package_dir,'docker','SSR')),
    cli.copy(path.resolve('~/.npmrc'))(path.join(package_dir,'docker','SSR','npmrc'))
  ]

  return cli.tasks(tasks)

}
