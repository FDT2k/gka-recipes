const path = require('path')
const {validate} = require('parameter-validator')
const uuid = require('uuid/v4');
const fs = require('fs')

exports.v=[]
exports.v[0] =  (context)=>{
  let cli = context();
  let {varStore,log} = cli;

  let repository = 'https://github.com/FDT2k/gka-ms-entity-store-template.git'
  let tag = 'catalog-v1'


  log.log('creating gka-entity-store from '+repository)

  let {package_dir,project_dir,path:dest_path} = validate(varStore(),['package_dir','project_dir','path']);
  let temp_folder = path.join('/tmp',uuid())


  /*return cli.requestInput({name:'microservice',message:'what is your microservice name ?',initial:cli.removePathPrefix(dest_path)}).run()
    .then (answer=>{*/
      return cli.tasks.group([
        cli.tasks.git_clone({
          url:repository,
          dest:temp_folder,
          cwd:project_dir,
          cond:()=>!fs.existsSync(package_dir),
          describe:()=>`git clone ${repository} into ${temp_folder} cwd: ${project_dir}`
        }),
        cli.tasks.git_checkout_tag({
          tag,
          cwd:temp_folder,
          cond:()=>!fs.existsSync(package_dir),
          describe:()=> `checking out tags/${tag} cwd:${temp_folder}`
        }),
        cli.tasks.remove_folder({
          path:path.join(temp_folder,'.git'),
          cond:()=>!fs.existsSync(package_dir),
          describe:()=>`removing ${temp_folder}/.git cwd:${temp_folder}`
        }),
        cli.tasks.copy({
          source:temp_folder,
          dest: package_dir,
          cwd:project_dir,
          cond:()=>!fs.existsSync(package_dir),
          describe:()=>`copying ${temp_folder} to ${package_dir} cwd: ${project_dir}`,
        }),
        cli.tasks.remove_folder({
          path:path.join(temp_folder,'.git'),
          cond:()=>!fs.existsSync(package_dir),
          describe:()=>`removing ${temp_folder} cwd: ${temp_folder}`
        })
      ])
    //})
}
