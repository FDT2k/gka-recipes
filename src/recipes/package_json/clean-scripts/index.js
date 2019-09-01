const path = require('path')
const {validate} = require('parameter-validator')
const uuid = require('uuid/v4');
const fs = require('fs')

exports.v=[]
exports.v[0] =  (context)=>{
  let cli = context();
  let {varStore,log} = cli;



  log.log('Cleaning up scripts in package.json')

  let {package_dir,project_dir,path:dest_path} = validate(varStore(),['package_dir','project_dir','path']);

  let temp_folder = path.join('/tmp',uuid())

  let pathes = {
    files: path.join(__dirname,'files'),
    dest:path.join(package_dir,'package.json'),
  }
/*
  let preserve_list = [];

  console.log(npm)
  if( typeof npm !== 'undefined' && typeof npm.preserve_scripts != 'undefined')
    preserve_list= node.preserve_scripts;
*/
  let package_json = require (pathes.dest)
  //if(typeof package_json['scripts'] == 'undefined')
  package_json['scripts']={};

  /*package_json['scripts']['start'] = `npx nodemon node_modules/@babel/node/bin/babel-node.js src/index.js`
  package_json['scripts']['distclean'] = `rm -rf ./${dist_folder}`
  package_json['scripts']['build'] = `npm run test && node_modules/@babel/cli/bin/babel.js --out-dir ${dist_folder} ./src && cp package.json ./${dist_folder}`
  package_json['scripts']['build:clean'] = `npm run distclean; npm run build`
  package_json['scripts']['build:patch'] =`npm run build && npm version patch`
  package_json['scripts']['build:minor'] =`npm run build && npm version minor`
  package_json['scripts']['build:major'] =`npm run build && npm version major`*/

//  package_json['devDependencies'] = Object.assign({},package_json['devDependencies'],require(path.join(pathes.files,'devDeps.json')))

  let newPackage = JSON.stringify(package_json,null,'\t');

  cli.tasks.group([
    cli.tasks.file({
      path:pathes.dest,
      data:newPackage,
      describe:()=>`write ${newPackage.length} bytes to ${pathes.dest}`
    })

  ])
  return cli.apply

}
