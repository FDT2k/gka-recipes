const path = require('path')
const validate = require('parameter-validator')

exports.v1.run = (cli)=>(vars)=>{
  let {logger, loggerColors: color,package_dir} = cli

  logger.log(color.red('Copying docker template to package_dir'))

  let {docker_registry,registry_key} = validate(vars,['docker_registry,registry_key']);

  let tasks = [
    cli.folder(path.resolve('./files/docker'),path.join(_package_dir,'docker')),
    cli.file(path.resolve('~/.npmrc'))
  ]

  return cli.tasks(tasks)
}
