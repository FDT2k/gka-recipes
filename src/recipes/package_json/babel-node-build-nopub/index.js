const path = require('path')
const {validate} = require('parameter-validator')
const uuid = require('uuid/v4');
const fs = require('fs')

exports.v=[]
exports.v[0] =  (context)=>{
  let cli = context();
  let {varStore,log} = cli;



  log.log('setting up build with babel (es6) ')

  let {package_dir,project_dir,path:dest_path,node} = validate(varStore(),['package_dir','project_dir','path',['node']]);

  let temp_folder = path.join('/tmp',uuid())

  let pathes = {
    files: path.join(__dirname,'files'),
    dest:path.join(package_dir,'package.json'),
  }

  let dist_folder = 'lib';

  console.log(node)
  if( typeof node !== 'undefined' && typeof node.dist_folder_name != 'undefined')
    dist_folder= node.dist_folder_name;

  let package_json = require (pathes.dest)
  if(typeof package_json['scripts'] == 'undefined')
    package_json['scripts']={};

  package_json['scripts']['start'] = `npx nodemon node_modules/@babel/node/bin/babel-node.js src/index.js`
  package_json['scripts']['distclean'] = `rm -rf ./${dist_folder}`
  package_json['scripts']['build'] = `npm run test && node_modules/@babel/cli/bin/babel.js --out-dir ${dist_folder} ./src && cp package.json ./${dist_folder}`
  package_json['scripts']['build:clean'] = `npm run distclean; npm run build`
  package_json['scripts']['pub'] =  `cd ./${dist_folder}; npm publish; cd ..`
  package_json['scripts']['build:pub'] = `npm run build && npm run pub`
  package_json['scripts']['build:patch:pub'] =`npm run build && npm version patch && npm run pub`
  package_json['scripts']['build:minor:pub'] =`npm run build && npm version minor && npm run pub`
  package_json['scripts']['build:major:pub'] =`npm run build && npm version major && npm run pub`

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
