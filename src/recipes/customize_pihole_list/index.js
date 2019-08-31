const path = require('path')
const {validate} = require('parameter-validator')
const uuid = require('uuid/v4');
const fs = require('fs')

exports.v=[]
exports.v[0] =  (context)=>{
  let cli = context();
  let {varStore,log} = cli;



  log.log('Generating Pihole gravity')

  let {package_dir,project_dir,path:dest_path,gravity} = validate(varStore(),['package_dir','project_dir','path','gravity']);

  let tasks = [];


  let pathes = {
    tmp:path.join('/tmp',uuid()),
    dest: path.join(package_dir,'gravity.list')
  }

  let makeDownload = (url,dest)=>{
    return cli.tasks.download({cwd:package_dir,url,dest,describe:()=>`Downloading ${url} into ${dest}`})
  }

  let makeFilter = (file,filter,dest)=>{
    return cli.tasks.filter_file({cwd:package_dir,filter,file,dest,describe:()=>`filtering ${file} with ${filter} into ${dest}`})
  }


  let makeConcat = (files,dest)=>{
    return cli.tasks.concat({cwd:package_dir,files,dest,describe:()=>`concatenating ${files} into ${dest}`})
  }

  let makeTouch = (dest)=>{
    return cli.tasks.touch({path:dest,describe:()=>`creating file ${dest}`})
  }

  /*tasks = gravity.map(item=>{

    return item.filters.map(filter=>)
  })*/
  tasks.push(cli.tasks.mkdir({cwd:'/tmp',dest:pathes.tmp,describe:()=>`creating dir ${pathes.tmp}`}))

  let all_gravity_files = []
  let filter_tasks = gravity.reduce ((acc,list)=>{
    let _dest = path.join(pathes.tmp,uuid());
    let _filter_files = []
    acc.push(makeDownload(list.url,_dest))
    acc = list.filters.reduce((accf, filter)=>{
      let _dest_filter = path.join(pathes.tmp,uuid());
      acc.push(makeTouch(_dest_filter))
      _filter_files.push(_dest_filter)
      acc.push(makeFilter(_dest,filter,_dest_filter));
      return accf;
    },acc)

    let final_dest = path.join(pathes.tmp,uuid());
    acc.push(makeTouch(final_dest))

    all_gravity_files.push(final_dest)
    acc.push(makeConcat(_filter_files,final_dest))

    return acc
  },[])

  tasks = [...tasks,...filter_tasks]

  tasks.push(makeConcat(all_gravity_files,pathes.dest))
//  tasks.push(cli.tasks.remove_folder({path:pathes.tmp,describe:()=>`removing ${pathes.tmp}`}))

  cli.tasks.group(tasks)
  return cli.apply

}
