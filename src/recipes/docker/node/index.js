const path = require('path')
const {validate} = require('parameter-validator')
const fs = require('fs')

const DPJ = require ('../../package_json/docker')
exports.v=[]
exports.v[0] =  (cli)=>{
  let {varStore} = cli;
  let {log} = cli
  let {package_dir,project_dir,path:dest_path} = validate(varStore(),['package_dir','project_dir','path']);

  log.log('Copying docker template to'+package_dir)

  let {extended} = varStore();

  const paths = {
    source: path.join(__dirname,'files','node-prod'),
    dest: path.join(package_dir,'docker')
  }

  return cli.tasks.group([
    cli.tasks.mkdir({
      dest:paths.dest,
      cond:()=>!fs.existsSync(paths.dest),
      describe:()=>`creating ${paths.dest} cwd: ${project_dir}`,
    }),
    cli.tasks.copy({
      source:paths.source,
      dest:paths.dest,
      cwd:package_dir,
      describe:()=>`copying ${paths.source} to ${paths.dest} cwd: ${project_dir}`,
    })
  ])

}
