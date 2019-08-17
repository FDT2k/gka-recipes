const path = require('path')
const {validate} = require('parameter-validator')
exports.v1 = {}
exports.v1.run = (cli)=>(vars)=>{
  let {safeLog: logger, safeColor: color} = cli

  logger.log(color.red('Adding docker image building scripts to package.json'))

  let {registry,registry_key,docker_path,script_key,package_dir} = validate(vars,['registry','registry_key','docker_path','script_key','package_dir']);

  let template = `npm run build && docker build -t ${registry}/${registry_key} ${docker_path}; docker push ${registry}/${registry_key}; `


  let package = require (path.join(package_dir,'package.json'))

  package.scripts[script_key] = template;
  let newPackage = JSON.stringify(package,null,'\t');
  return cli.file(path.join(package_dir,'package.json'),newPackage);
}
