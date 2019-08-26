const path = require('path')
const {validate} = require('parameter-validator')
const uuid = require('uuid/v4');
const fs = require('fs')

exports.v=[]
exports.v[0] =  (context)=>{
  let cli = context();
  let {varStore,log} = cli;



  log.log('setting up jest with babel (es6) ')

  let {package_dir,project_dir,path:dest_path} = validate(varStore(),['package_dir','project_dir','path']);

  let temp_folder = path.join('/tmp',uuid())

  let pathes = {
    files: path.join(__dirname,'files'),
    dest:path.join(package_dir,'package.json'),
  }

  let template = require(path.join(pathes.files,'jest.json'))

  let package_json = require (pathes.dest)

  package_json['jest'] = template;
  package_json['scripts']['test'] = `npm run test:jest`;
  package_json['scripts']['test:jest'] = `npx jest`;
  package_json['scripts']['test:jest:watch'] = `npx jest --watch`;
  package_json['devDependencies'] = Object.assign({},package_json['devDependencies'],require(path.join(pathes.files,'devDeps.json')))

  let newPackage = JSON.stringify(package_json,null,'\t');

  cli.tasks.group([
    cli.tasks.file({
      path:pathes.dest,
      data:newPackage,
      describe:()=>`write ${newPackage.length} bytes to ${pathes.dest}`
    }),
    cli.tasks.copy({
      source:path.join(__dirname,'files','.babelrc'),
      dest: package_dir,
      cwd:project_dir,
      cond:()=>!fs.existsSync(path.join(package_dir,'.babelrc')),
      describe:()=>`copying babelrc into ${package_dir}`,
    })

  ])
  return cli.apply

}
