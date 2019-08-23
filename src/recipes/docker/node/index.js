const path = require('path')
const {validate} = require('parameter-validator')
const fs = require('fs')
const {compose} = require('@geekagency/composite-js')
const DPJ = require ('../../package_json/docker')
exports.v=[]
exports.v[0] =  (context)=>{
  let cli = context()
  let {varStore} = cli;
  let {log} = cli
  let {package_dir,project_dir,path:dest_path} = validate(varStore(),['package_dir','project_dir','path']);

  log.log('Copying docker template to'+package_dir)


  const paths = {
    source: path.join(__dirname,'files','node-prod'),
    dest: path.join(package_dir,'docker'),
    docker_path: path.join(package_dir,'docker','node-prod')
  }

  /*let {combine,asF,makeVarStore} = cli;
  let subVarStore = makeVarStore({...varStore(),docker_path:paths.docker_path,script_key:'build:docker:node'})
  let subContext = combine(context,asF('varStore',subVarStore))*/
  let subContext = cli.createSubContext(context,{docker_path:paths.docker_path,script_key:'build:docker:node'})
  //console.log(subContext().varStore(),subContext().store())


  cli.tasks.group([
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

  cli.store(subContext.store())

  return cli.apply

}
