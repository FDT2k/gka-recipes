const path = require('path')
const {validate} = require('parameter-validator')
const uuid = require('uuid/v4');
const fs = require('fs')

exports.v=[]
exports.v[0] =  (cli)=>{
  let {variables} = cli;
  let repository = 'https://github.com/FDT2k/gka-ms-entity-store-template.git'
  let tag = 'catalog-v1'

  let {safeLog} = cli

  safeLog.log('creating gka-entity-store from '+repository)

  let {package_dir,project_dir,path:dest_path} = validate(variables,['package_dir','project_dir','path']);
  let temp_folder = path.join('/tmp',uuid())


  return cli.requestInput({name:'microservice',message:'what is your microservice name ?',initial:cli.removePathPrefix(dest_path)}).run()
    .then (answer=>{

      return cli.tasks([
        cli.git.clone({
          url:repository,
          dest:temp_folder,
          cwd:project_dir,
          describe:()=>`[${project_dir}]: ${repository} into ${temp_folder} `
        }),
        cli.git.checkout_tag({
          tag,
          cwd:temp_folder,
          describe:()=> `[${temp_folder}]: checking out tags/${tag} `
        }),
        cli.remove_folder({
          path:path.join(temp_folder,'.git'),
          describe:()=>`[${temp_folder}]: removing ${temp_folder}/.git`
        }),
        cli.copy({
          source:temp_folder,
          dest: package_dir,
          cwd:project_dir,
          describe:()=>`[${project_dir}]: copying ${temp_folder} to ${package_dir}`,
          cond:()=>!fs.existsSync(package_dir)
        }),
        cli.remove_folder({
          path:path.join(temp_folder,'.git'),
          describe:()=>`[${temp_folder}]: removing ${temp_folder}`
        })
      ])
    })



}
