const path = require('path')
const {validate} = require('parameter-validator')

exports.v=[]
exports.v[0] =  (cli)=>{

  let {log,variables} = cli


  logger.log('Adding docker image building scripts to package.json')

  let {registry,registry_key,docker_path,package_dir} = validate(vars,['registry','registry_key','package_dir']);

  let template = `npm run build && docker build -t ${registry}/${registry_key} ${docker_path}; docker push ${registry}/${registry_key}; `

  let pathes = {
    dest:path.join(package_dir,'package.json'),
  }

  let package_json = require (pathes)

  package.scripts[script_key] = template;

  let newPackage = JSON.stringify(package,null,'\t');

  return cli.tasks.file({
    path:dest,
    data:newPackage,
    describe:()=>`write ${$dest}`
  });
}
