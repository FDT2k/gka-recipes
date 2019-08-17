#!/bin/bash

dir=$(dirname $0)

destfolder="./docker/prod"


mkdir -p $destfolder/dist;


cp ~/.npmrc $destfolder/npmrc

cp $dirname/Dockerfile $destfolder


cp -a ./src  $destfolder/dist/;

cp  ./package.json $destfolder/dist/package.json


docker build --no-cache  -t registry.gitlab.com/fdt2k/saladin/catalog-store -f $dir/Dockerfile ./docker/prod;

docker push registry.gitlab.com/fdt2k/saladin/catalog-store;
