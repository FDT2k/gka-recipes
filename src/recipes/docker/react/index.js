const path = require('path')
const {validate} = require('parameter-validator')

const SSRRecipe = require('./SSR')
const CSRRecipe = require('./CSR')

exports.v1 = {}
exports.v1.run = (cli)=>(vars)=>{

  let {safeLog} = cli

  safeLog.log('Generating Dockerfiles for React frontend')

  let {package_dir} = validate(vars,['package_dir']);



  SSRRecipe.v1.run(cli)(vars)
  CSRRecipe.v1.run(cli)(vars)
}
