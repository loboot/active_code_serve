#!/bin/bash

set -e

pnpm build

rm -rf ActiveCodeDeploy/dist/*  ActiveCodeDeploy/views/*

mkdir -p ActiveCodeDeploy/dist ActiveCodeDeploy/public/admin ActiveCodeDeploy/views

cp ./package.json ActiveCodeDeploy/package.json
cp ./.env ActiveCodeDeploy/.env

cp -r ./views/* ActiveCodeDeploy/views
cp -r ./dist/* ActiveCodeDeploy/dist

echo "打包完成"
