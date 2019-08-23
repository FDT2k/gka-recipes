const path = require('path')
const {validate} = require('parameter-validator')

exports.v=[]
exports.v[0] =  (context)=>{
  let cli = context();
  let {log,varStore} = cli

  log.log('Adding docker image building scripts to package.json')

  let {registry,registry_key,package_dir,docker_path,script_key} = validate(varStore(),['registry','registry_key','package_dir','docker_path','script_key']);

  let template = `npm run build && docker build -t ${registry}/${registry_key} ${docker_path}; docker push ${registry}/${registry_key}; `

  let pathes = {
    dest:path.join(package_dir,'package.json'),
  }

  let package_json = require (pathes.dest)

  package_json.scripts[script_key] = template;

  let newPackage = JSON.stringify(package_json,null,'\t');

  cli.tasks.file({
    path:pathes.dest,
    data:newPackage,
    describe:()=>`write ${$dest}`
  });
  console.log(cli)
  return cli.apply
}
